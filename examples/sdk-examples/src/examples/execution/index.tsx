// (C) 2007-2019 GoodData Corporation
/* eslint-disable import/no-unresolved,import/default */
import React from "react";

import { ExecuteExample } from "./ExecuteExample";
import { ExecuteWithSlicesExample } from "./ExecuteWithSlicesExample";
import { ExecuteAttributeValuesExample } from "./ExecuteAttributeValuesExample";
import { ExecuteWithCustomVisualizationExample } from "./ExecuteWithCustomVisualizationExample";
import { UseDataViewExample } from "./UseDataViewExample";
import { UseDataViewWithSlicesExample } from "./UseDataViewWithSlicesExample";
import { UseDataViewAttributeValuesExample } from "./UseDataViewAttributeValuesExample";
import { UseDataViewWithCustomVisualizationExample } from "./UseDataViewWithCustomVisualizationExample";
import { ExampleWithSource } from "../../components/ExampleWithSource";

import ExecuteExampleSRC from "./ExecuteExample?raw";
import ExecuteWithSlicesExampleSRC from "./ExecuteWithSlicesExample?raw";
import ExecuteAttributeValuesExampleSRC from "./ExecuteAttributeValuesExample?raw";
import ExecuteWithCustomVisualizationExampleSRC from "./ExecuteWithCustomVisualizationExample?raw";
import UseDataViewExampleSRC from "./UseDataViewExample?raw";
import UseDataViewWithSlicesExampleSRC from "./UseDataViewWithSlicesExample?raw";
import UseDataViewAttributeValuesExampleSRC from "./UseDataViewAttributeValuesExample?raw";
import UseDataViewWithCustomVisualizationExampleSRC from "./UseDataViewWithCustomVisualizationExample?raw";

import ExecuteExampleSRCJS from "./ExecuteExample?rawJS";
import ExecuteWithSlicesExampleSRCJS from "./ExecuteWithSlicesExample?rawJS";
import ExecuteAttributeValuesExampleSRCJS from "./ExecuteAttributeValuesExample?rawJS";
import ExecuteWithCustomVisualizationExampleSRCJS from "./ExecuteWithCustomVisualizationExample?rawJS";
import UseDataViewExampleSRCJS from "./UseDataViewExample?rawJS";
import UseDataViewWithSlicesExampleSRCJS from "./UseDataViewWithSlicesExample?rawJS";
import UseDataViewAttributeValuesExampleSRCJS from "./UseDataViewAttributeValuesExample?rawJS";
import UseDataViewWithCustomVisualizationExampleSRCJS from "./UseDataViewWithCustomVisualizationExample?rawJS";

export const Execute: React.FC = () => (
    <div>
        <h1>Execute</h1>

        <p>
            The Execute component allows you to trigger execution and send its result to the function that you
            have chosen to use and have implemented. The Execute component provides a curated API through
            which you specify data series that you would like to calculate and optionally sliced by some
            attribute values. The result passed to to your function provides convenience functions to access
            the computed data points.
        </p>

        <hr className="separator" />

        <p>
            This example of Execute component shows how to obtain a single formatted value and use it as a
            custom-made KPI.
        </p>

        <ExampleWithSource for={ExecuteExample} source={ExecuteExampleSRC} sourceJS={ExecuteExampleSRCJS} />

        <hr className="separator" />

        <p>
            This example of Execute component shows how to obtain and work with data series sliced by multiple
            attributes.
        </p>

        <ExampleWithSource
            for={ExecuteWithSlicesExample}
            source={ExecuteWithSlicesExampleSRC}
            sourceJS={ExecuteWithSlicesExampleSRCJS}
        />

        <hr className="separator" />

        <p>
            This example of Execute component shows how to obtain data and use them in a custom visualization.
        </p>

        <ExampleWithSource
            for={ExecuteWithCustomVisualizationExample}
            source={ExecuteWithCustomVisualizationExampleSRC}
            sourceJS={ExecuteWithCustomVisualizationExampleSRCJS}
        />

        <h1>RawExecute</h1>
        <p>
            The RawExecute components allows you trigger execution and send its result to the function that
            you have chosen to use and have implemented. The RawExecute provides no guidelines and allows you
            to construct any execution you would like using the underlying backend APIs.
        </p>

        <hr className="separator" />

        <ExampleWithSource
            for={ExecuteAttributeValuesExample}
            source={ExecuteAttributeValuesExampleSRC}
            sourceJS={ExecuteAttributeValuesExampleSRCJS}
        />

        <h1>useExecution &amp; useDataView</h1>

        <p>
            useExecution &amp; useDataView hooks are an alternative to Execute &amp; RawExecute components.
            The advantage of the hooks over these components is that they do not depend on rendering, and it
            {"'"}s easy to compose them. They are useful for dealing with more complex use cases and data
            flows (for example, to prevent nested Execute components when one execution depends on another).
        </p>

        <hr className="separator" />

        <p>
            This example of useExecution &amp; useDataView hooks shows how to obtain a single formatted value
            and use it as a custom-made KPI.
        </p>

        <ExampleWithSource
            for={UseDataViewExample}
            source={UseDataViewExampleSRC}
            sourceJS={UseDataViewExampleSRCJS}
        />

        <hr className="separator" />

        <p>
            This example of useExecution &amp; useDataView hooks shows how to obtain and work with data series
            sliced by multiple attributes.
        </p>

        <ExampleWithSource
            for={UseDataViewWithSlicesExample}
            source={UseDataViewWithSlicesExampleSRC}
            sourceJS={UseDataViewWithSlicesExampleSRCJS}
        />

        <hr className="separator" />

        <p>
            This example of useExecution &amp; useDataView hooks shows how to obtain data and use them in a
            custom visualization.
        </p>

        <ExampleWithSource
            for={UseDataViewWithCustomVisualizationExample}
            source={UseDataViewWithCustomVisualizationExampleSRC}
            sourceJS={UseDataViewWithCustomVisualizationExampleSRCJS}
        />

        <p>RawExecute component replaced by useDataView hook example</p>

        <hr className="separator" />

        <ExampleWithSource
            for={UseDataViewAttributeValuesExample}
            source={UseDataViewAttributeValuesExampleSRC}
            sourceJS={UseDataViewAttributeValuesExampleSRCJS}
        />
    </div>
);
