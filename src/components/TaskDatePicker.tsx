import { DoDate } from "@/types";
import { formatDate, formatTimePeriod, toDate, toDoDate, toMs, toNativeDate } from "@/utils/dateUtils";
import { ChangeEvent, RefObject, useRef } from "react";

const TaskDatePicker = ({doDate, onChange}: {
    doDate: DoDate,
    onChange: (doDate: DoDate) => void
}) => {
    const inputRef: RefObject<HTMLInputElement> = useRef(null!);

    return (
        <button
            onClick={() => inputRef.current.showPicker()}
            className="relative flex items-center w-fit 
                px-3 py-1.5 rounded-full border border-gray-700"
        >
            { !doDate
                ? "none" 
                : `${formatDate(toNativeDate(doDate.date))} ${(doDate.timePeriod?.type === "exact") ? formatTimePeriod(doDate.timePeriod) : ""}` }

            <input
                ref={inputRef}
                id="date-picker"
                type="datetime-local"
                value={doDate ? toLocalInputString(doDate) : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(toDoDate(new Date(e.target.value)))}
                className="absolute inset-0 opacity-0 cursor-pointer w-20"
            />
        </button>
    );
}

const toLocalInputString = (date: DoDate) => {
    const numericDate = toMs(toNativeDate(
        date.date, 
        (date.timePeriod?.type === "exact") 
            ? date.timePeriod.minutesDayStart 
            : undefined
    ));

    const offset = (toDate(numericDate)).getTimezoneOffset() * 6000;
    return toDate(numericDate-offset).toISOString().slice(0,16);
}

export default TaskDatePicker;