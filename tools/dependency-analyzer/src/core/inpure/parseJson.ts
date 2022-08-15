// (C) 2021-2022 GoodData Corporation
import * as E from "fp-ts/Either";
import { parse } from "comment-json";

import error, { CoreError } from "../errors";

export type ParseJsonErrors = "invalid-json";

export function parseJson(content: string): E.Either<CoreError<ParseJsonErrors>, any> {
    return E.tryCatch(
        () => parse(content, undefined, true),
        (err: Error) => error("invalid-json", "", "", E.left(err)),
    );
}
