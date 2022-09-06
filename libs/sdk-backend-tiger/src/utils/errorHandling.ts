// (C) 2019-2022 GoodData Corporation
import {
    AnalyticalBackendError,
    isAnalyticalBackendError,
    NotAuthenticated,
    UnexpectedError,
    LimitReached,
    ContractExpired,
} from "@gooddata/sdk-backend-spi";
import { AxiosError } from "axios";

export function convertApiError(error: Error): AnalyticalBackendError {
    if (isAnalyticalBackendError(error)) {
        return error;
    }

    const notAuthenticated = createNotAuthenticatedError(error);

    if (notAuthenticated) {
        throw notAuthenticated;
    }

    const limitReached = createLimitReachedError(error);

    if (limitReached) {
        throw limitReached;
    }

    const contractExpired = createContractExpiredError(error);

    if (contractExpired) {
        throw contractExpired;
    }

    return new UnexpectedError("An unexpected error has occurred", error);
}

export function createNotAuthenticatedError(error: Error): NotAuthenticated | undefined {
    const axiosErrorResponse = (error as AxiosError).response;

    if (!axiosErrorResponse || axiosErrorResponse.status !== 401) {
        return;
    }

    const exc = new NotAuthenticated("No session or session expired", error);

    // TODO: TIGER-HACK both of these params need to come from the backend.
    //  current problems:
    //  - some resources do not send login URL (empty 401), some do
    //  - no resources send returnRedirectParam
    exc.authenticationFlow = {
        loginUrl: "/appLogin",
        returnRedirectParam: "redirectTo",
    };

    return exc;
}

function createLimitReachedError(error: Error): LimitReached | undefined {
    const axiosErrorResponse = (error as AxiosError).response;

    if (
        !axiosErrorResponse ||
        axiosErrorResponse.status !== 400 ||
        !axiosErrorResponse.data?.detail?.includes("Reached plan limits")
    ) {
        return;
    }

    return new LimitReached("The limit reached. Upgrade your plan to create more objects.", error);
}

function createContractExpiredError(error: Error): ContractExpired | undefined {
    const axiosErrorResponse = (error as AxiosError).response;

    if (
        !axiosErrorResponse ||
        axiosErrorResponse.status !== 403 ||
        !axiosErrorResponse.data?.detail?.includes("Contract expired")
    ) {
        return;
    }

    return new ContractExpired(axiosErrorResponse.data.tier, error);
}
