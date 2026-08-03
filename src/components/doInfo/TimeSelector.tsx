import { DropdownOption, TimePeriod } from "@/types";
import { formatTimePeriod, getTimezone, parseTimeString } from "@/utils/dateUtils";
import { autoUpdate, flip, offset, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { Clock, X } from "lucide-react";
import { useState } from "react";
import Divider from "../Divider";
import Dropdown from "../Dropdown";

const timezoneDropdown = (setCurrentOption: (option: number)=>void): DropdownOption[] => ([
  { label: "Floating time", description: "Time stays the same across time zones", onClick: ()=>setCurrentOption(0) },
  { label: `${getTimezone()}`, description: "Your current time zone", onClick: ()=>setCurrentOption(1) }
]);

const TimeSelector = ({ timePeriod, duration, timezone, onRemoveTime, onChange }: {
    timePeriod: TimePeriod | null,
    duration: number | null,
    timezone: string | null,
    onRemoveTime: () => void,
    onChange: (timePeriod: TimePeriod, duration: number, timezone: string | null) => void,
}) => {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const [curTimePeriod, setCurTimePeriod] = useState<string>(formatTimePeriod(timePeriod));
    const [curDuration, setCurDuration] = useState<number>(duration ?? 0);
    const [curTimezone, setCurTimezone] = useState<string | null>(timezone);

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    const handleSubmit = () => {
        onChange(
            parseTimeString(curTimePeriod),
            curDuration,
            curTimezone
        );
        togglePopupOpen();
    }

    // time info
    const resetTimePeriod = () => {
        setCurTimePeriod(formatTimePeriod(timePeriod));
    }

    const handleTimePeriodBlur = () => {
        // valid
        if(parseTimeString(curTimePeriod)) return;
        // invalid
        resetTimePeriod();
    }

    // dropdown
    const getCurTimezoneInd = (): number => {
        if(!curTimezone) return 0;
        return 1;
    }

    const handleTimezoneChange = (ind: number) => {
        if(ind===0) setCurTimezone(null);
        else setCurTimezone(getTimezone());
    }

    // floating ui
    const { refs, floatingStyles, context } = useFloating({
        open: popupOpen,
        onOpenChange: setPopupOpen,
        placement: "bottom",
        middleware: [
            offset(8), 
            flip({ 
                fallbackPlacements: [ 
                    "bottom-end",
                    "bottom-start",
                    "top",
                    "top-end",
                    "top-start",
                    "left-start",
                ],
                padding: 5
            }), 
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
    
    return (
        <>
            <div
                onClick={togglePopupOpen}
                ref={refs.setReference} {...getReferenceProps}
                className="flex flex-row items-center justify-between w-full 
                    border border-gray-700 p-1"
            >
                <div className="flex flex-row w-full items-center justify-center gap-2">
                    <Clock 
                        strokeWidth={2} 
                        className="size-4"
                    />
                    { (!timePeriod)
                        ? "time"
                        : formatTimePeriod(timePeriod)
                    }
                </div>

                { timePeriod && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveTime();
                            setPopupOpen(false);
                        }}
                        className="p-1"
                    >
                        <X
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>
                )}
            </div>

            {popupOpen && (
                <div
                    ref={refs.setFloating} {...getFloatingProps}
                    style={floatingStyles}
                    className="flex flex-col w-max min-w-75
                                bg-gray-800 border border-gray-700 rounded-lg"
                >

                    {/* time */}
                    <div className="flex flex-row w-full items-center justify-between p-3">
                        <p className="font-bold">Time</p>
                        <input 
                            type="text"
                            value={curTimePeriod}
                            onChange={e => setCurTimePeriod(e.target.value)}
                            onBlur={handleTimePeriodBlur}
                            size={8}
                            className="border border-gray-600 rounded-md text-center"
                        />
                    </div>

                    {/* duration: */}
                    <div className="flex flex-row w-full items-center justify-between p-3 gap-3">
                        <p className="font-bold">Duration</p>
                        <div className="flex flex-row gap-1">
                            <input
                                type="number"
                                value={curDuration.toString()}
                                onChange={e => {
                                    const trimmed = e.target.value.replace(/^0+(?=\d)/, '');
                                    setCurDuration(+trimmed);
                                }}
                                className="w-12 border border-gray-600 rounded-md text-center"
                            />
                            <p>mins</p>
                        </div>
                    </div>

                    <Divider color="gray-700" />

                    {/* timezone: floating/local(detect) */}
                    <div className="flex flex-row w-full items-center justify-between p-3 gap-3">
                        <p className="font-bold">Timezone</p>
                        <Dropdown
                            currentOption={getCurTimezoneInd()}
                            options={timezoneDropdown(handleTimezoneChange)}
                        />
                    </div>

                    <Divider color="gray-700" />

                    {/* cancel/update */}
                    <div className="flex flex-row items-center justify-end p-3 gap-3">
                        <button
                            onClick={togglePopupOpen}
                        >
                            cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                        >
                            update
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimeSelector;