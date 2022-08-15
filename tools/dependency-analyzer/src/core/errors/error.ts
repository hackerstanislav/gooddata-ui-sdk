// (C) 2021-2022 GoodData Corporation
import * as E from "fp-ts/Either";

import { CoreError } from "./typing";

export default function <T>(
    type: T,
    readable: string,
    detail: string = "",
    error: E.Either<Error, null> = E.right(null),
): CoreError<T> {
    return {
        type,
        detail,
        error,
        readable,
    };
}
