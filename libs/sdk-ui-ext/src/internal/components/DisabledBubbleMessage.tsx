// (C) 2019 GoodData Corporation
import React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import cx from "classnames";
import { Bubble, BubbleHoverTrigger } from "@gooddata/sdk-ui-kit";
import { getTranslation } from "../utils/translations";

export interface IBubbleMessageOwnProps {
    showDisabledMessage: boolean;
    className?: string;
}

export type IBubbleMessageProps = IBubbleMessageOwnProps & WrappedComponentProps;

export class DisabledBubbleMessage extends React.PureComponent<IBubbleMessageProps> {
    public render(): React.ReactNode {
        const { className, children, intl } = this.props;
        return (
            <BubbleHoverTrigger className={className}>
                {children}
                <Bubble className={this.getBubbleClassNames()} alignPoints={[{ align: "cr cl" }]}>
                    {getTranslation("properties.not_applicable", intl)}
                </Bubble>
            </BubbleHoverTrigger>
        );
    }

    private getBubbleClassNames(): string {
        return cx("bubble-primary", {
            invisible: !this.props.showDisabledMessage,
        });
    }
}

export default injectIntl<"intl", IBubbleMessageProps>(DisabledBubbleMessage);
