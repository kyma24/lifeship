import { getTasksByDayAPI } from "@/db";
import { DateString } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";

const useDayTasks = (date: DateString) => {
    const dayTasks = useLiveQuery(async () => {
            const tasksWithSubtasks = await getTasksByDayAPI(date);
            const dayIds = new Set<string>(tasksWithSubtasks.map(task => task.id));
            return tasksWithSubtasks.filter(task => {
                if(task.id === "") return true;
                if(dayIds.has(task.parentId)) return false;
                return true;
            });
        }, [date]
    ) ?? [];

    return { dayTasks };
};

export default useDayTasks;