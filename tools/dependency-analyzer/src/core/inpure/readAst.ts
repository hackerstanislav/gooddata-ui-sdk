// (C) 2021-2022 GoodData Corporation
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";

import * as ts from "typescript";

import error, { CoreError } from "../errors";

export type ReadAstErrors = "parse-typescript-file";

export function readAstAsync(
    path: string,
    content: string,
): TE.TaskEither<CoreError<ReadAstErrors>, ts.SourceFile> {
    return F.pipe(
        TE.tryCatch(
            () => parseAst(path, content),
            (err: Error) => error("parse-typescript-file", "", "", E.left(err)),
        ),
    );
}

function parseAst(path: string, content: string): Promise<ts.SourceFile> {
    return new Promise((resolve, reject) => {
        try {
            resolve(ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true));
        } catch (e) {
            reject(e);
        }
    });
}
