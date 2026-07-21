import { getTasksByDateRangeAPI } from "@/db";
import { DateString, Task } from "@/types";
import { getEndOfWeekDS } from "@/utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

const useWeekTasks = (startDate: DateString) => {
    const endDate = getEndOfWeekDS(startDate);
    const tasks = useLiveQuery(
        () => getTasksByDateRangeAPI(startDate, endDate),
        [startDate]
    );

    const tasksByDay = useMemo(() => {
        return (tasks ?? []).reduce((acc, task) => {
            if(task.doDate?.date) {
                const date: DateString = task.doDate.date;
                acc.set(date, [...(acc.get(date) || []), task]);
            }
            return acc;
        }, new Map<DateString, Task[]>());
    }, [tasks]);

    return { tasksByDay };
}

export default useWeekTasks;