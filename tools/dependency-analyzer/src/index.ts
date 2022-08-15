// (C) 2021-2022 GoodData Corporation

import projects from "./core";

async function run() {
    await projects({
        entry: "/Users/stanislav.hacker/repositories/gooddata/gooddata-ui-sdk/",
    })();
}

run();
