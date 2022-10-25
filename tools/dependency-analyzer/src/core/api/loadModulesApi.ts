// (C) 2021-2022 GoodData Corporation
import {
    Extractor,
    ExtractorConfig,
    ExtractorMessageCategory,
    ExtractorMessage,
} from "@microsoft/api-extractor";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import * as F from "fp-ts/function";

import error, { CoreError } from "../errors";
import { readFileAsync, ReadFileErrors } from "../inpure";
import { ProjectsInfo, PackageInfo } from "../processors";
import { readTypescript, SourceFile, ReadTypescriptErrors } from "../loaders";

export type ModuleApi = {
    module: string;
    ast: SourceFile;
    errorCount: number;
    warningCount: number;
    apiReportChanged: boolean;
    succeeded: boolean;
    messages: ExtractorMessage[];
};

export type ModuleApiErrors = "extract-api" | ReadFileErrors | ReadTypescriptErrors;

export function loadModulesApi(
    projectInfo: ProjectsInfo,
): TE.TaskEither<CoreError<ModuleApiErrors>, Record<string, ModuleApi>> {
    return F.pipe(projectInfo, collectValidModules, extractApis, TE.map(extractAst), TE.flattenW);
}

function collectValidModules(projectInfo: ProjectsInfo) {
    return F.pipe(
        projectInfo.packages,
        R.filter(({ apiExtractorJson }) => Boolean(apiExtractorJson)),
    );
}

function extractApis(packageInfos: Record<string, PackageInfo>) {
    return F.pipe(
        packageInfos,
        R.map(extractApi),
        R.collect((_, v) => v),
        TE.sequenceArray,
        TE.map((a) =>
            F.pipe(
                a,
                A.reduce({} as Record<string, typeof a[number]>, (prev, a) => ({ ...prev, [a.module]: a })),
            ),
        ),
    );
}

//extractor

type ModuleApiRaw = Omit<ModuleApi, "ast"> & { content: string; path: string };

function extractApi(packageInfo: PackageInfo): TE.TaskEither<CoreError<ModuleApiErrors>, ModuleApiRaw> {
    const { name, apiExtractorJson } = packageInfo;
    const path = apiExtractorJson.untrimmedFilePath;

    return F.pipe(
        invokeExtractor(apiExtractorJson, path),
        TE.fromEither,
        TE.chainW(({ succeeded, apiReportChanged, errorCount, warningCount, messages }) =>
            F.pipe(
                readFileAsync(path),
                TE.orElse(() => TE.right("")),
                TE.map(
                    (content) =>
                        ({
                            module: name,
                            content,
                            path,
                            errorCount,
                            warningCount,
                            apiReportChanged,
                            succeeded,
                            messages,
                        } as ModuleApiRaw),
                ),
            ),
        ),
    );
}

function invokeExtractor(config: ExtractorConfig, path: string) {
    return E.tryCatch(
        () => {
            const messages: ExtractorMessage[] = [];
            const data = Extractor.invoke(
                {
                    ...config,
                    apiReportEnabled: false,
                    docModelEnabled: false,
                    rollupEnabled: true,
                    untrimmedFilePath: path,
                } as ExtractorConfig,
                {
                    localBuild: true,
                    messageCallback: (message) => {
                        switch (message.category) {
                            case ExtractorMessageCategory.Extractor:
                            case ExtractorMessageCategory.TSDoc:
                            case ExtractorMessageCategory.Compiler:
                                messages.push(message);
                                break;
                            default:
                                break;
                        }
                        message.handled = true;
                    },
                },
            );

            return {
                ...data,
                messages,
            };
        },
        (err: Error) => error("extract-api" as ModuleApiErrors, "", "", E.left(err)),
    );
}

function extractAst(
    modulesMap: Record<string, ModuleApiRaw>,
): TE.TaskEither<CoreError<ReadTypescriptErrors>, Record<string, ModuleApi>> {
    return F.pipe(
        modulesMap,
        R.map(({ path, content }) => readTypescript(path, content)),
        remapSourceFiles,
        remapModuleApi(modulesMap),
    );
}

function remapSourceFiles(tasks: Record<string, TE.TaskEither<CoreError<ReadTypescriptErrors>, SourceFile>>) {
    return F.pipe(tasks, R.toEntries, A.unzip, ([modules, asts]) =>
        F.pipe(
            asts,
            TE.sequenceArray,
            TE.map((sourcesFiles: SourceFile[]) => F.pipe(modules, A.zip(sourcesFiles), R.fromEntries)),
        ),
    );
}

function remapModuleApi(modulesMap: Record<string, ModuleApiRaw>) {
    return (task: TE.TaskEither<CoreError<ReadTypescriptErrors>, Record<string, SourceFile>>) =>
        F.pipe(
            task,
            TE.map((data) =>
                F.pipe(
                    data,
                    R.mapWithIndex((key, ast) =>
                        F.pipe({ ...modulesMap[key], ast }, R.deleteAt("content"), R.deleteAt("path")),
                    ),
                    R.map((a) => a as ModuleApi),
                ),
            ),
        );
}
