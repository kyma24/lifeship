import { DateString } from "@/types";
import { getTodayString, isValidDateComp, toDateComponents, toDateStr } from "@/utils/dateUtils";
import { useState } from "react";

const CustomDateSheet = ({ dateStr, onSubmit, onClose }: {
    dateStr: DateString | null,
    onSubmit: (newDateStr: DateString) => void,
    onClose: () => void
}) => {
    const { year: ogYear, month: ogMonth, day: ogDay } = toDateComponents(dateStr ?? getTodayString());
    const [curYear, setCurYear] = useState<number>(ogYear);
    const [curMonth, setCurMonth] = useState<number>(ogMonth);
    const [curDay, setCurDay] = useState<number>(ogDay);

    const handleSubmit = () => {
        if(isValidDateComp(curYear,curMonth,curDay)) {
            const date = new Date(curYear, curMonth-1, curDay);
            onSubmit(toDateStr(date));
            onClose();
        }
    }

    return (
        <div>
            <div className="flex flex-row w-full items-center justify-center text-2xl">
                <input
                    type="text"
                    value={(curMonth > 0) ? curMonth : ""}
                    onChange={(e) => setCurMonth(Math.min(12,+e.target.value))}
                    className="w-8 text-center"
                />
                /
                <input
                    type="number"
                    value={(curDay > 0) ? curDay : ""}
                    onChange={(e) => setCurDay(Math.min(31,+e.target.value))}
                    className="w-8 text-center"
                />
                /
                <input
                    type="number"
                    value={(curYear > 0) ? curYear : ""}
                    onChange={(e) => setCurYear(Math.min(9999,+e.target.value))}
                    className="w-16 text-center"
                />
            </div>

            <div className="flex flex-row w-full gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="p-2"
                >
                    cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="p-2"
                >
                    save
                </button>
            </div>
        </div>
    );
};

export default CustomDateSheet;