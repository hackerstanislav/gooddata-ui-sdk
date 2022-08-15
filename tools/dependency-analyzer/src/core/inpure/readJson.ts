// (C) 2021-2022 GoodData Corporation
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";

import { CoreError } from "../errors";
import { readFileAsync, ReadFileErrors } from "./readFile";
import { parseJson, ParseJsonErrors } from "./parseJson";

export type ReadJsonErrors = ReadFileErrors | ParseJsonErrors;

export function readJsonAsync<T>(path: string): TE.TaskEither<CoreError<ReadJsonErrors>, T> {
    return F.pipe(
        path,
        readFileAsync,
        TE.chainW(parseContent),
        TE.map((a) => a as T),
    );
}

function parseContent(content: string) {
    return F.pipe(content, parseJson, TE.fromEither);
}
