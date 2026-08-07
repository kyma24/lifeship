import { getTasksByDateRangeAPI } from "@/db";
import { DateString, ScheduleItem } from "@/types";
import { getEndOfWeekStr, getStartOfWeekStr } from "@/utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

const useWeekTasks = (date: DateString) => {
    const startDate = getStartOfWeekStr(date);
    const endDate = getEndOfWeekStr(date);

    const items = useLiveQuery(
        () => getTasksByDateRangeAPI(startDate, endDate),
        [date]
    );

    const itemsByDay = useMemo(() => {
        return (items ?? []).reduce((acc, item) => {
            if(item.doInfo?.date) {
                const date: DateString = item.doInfo.date;
                acc.set(date, [...(acc.get(date) || []), item]);
            }
            return acc;
        }, new Map<DateString, ScheduleItem[]>());
    }, [items]);

    return itemsByDay;
}

export default useWeekTasks;