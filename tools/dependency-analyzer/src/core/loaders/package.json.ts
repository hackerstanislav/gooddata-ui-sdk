// (C) 2021-2022 GoodData Corporation
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";
import * as path from "path";
import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";

import { CoreError } from "../errors";
import { readJsonAsync, ReadJsonErrors } from "../inpure";

export type PackageJsonErrors = ReadJsonErrors;
export type PackageJson = JSONSchemaForNPMPackageJsonFiles;

export function loadPackageJson(directory: string): TE.TaskEither<CoreError<PackageJsonErrors>, PackageJson> {
    return F.pipe(
        path.join(directory, "package.json"),
        readJsonAsync,
        TE.map((r) => r as PackageJson),
    );
}
