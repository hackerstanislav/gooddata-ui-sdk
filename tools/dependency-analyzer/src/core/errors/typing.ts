// (C) 2021-2022 GoodData Corporation
import * as E from "fp-ts/Either";

export type CoreError<T> = {
    type: T;
    readable: string;
    detail: string;
    error: E.Either<Error, void>;
};
