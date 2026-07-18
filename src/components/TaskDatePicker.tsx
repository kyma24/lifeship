import { formatDate, getTime, toDate } from "@/utils/dateUtils";
import { ChangeEvent, RefObject, useRef } from "react";

const TaskDatePicker = ({timeValue, onChange}: {
    timeValue: number,
    onChange: (date: Date) => void
}) => {
    const inputRef: RefObject<HTMLInputElement> = useRef(null!);

    return (
        <button
            onClick={() => inputRef.current.showPicker()}
            className="relative flex items-center w-fit px-3 py-1.5 rounded-full border border-gray-700"
        >
            { !timeValue ? "none" : `${formatDate(toDate(timeValue))} ${getTime(toDate(timeValue))}` }

            <input
                ref={inputRef}
                id="date-picker"
                type="datetime-local"
                value={timeValue ? toLocalInputString(timeValue) : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(new Date(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-20"
            />
        </button>
    );
}

const toLocalInputString = (date: number) => {
    const offset = (toDate(date)).getTimezoneOffset() * 6000;
    return toDate(date-offset).toISOString().slice(0,16);
}

export default TaskDatePicker;