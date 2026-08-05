import { DoInfo, TimePeriod } from "@/types";
import { useState } from "react";
import TaskDoDateDisplay from "../schedule-items/tasks/TaskDoDateDisplay";
import { autoUpdate, flip, FloatingNode, FloatingPortal, FloatingTree, offset, shift, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";
import Divider from "../Divider";
import TimeSelector from "./TimeSelector";
import RecurrenceSelector from "./RecurrenceSelector";
import ScheduleSuggestList from "./ScheduleSuggestList";
import { getBaseDoInfo, getTodayString, getTomorrowString } from "@/utils/dateUtils";

const DatePicker = ({doInfo, onChange}: {
    doInfo: DoInfo | null,
    onChange: (doInfo: DoInfo | null) => void
}) => {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    // schedule suggestions
    const handleToToday = () => {
        const oldDoInfo: DoInfo = doInfo ?? getBaseDoInfo();
        const newDoInfo: DoInfo = {...oldDoInfo, date: getTodayString()};

        onChange(newDoInfo);
        setPopupOpen(false);
    };

    const handleToTomorrow = () => {
        const oldDoInfo: DoInfo = doInfo ?? getBaseDoInfo();
        const newDoInfo: DoInfo = {...oldDoInfo, date: getTomorrowString()};

        onChange(newDoInfo);
        setPopupOpen(false);
    };

    const handleToNoDate = () => {
        onChange(null);
        setPopupOpen(false);
    }

    // time
    const handleRemoveTime = () => {
        const oldDoInfo: DoInfo = doInfo ?? getBaseDoInfo();
        const newDoInfo: DoInfo = {...oldDoInfo, timePeriod: null};

        onChange(newDoInfo);
    }

    const handleUpdateTime = (timePeriod: TimePeriod, duration: number, timezone: string | null) => {
        const oldDoInfo: DoInfo = doInfo ?? getBaseDoInfo();
        const newDoInfo: DoInfo = {...oldDoInfo,
            timePeriod, duration, timezone
        };

        onChange(newDoInfo);
    }

    // recurrence
    const handleUpdateRecurrence = (rrule: string | null) => {
        if(!rrule) return;
        const oldDoInfo: DoInfo = doInfo ?? getBaseDoInfo();
        const newDoInfo: DoInfo = {...oldDoInfo, recurrence: {
            ...oldDoInfo.recurrence,
            rrule
        }};

        onChange(newDoInfo);
    }

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
        open: popupOpen,
        onOpenChange: setPopupOpen,
        placement: "top-end",
        middleware: [
            offset(10), 
            flip({ 
                fallbackPlacements: [
                    "top-start",
                    "right", 
                    "bottom-end",
                ],
                padding: 5 
            }), 
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        bubbles: false,
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context, { role: "combobox" });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const floatingRoot = document.getElementById("floating-root");

    return (
        <FloatingTree>
            <FloatingNode id={nodeId}>
                <button
                    onClick={togglePopupOpen}
                    ref={refs.setReference} {...getReferenceProps}
                    className="relative flex items-center w-fit 
                        px-3 py-1.5 rounded-full border border-gray-700"
                >
                    { !doInfo
                        ? "none" 
                        : (
                            <TaskDoDateDisplay
                                doInfo={doInfo}
                                withDate={true}
                            />
                        )
                    }
                </button>

                { popupOpen && (
                    <FloatingPortal root={floatingRoot}>
                        <div
                            ref={refs.setFloating} {...getFloatingProps}
                            style={floatingStyles}
                            className="flex flex-col w-max min-w-50
                                        bg-gray-800 border border-gray-700 rounded-lg"
                        >
                            {/* current date / text rep */}
                            <div className="p-3">
                                { !doInfo
                                    ? "select a date" 
                                    : (
                                        <TaskDoDateDisplay
                                            doInfo={doInfo}
                                            withDate={true}
                                        />
                                    )
                                }
                            </div>

                            <Divider color="gray-700" />
                            {/* common options (today/tmrw/no date) */}
                            <ScheduleSuggestList
                                date={doInfo?.date ?? null}
                                onToday={handleToToday}
                                onTomorrow={handleToTomorrow}
                                onNoDate={handleToNoDate}
                            />

                            <Divider color="gray-700" />
                            <div className="flex flex-col p-3 gap-2">
                                {/* time selector (another menu) */}
                                <TimeSelector
                                    timePeriod={doInfo?.timePeriod ?? null}
                                    duration={doInfo?.duration ?? null}
                                    timezone={doInfo?.timezone ?? null}
                                    onRemoveTime={handleRemoveTime}
                                    onChange={handleUpdateTime}
                                />

                                {/* recurrence selector (another menu) */}
                                <RecurrenceSelector 
                                    recurrence={doInfo?.recurrence ?? null}
                                    onChange={handleUpdateRecurrence}
                                />
                            </div>
                        </div>
                    </FloatingPortal>
                )}
            </FloatingNode>
        </FloatingTree>
    );
}

/*
const OldDatePicker = ({doInfo, onChange}: {
    doInfo: DoInfo,
    onChange: (doInfo: DoInfo) => void
}) => {
    const inputRef: RefObject<HTMLInputElement> = useRef(null!);

    return (
        <button
            onClick={() => inputRef.current.showPicker()}
            className="relative flex items-center w-fit 
                px-3 py-1.5 rounded-full border border-gray-700"
        >
            { !doInfo
                ? "none" 
                : `${formatDate(toNativeDate(doInfo.date))} ${(doInfo.timePeriod?.type === "exact") ? formatTimePeriod(doInfo.timePeriod) : ""}` }

            <input
                ref={inputRef}
                id="date-picker"
                type="datetime-local"
                value={doInfo ? toLocalInputString(doInfo) : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(nativeToDateInfo(new Date(e.target.value)))}
                className="absolute inset-0 opacity-0 cursor-pointer w-20"
            />
        </button>
    );
};

const toLocalInputString = (date: DoInfo) => {
    const numericDate = toMs(toNativeDate(
        date.date, 
        (date.timePeriod?.type === "exact") 
            ? date.timePeriod.minutesDayStart 
            : undefined
    ));

    const offset = (toDate(numericDate)).getTimezoneOffset() * 6000;
    return toDate(numericDate-offset).toISOString().slice(0,16);
}*/

export default DatePicker;