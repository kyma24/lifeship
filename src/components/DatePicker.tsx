import { DoInfo } from "@/types";
import { formatDate, formatTimePeriod, toDate, nativeToDateInfo, toMs, toNativeDate } from "@/utils/dateUtils";
import { ChangeEvent, RefObject, useRef } from "react";

const DatePicker = ({doInfo, onChange}: {
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
}

const toLocalInputString = (date: DoInfo) => {
    const numericDate = toMs(toNativeDate(
        date.date, 
        (date.timePeriod?.type === "exact") 
            ? date.timePeriod.minutesDayStart 
            : undefined
    ));

    const offset = (toDate(numericDate)).getTimezoneOffset() * 6000;
    return toDate(numericDate-offset).toISOString().slice(0,16);
}

export default DatePicker;