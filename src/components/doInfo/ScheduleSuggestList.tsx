import { DateString } from "@/types"
import { formatDateString, getTodayString, getTomorrowString, toWeekdayAbbrFormat } from "@/utils/dateUtils";
import { Calendar, CircleSlash, SkipForward } from "lucide-react"

const ScheduleSuggestList = ({ date, onToday, onTomorrow, onNoDate }: {
    date: DateString | null,
    onToday: () => void,
    onTomorrow: () => void,
    onNoDate: () => void
}) => {

    const isNotToday = (): boolean => {
        if(!date) return true;
        return formatDateString(date) !== "Today";
    };

    const isNotTmrw = (): boolean => {
        if(!date) return true;
        return formatDateString(date) !== "Tomorrow";
    };

    return (
        <ul className="flex flex-col w-full p-3 gap-1">
            { isNotToday() && (
                <li>
                    <button
                        onClick={onToday}
                        className="flex flex-row w-full items-center justify-between p-1"
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <Calendar
                                strokeWidth={2}
                                className="size-4"
                            />
                            <p>Today</p>
                        </div>

                        <p>{toWeekdayAbbrFormat(getTodayString())}</p>
                    </button>
                </li>
            )}
            
            { isNotTmrw() && (
                <li>
                    <button
                        onClick={onTomorrow}
                        className="flex flex-row w-full items-center justify-between p-1"
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <SkipForward
                                strokeWidth={2}
                                className="size-4"
                            />
                            <p>Tomorrow</p>
                        </div>

                        <p>{toWeekdayAbbrFormat(getTomorrowString())}</p>
                    </button>
                </li>
            )}

            { (date) && (
                <li>
                    <button
                        onClick={onNoDate}
                        className="flex flex-row w-full items-center justify-between p-1"
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <CircleSlash
                                strokeWidth={2}
                                className="size-4"
                            />
                            <p>No Date</p>
                        </div>
                    </button>
                </li>
            )}
        </ul>
    );
};

export default ScheduleSuggestList;