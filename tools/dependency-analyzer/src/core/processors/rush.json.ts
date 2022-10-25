// (C) 2021-2022 GoodData Corporation
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as AP from "fp-ts/Apply";
import * as R from "fp-ts/Record";
import * as EQ from "fp-ts/Eq";
import * as F from "fp-ts/function";
import * as path from "path";

import { CoreError } from "../errors";
import { validateLoop } from "../validation/dependencies";
import {
    RushJson,
    PackageJson,
    PackageJsonErrors,
    loadPackageJson,
    ApiExtractorJson,
    ApiExtractorJsonErrors,
    loadApiExtractorJson,
} from "../loaders";

export type ProcessRushJsonErrors = PackageJsonErrors | ApiExtractorJsonErrors;

export type ProjectsInfo = {
    packages: Record<string, PackageInfo>;
    dependencies: {
        local: Record<string, string[]>;
        external: Record<string, string[]>;
    };
    loop?: string[];
};

export type PackageInfo = {
    name: string;
    version: string;
    public: boolean;
    packageJson: PackageJson;
    apiExtractorJson: ApiExtractorJson;
};

export function processRushJson(
    rushJson: RushJson,
): TE.TaskEither<CoreError<ProcessRushJsonErrors>, ProjectsInfo> {
    const projectsInfo: Partial<ProjectsInfo> = {};

    return F.pipe(
        TE.right(projectsInfo),
        TE.chainW(fillPackages(rushJson)),
        TE.chainW(fillDependencies()),
        TE.chainW(fillLoop()),
    );
}

//package

function fillPackages(rushJson: RushJson) {
    return (a: any) => {
        return F.pipe(
            rushJson,
            processProjects,
            TE.map((packages) => ({ ...a, packages })),
        );
    };
}

function processProjects(rushJson: RushJson) {
    const directory = path.dirname(rushJson.path);

    return F.pipe(
        rushJson.projects,
        A.map((project) => processProject(directory, project)),
        A.sequence(TE.taskEither),
        TE.map(mapPackageInfo),
    );
}

function processProject(directory: string, rushProjectJson: RushJson["projects"][number]) {
    const packageJsonFile = F.pipe(
        TE.right(rushProjectJson),
        TE.chainW((a) => F.pipe(path.join(directory, a.projectFolder), loadPackageJson)),
    );

    const apiExtractorJsonFile = F.pipe(
        TE.right(rushProjectJson),
        TE.chainW((a) => F.pipe(path.join(directory, a.projectFolder), loadApiExtractorJson)),
    );

    return F.pipe(
        AP.sequenceS(TE.ApplyPar)({
            packageJson: packageJsonFile as TE.TaskEither<CoreError<any>, PackageJson>,
            apiExtractorJson: apiExtractorJsonFile as TE.TaskEither<CoreError<any>, ApiExtractorJson>,
        }),
        TE.map(createPackageJson(rushProjectJson)),
    );
}

function createPackageJson(rushProjectJson: RushJson["projects"][number]) {
    return ({
        packageJson,
        apiExtractorJson,
    }: {
        packageJson: PackageJson;
        apiExtractorJson: ApiExtractorJson;
    }) =>
        ({
            name: rushProjectJson.packageName,
            public: rushProjectJson.shouldPublish,
            version: packageJson.version,
            packageJson,
            apiExtractorJson,
        } as PackageInfo);
}

function mapPackageInfo(packagesInfo: PackageInfo[]): ProjectsInfo["packages"] {
    return F.pipe(
        packagesInfo,
        A.reduce({} as ProjectsInfo["packages"], (prev, current) => ({ ...prev, [current.name]: current })),
    );
}

//dependencies

function fillDependencies() {
    const localFilter: DependencyFilter = (packages) => (dep) => !!packages[dep];
    const externalFilter: DependencyFilter = (packages) => (dep) => !packages[dep];

    return (obj: Pick<ProjectsInfo, "packages">) =>
        F.pipe(
            processDependencies(obj.packages),
            TE.right,
            TE.map((dependencies) => ({
                ...obj,
                dependencies: {
                    local: filter(obj.packages, dependencies, localFilter),
                    external: filter(obj.packages, dependencies, externalFilter),
                },
            })),
        );
}

type DependencyFilter = (packages: ProjectsInfo["packages"]) => (dep: string) => boolean;
function filter(
    packages: ProjectsInfo["packages"],
    dependencies: Record<string, string[]>,
    fb: DependencyFilter,
) {
    const filter = fb(packages);

    return F.pipe(
        dependencies,
        R.map((e) => F.pipe(e, A.filter(filter))),
    );
}

function processDependencies(packages: ProjectsInfo["packages"]) {
    return F.pipe(
        packages,
        R.map((info) => collectDependencies(info.packageJson)),
    );
}

function collectDependencies(packageJson: PackageJson) {
    return F.pipe(
        [
            ...R.keys(packageJson.dependencies || {}),
            ...R.keys(packageJson.devDependencies || {}),
            ...R.keys(packageJson.optionalDependencies || {}),
            ...R.keys(packageJson.peerDependencies || {}),
        ],
        A.uniq(EQ.fromEquals((a, b) => a === b)),
    );
}

//loops

function fillLoop() {
    return (obj: Pick<ProjectsInfo, "dependencies" | "packages">) =>
        F.pipe(
            validateLoop(obj.dependencies.local),
            E.map(() => ({ ...obj })),
            E.orElse(({ path }) => E.right({ ...obj, loop: path })),
            TE.fromEither,
        );
}
