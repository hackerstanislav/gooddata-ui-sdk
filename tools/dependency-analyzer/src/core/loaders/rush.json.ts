// (C) 2021-2022 GoodData Corporation
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as path from "path";

import { CoreError } from "../errors";
import { readJsonAsync, ReadJsonErrors } from "../inpure";

export type RushJsonErrors = ReadJsonErrors;
export type RushJson = {
    path: string;
    projects: Array<{
        packageName: string;
        projectFolder: string;
        reviewCategory: string;
        versionPolicyName: string;
        shouldPublish: boolean;
    }>;
};

export function loadRushJson(directory: string): TE.TaskEither<CoreError<RushJsonErrors>, RushJson> {
    const rushPath = path.join(directory, "rush.json");

    return pipe(
        rushPath,
        readJsonAsync,
        TE.map((r) => r as RushJson),
        TE.map((r) => ({ ...r, path: rushPath })),
    );
}
