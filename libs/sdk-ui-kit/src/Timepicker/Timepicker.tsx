// (C) 2019-2020 GoodData Corporation
import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import moment from "moment";
import { translationUtils } from "@gooddata/util";
import { IntlWrapper } from "@gooddata/sdk-ui";
import Dropdown, { DropdownBody, DropdownButton } from "@gooddata/goodstrap/lib/Dropdown/Dropdown";

import {
    formatTime,
    normalizeTime as normalizeTimeForPicker,
    updateTime,
    HOURS_IN_DAY,
    TIME_ANCHOR,
} from "./utils/timeUtilities";
import { SelectedTime } from "./typings";
import { OverlayPositionType } from "../typings/overlay";

const DEFAULT_WIDTH = 199;
const MINUTES_IN_HOUR = 60;
const MAX_VISIBLE_ITEMS_COUNT = 10;
// export normalizeTime function for use outside this component
export const normalizeTime = normalizeTimeForPicker;

/**
 * @internal
 */
export interface ITimepickerOwnProps {
    time: Date;
    className?: string;
    maxVisibleItemsCount?: number;
    onChange?: (selectedTime: Date) => void;
    overlayPositionType?: OverlayPositionType;
    overlayZIndex?: number;
    locale?: string;
}

export type TimePickerProps = ITimepickerOwnProps & WrappedComponentProps;

interface ITimePickerState {
    dropdownWidth: number;
    selectedTime: Date;
}

export class WrappedTimepicker extends React.PureComponent<TimePickerProps, ITimePickerState> {
    public dropdownRef = React.createRef<HTMLDivElement>();

    public static defaultProps = {
        className: "",
        maxVisibleItemsCount: MAX_VISIBLE_ITEMS_COUNT,
        time: new Date(),
        onChange: (): void => {},
        overlayZIndex: 0,
    };

    constructor(props: TimePickerProps) {
        super(props);

        this.updateLocaleForMoment();

        this.state = {
            dropdownWidth: DEFAULT_WIDTH,
            selectedTime: normalizeTimeForPicker(props.time || new Date()),
        };
    }

    public componentDidMount(): void {
        this.updateDropdownWidth();
    }

    private getComponentClasses() {
        return `gd-datepicker ${this.props.className} gd-datepicker-input gd-timepicker`;
    }

    private getTimeItems = (selectedTime: SelectedTime) => {
        let currentItem;
        const items = [];

        const { h: hours, m: minutes } = selectedTime;

        for (let h = 0; h < HOURS_IN_DAY; h += 1) {
            for (let m = 0; m < MINUTES_IN_HOUR; m += TIME_ANCHOR) {
                const item = {
                    h,
                    m,
                    title: formatTime(h, m),
                };
                items.push(item);
                if (h === hours && m === minutes) {
                    currentItem = item;
                }
            }
        }

        return { items, currentItem };
    };

    private updateDropdownWidth = () => {
        const { width } = this.dropdownRef.current.getBoundingClientRect();
        this.setState({ dropdownWidth: width });
    };

    private updateLocaleForMoment() {
        moment.locale(translationUtils.sanitizeLocaleForMoment(this.props.intl.locale));
    }

    private handleTimeChanged = (newlySelectedTime: SelectedTime) => {
        if (!newlySelectedTime) {
            return;
        }

        const { h, m } = newlySelectedTime;
        const selectedTime = updateTime(h, m);

        this.setState({ selectedTime }, () => this.props.onChange(selectedTime));
    };

    public render(): React.ReactNode {
        const { overlayPositionType, maxVisibleItemsCount, overlayZIndex } = this.props;
        const { dropdownWidth, selectedTime } = this.state;
        const time = {
            h: selectedTime.getHours(),
            m: selectedTime.getMinutes(),
        };
        const { items, currentItem } = this.getTimeItems(time);

        return (
            <div className={this.getComponentClasses()} ref={this.dropdownRef}>
                <Dropdown
                    overlayPositionType={overlayPositionType}
                    alignPoints={[
                        {
                            align: "bl tl",
                        },
                        {
                            align: "tl bl",
                        },
                    ]}
                    button={<DropdownButton value={formatTime(time.h, time.m)} iconLeft="icon-timer" />}
                    body={
                        <DropdownBody
                            width={dropdownWidth}
                            items={items}
                            maxVisibleItemsCount={maxVisibleItemsCount}
                            selection={currentItem}
                            onSelect={this.handleTimeChanged}
                        />
                    }
                    overlayZIndex={overlayZIndex}
                />
            </div>
        );
    }
}

const TimePickerWithIntl = injectIntl(WrappedTimepicker);

/**
 * @internal
 */
export class Timepicker extends React.PureComponent<ITimepickerOwnProps> {
    public render(): React.ReactNode {
        return (
            <IntlWrapper locale={this.props.locale}>
                <TimePickerWithIntl {...this.props} />
            </IntlWrapper>
        );
    }
}
