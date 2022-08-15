// (C) 2021-2022 GoodData Corporation
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import { loadRushJson } from "./loaders";
import { processRushJson } from "./processors";

export type DependencyAnalyzerOptions = {
    entry: string;
};

export default function ({ entry = process.cwd() }: DependencyAnalyzerOptions) {
    return F.pipe(
        loadProjectsInfo(entry),
        TE.match(
            (e) => {
                // eslint-disable-next-line no-console
                console.log("[ERROR]: ", JSON.stringify(e));
            },
            (d) => {
                // eslint-disable-next-line no-console
                console.log("SUCCESS!!", d);
            },
        ),
    );
}

function loadProjectsInfo(entry: string) {
    return F.pipe(loadRushJson(entry), TE.map(processRushJson), TE.flattenW);
}
