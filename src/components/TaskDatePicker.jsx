import { toDate, formatDate, getTime } from "@/utils/dateUtils";
import { useRef } from "react";

const TaskDatePicker = ({
    timeValue,
    onChange
}) => {
    const inputRef = useRef(null);

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
                onChange={e => onChange(toDate(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-20"
            />
        </button>
    );
}

const toLocalInputString = (date) => {
    const offset = (toDate(date)).getTimezoneOffset() * 6000;
    return toDate(date-offset).toISOString().slice(0,16);
}

export default TaskDatePicker;