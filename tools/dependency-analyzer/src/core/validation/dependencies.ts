// (C) 2021-2022 GoodData Corporation
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import * as F from "fp-ts/function";

import { ProjectsInfo } from "../processors";

export function validateLocalDependencies(localDependencies: ProjectsInfo["dependencies"]["local"]) {
    F.pipe(R.keys(localDependencies), A.map(validateLocalDependency(localDependencies)));
}

function validateLocalDependency(localDependencies: ProjectsInfo["dependencies"]["local"]) {
    return (dep: string) => {};
}
