// (C) 2021-2022 GoodData Corporation
import { ExtractorConfig } from "@microsoft/api-extractor";
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";
import * as path from "path";

import { CoreError } from "../errors";

import { readApiExtractorJsonAsync, ReadApiExtractorErrors } from "../inpure";

export type ApiExtractorJsonErrors = ReadApiExtractorErrors;
export type ApiExtractorJson = ExtractorConfig | null;

export function loadApiExtractorJson(
    directory: string,
): TE.TaskEither<CoreError<ApiExtractorJsonErrors>, ApiExtractorJson> {
    return F.pipe(path.join(directory, "api-extractor.json"), readApiExtractorJsonAsync);
}
