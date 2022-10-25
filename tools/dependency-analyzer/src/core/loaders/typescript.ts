// (C) 2021-2022 GoodData Corporation
import * as TE from "fp-ts/TaskEither";

import * as ts from "typescript";

import { readAstAsync, ReadAstErrors } from "../inpure";
import { CoreError } from "../errors";

export type SourceFile = ts.SourceFile;
export type ReadTypescriptErrors = ReadAstErrors;

export function readTypescript(
    path: string,
    content: string,
): TE.TaskEither<CoreError<ReadTypescriptErrors>, SourceFile> {
    return readAstAsync(path, content);
}
