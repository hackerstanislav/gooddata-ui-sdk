// (C) 2022 GoodData Corporation
import { ReferenceMd } from "@gooddata/reference-workspace";
import { modifyAttribute, modifyMeasure, newBucket, newInsightDefinition } from "@gooddata/sdk-model";
import { BucketNames } from "@gooddata/sdk-ui";
import { FunnelChartDescriptor } from "../FunnelChartDescriptor";

describe("FunnelChartDescriptor", () => {
    it("should generate embedding code without context", () => {
        // TODO replace by some recording?
        const insight = newInsightDefinition("local:funnel", (i) =>
            i.buckets([
                newBucket(
                    BucketNames.MEASURES,
                    modifyMeasure(ReferenceMd.Amount, (m) =>
                        m.alias("Custom Amount alias").localId("amount-custom-local-id"),
                    ),
                ),
                newBucket(
                    BucketNames.VIEW,
                    modifyAttribute(ReferenceMd.Region, (a) =>
                        a.alias("Custom Region alias").localId("region-custom-local-id"),
                    ),
                ),
            ]),
        );
        const descriptor = new FunnelChartDescriptor();

        expect(descriptor.getEmbeddingCode(insight)).toMatchSnapshot();
    });
});
