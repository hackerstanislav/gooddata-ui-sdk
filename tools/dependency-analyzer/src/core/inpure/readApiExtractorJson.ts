// (C) 2021-2022 GoodData Corporation
import { ExtractorConfig } from "@microsoft/api-extractor";
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";

import error, { CoreError } from "../errors";

export type ReadApiExtractorErrors = "read-config";

export function readApiExtractorJsonAsync(
    path: string,
): TE.TaskEither<CoreError<ReadApiExtractorErrors>, ExtractorConfig | null> {
    return F.pipe(path, readFileAsync);
}

function readFileAsync(
    path: string,
): TE.TaskEither<CoreError<ReadApiExtractorErrors>, ExtractorConfig | null> {
    return F.pipe(
        TE.tryCatch(
            () =>
                new Promise<ExtractorConfig>((resolve) => resolve(ExtractorConfig.loadFileAndPrepare(path))),
            (err: Error) => error("read-config", "", "", E.left(err)),
        ),
        TE.orElse(() => TE.right(null)),
    );
}
