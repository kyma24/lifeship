import { getTasksForDateRange } from "@/db"
import { getStartOfDay, getEndOfWeek, toMs } from "@/utils/dateUtils"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo } from "react";

const useWeekTasks = (rawStartDate) => {
    const startDate = getStartOfDay(rawStartDate);
    const endDate = getEndOfWeek(startDate);
    const tasks = useLiveQuery(
        () => getTasksForDateRange(startDate, endDate),
        [rawStartDate]
    );

    const tasksByDay = useMemo(() => {
        return (tasks ?? []).reduce((acc, task) => {
            const day = toMs(getStartOfDay(new Date(task.startTime)));
            acc[day] = [...(acc[day] || []), task];
            return acc;
        }, {});
    }, [tasks]);

    return { tasksByDay };
}

export default useWeekTasks;