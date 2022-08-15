// (C) 2021-2022 GoodData Corporation
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";

import * as fs from "fs";

import error, { CoreError } from "../errors";

export type ReadFileErrors = "read-file";

export function readFileAsync(path: string): TE.TaskEither<CoreError<ReadFileErrors>, string> {
    return F.pipe(
        TE.tryCatch(
            () => readContent(path),
            (err: Error) => error("read-file", "", "", E.left(err)),
        ),
    );
}

function readContent(path: string): Promise<string> {
    return new Promise((resolve, reject) =>
        fs.readFile(path, "utf8", (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        }),
    );
}
