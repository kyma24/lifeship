import { useScheduleItems } from "@/context/ScheduleItemContext";
import { DateString, DayItemBuckets, Task } from "@/types";
import { getEndOfWeekStr, getFullWeekStrs, getStartOfWeekStr, getTodayString, willOccurOn } from "@/utils/dateUtils";
import { mergeItemsWithExceptions } from "@/utils/exceptionUtils";
import { sortToDayItemBuckets } from "@/utils/itemUtils";
import { useMemo } from "react";

const useWeekTasks = (date: DateString) => {
    const startOfWeek = getStartOfWeekStr(date);
    const today = getTodayString();

    const startDate = (today > startOfWeek) ? today : startOfWeek;
    const endDate = getEndOfWeekStr(date);

    // get all items & exceptions from context
    const { rootItems, rootExceptions } = useScheduleItems();

    const displayItemsInRange: Task[] = useMemo(() => 
        mergeItemsWithExceptions(rootItems, rootExceptions, startDate, endDate, today)
    , [rootItems, rootExceptions, startDate, endDate, today]);

    const itemsByDay: Record<DateString, DayItemBuckets> = useMemo(() => {
        const weekDates = getFullWeekStrs(startDate);
        const res: Record<DateString, DayItemBuckets> = {};

        for(const date of weekDates) {
            res[date] = sortToDayItemBuckets(date, 
                // filter out for date
                displayItemsInRange.filter(
                    item => {
                        return (!item.deletedAt) && (item.doInfo?.date) && (
                        // overdue
                        ((date === today) && (item.doInfo.date < date))
                        /* recurring
                        || willOccurOn(item, date)*/
                        || (item.doInfo.date === date)
                    );
                }
                )
            );
        }

        return res;
    }, [displayItemsInRange]) ?? {};

    return itemsByDay;
}

export default useWeekTasks;