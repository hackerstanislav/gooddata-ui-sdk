// (C) 2021-2022 GoodData Corporation
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";

import { ProjectsInfo } from "../processors";

type ValidationState = {
    modules: ProjectsInfo["dependencies"]["local"];
    visited: Record<string, boolean>;
    stack: Record<string, boolean>;
};

export function validateLoop(
    localDependencies: ProjectsInfo["dependencies"]["local"],
): E.Either<NodeLoopError, null> {
    return F.pipe(R.keys(localDependencies), (modules) =>
        processModules(
            {
                modules: localDependencies,
                visited: fillFalse(modules),
                stack: fillFalse(modules),
            },
            modules,
            [],
        ),
    );
}

function fillFalse(modules: string[]) {
    return F.pipe(
        modules,
        A.reduce({} as Record<string, boolean>, (acc, item) => F.pipe(acc, R.upsertAt(item, false))),
    );
}

function checkCycle(
    state: ValidationState,
): (module: string, path: string[]) => E.Either<NodeLoopError, null> {
    return (module, path) =>
        F.pipe(
            E.right({
                stacked: !!state.stack[module],
                visited: !!state.visited[module],
            } as NodeInfo),
            retrieveLoop(path),
            E.flattenW,
            retrieveVisited(),
            E.flattenW,
            E.chain(processModule(state, module, path)),
            E.orElse((e) => {
                if (e.type === "visited") {
                    return E.right(null);
                }
                return E.left(e);
            }),
        );
}

type NodeInfo = {
    visited: boolean;
    stacked: boolean;
};

type NodeLoopError = {
    type: "loop";
    path: string[];
};

type NodeVisitedError = {
    type: "visited";
};

function retrieveLoop<R>(path: string[]) {
    return (value: E.Either<R, NodeInfo>) => {
        return F.pipe(
            value,
            E.fromPredicate(
                (pred) =>
                    F.pipe(
                        pred,
                        E.map((e) => !e.stacked),
                        E.getOrElse(() => true),
                    ),
                () => ({ type: "loop", path } as NodeLoopError),
            ),
        );
    };
}

function retrieveVisited<R>() {
    return (value: E.Either<R, NodeInfo>) => {
        return F.pipe(
            value,
            E.fromPredicate(
                (pred) =>
                    F.pipe(
                        pred,
                        E.map((e) => !e.visited),
                        E.getOrElse(() => true),
                    ),
                () => ({ type: "visited" } as NodeVisitedError),
            ),
        );
    };
}

function processModules<ER extends NodeLoopError | NodeVisitedError>(
    state: ValidationState,
    modules: string[],
    path: string[],
) {
    const isCycle = checkCycle(state);
    return F.pipe(
        modules,
        A.map((module) => isCycle(module, [...path, module])),
        E.sequenceArray,
        E.match(
            (l) => E.left(l as ER),
            () => E.right<ER, null>(null),
        ),
    );
}

function processModule<ER extends NodeLoopError | NodeVisitedError>(
    state: ValidationState,
    module: string,
    path: string[],
): () => E.Either<ER, null> {
    return () => {
        state.visited = { ...F.pipe(state.visited, R.upsertAt(module, true)) };
        state.stack = { ...F.pipe(state.stack, R.upsertAt(module, true)) };

        const res = processModules<ER>(state, state.modules[module], path);

        state.stack = { ...F.pipe(state.stack, R.upsertAt(module, false)) };

        return res;
    };
}
