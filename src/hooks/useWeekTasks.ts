import { getItemsBeforeDateAPI, getTasksByDateRangeAPI } from "@/db";
import { DateString, DayItemBuckets, ScheduleItem } from "@/types";
import { getEndOfWeekStr, getFullWeekStrs, getStartOfWeekStr, getTodayString, willOccurOn } from "@/utils/dateUtils";
import { sortToDayItemBuckets } from "@/utils/itemUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

const useWeekTasks = (date: DateString) => {
    const startDate = getStartOfWeekStr(date);
    const endDate = getEndOfWeekStr(date);

    const weekItems = useLiveQuery(
        () => getTasksByDateRangeAPI(startDate, endDate),
        [date]
    );

    /*const itemsByDay = useMemo(() => {
        return (weekItems ?? []).reduce((acc, item) => {
            if(item.doInfo?.date) {
                const date: DateString = item.doInfo.date;
                acc.set(date, [...(acc.get(date) || []), item]);
            }
            return acc;
        }, new Map<DateString, ScheduleItem[]>());
    }, [weekItems]);*/

    const itemsByDay: Record<DateString, DayItemBuckets> = useLiveQuery(async () => {
        const weekDates = getFullWeekStrs(startDate);
        const items = await getItemsBeforeDateAPI(endDate);
        const itemsByDay: Record<DateString, DayItemBuckets> = {};

        for(const date of weekDates) {
            itemsByDay[date] = sortToDayItemBuckets(items.filter(
                item => (!item.deletedAt) && (item.doInfo?.date) && (
                    ((date === getTodayString()) && (item.doInfo.date < date))
                    || willOccurOn(item, date)
                )
            ));
        }

        return itemsByDay;
    }, [startDate]) ?? {};

    return itemsByDay;
}

export default useWeekTasks;