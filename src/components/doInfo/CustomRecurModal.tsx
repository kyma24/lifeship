import { weekdays } from "@/utils/constants";
import { X } from "lucide-react";
import { useState } from "react";

export default function CustomRecurModal({ onSubmit, onClose }: {
    onSubmit: (byDayArr: boolean[]) => void,
    onClose: () => void,
}) {
    const [byDayArr, setByDayArr] = useState<boolean[]>(new Array(7).fill(false));
    
    const handleToggleWeekday = (ind: number) => {
        setByDayArr(prevArr => prevArr.map((isOn,i) => (i===ind)?(!isOn):(isOn)));
    };

    return (
        <div 
            className="flex flex-col w-90 gap-2
                        border-2 border-gray-700 rounded-lg"
        >
            <div className="flex flex-row w-full h-10 justify-end">
                <button
                    onClick={onClose}
                    className="flex items-center justify-center h-full"
                >
                    <X
                        strokeWidth={2}
                        className="size-4"
                    />
                </button>
            </div>

            <WeekdaySelector
                byDayArr={byDayArr}
                onToggleWeekday={handleToggleWeekday}
            />
        </div>
    );
}

function WeekdaySelector({ byDayArr, onToggleWeekday}: {
    byDayArr: boolean[],
    onToggleWeekday: (ind: number) => void
}) {
    return (
        <div className="flex flex-row gap-3">
            {weekdays.map((day, ind) => (
                <WeekdayButton
                    ind={ind}
                    day={day}
                    onClick={() => onToggleWeekday(ind)}
                    isOn={byDayArr[ind] ?? false}
                />
            ))}
        </div>
    );
}

function WeekdayButton({ind, day, onClick, isOn}: {
    ind: number,
    day: string,
    onClick: () => void,
    isOn: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full aspect-square rounded-full text-sm 
                        ${isOn 
                            ? "font-bold bg-indigo-600" 
                            : "font-semibold bg-gray-700"
                        }`}
        >
            {day}
        </button>
    )
}