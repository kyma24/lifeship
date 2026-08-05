import { weekdays } from "@/utils/constants";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { parseRRuleString } from "@/utils/dateUtils";

export default function CustomRecurSheet({ curRRule, onSubmit, onClose }: {
    curRRule: string | null,
    onSubmit: (byDayArr: boolean[], everyXWeeks: number) => void,
    onClose: () => void,
}) {
    const { byDayArr: curByDayArr, everyXWeeks: curEveryXWeeks } = parseRRuleString(curRRule);
    const [byDayArr, setByDayArr] = useState<boolean[]>(curByDayArr);
    const [everyXWeeks, setEveryXWeeks] = useState<number>(curEveryXWeeks);
    
    const handleToggleWeekday = (ind: number) => {
        setByDayArr(prevArr => prevArr.map(
            (isOn,i) => (i===ind) ? !isOn : isOn
        ));
    };

    const handleAdd = () => {
        setEveryXWeeks(everyXWeeks+1);
    };

    const handleSubtract = () => {
        setEveryXWeeks(Math.max(1,everyXWeeks-1));
    };

    const handleSubmit = () => {
        onSubmit(byDayArr, everyXWeeks);
        onClose();
    };

    return (
        <div 
            className="flex flex-col gap-5"
        >
            <div className="flex flex-row gap-3 text-xl">
                <p className="font-bold">every</p>

                <div className="flex flex-row items-center gap-1">
                    <button
                        onClick={handleSubtract}
                        className="bg-gray-700 p-1 rounded-full border border-gray-600"
                    >
                        <Minus
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>

                    <input
                        type="text"
                        value={everyXWeeks}
                        onChange={(e) => setEveryXWeeks(+e.target.value)}
                        maxLength={1}
                        className="size-5 text-center"
                    />

                    <button
                        onClick={handleAdd}
                        className="bg-gray-700 p-1 rounded-full border border-gray-600"
                    >
                        <Plus
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>
                </div>

                <p className="font-bold">weeks</p>
            </div>
            <WeekdaySelector
                byDayArr={byDayArr}
                onToggleWeekday={handleToggleWeekday}
            />
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
}

function WeekdaySelector({ byDayArr, onToggleWeekday}: {
    byDayArr: boolean[],
    onToggleWeekday: (ind: number) => void
}) {
    return (
        <div className="flex flex-row gap-3">
            {weekdays.map((day, ind) => (
                <WeekdayButton
                    key={ind}
                    day={day}
                    onClick={() => onToggleWeekday(ind)}
                    isOn={byDayArr[ind] ?? false}
                />
            ))}
        </div>
    );
}

function WeekdayButton({day, onClick, isOn}: {
    day: string,
    onClick: () => void,
    isOn: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full aspect-square rounded-full text-sm 
                        transition-colors duration-200 ease-in-out
                        ${isOn 
                            ? "font-bold bg-indigo-800" 
                            : "font-semibold bg-gray-800"
                        }`}
        >
            {day}
        </button>
    )
}