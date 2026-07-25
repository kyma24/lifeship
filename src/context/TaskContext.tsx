import { createContext, useContext } from "react";
import { createTaskAPI, deleteTaskAPI, getItemByIdAPI, getTasksByDateRangeAPI, getTasksByDayAPI, getTasksByParentIdAPI, toggleCheckedAPI, updateTaskAPI, useTasksQueryAll } from "@/db";
import { DateString, PartialTask, ScheduleItem, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";

interface ItemContextProps {
    //tasks: Task[],
    rootTasks: ScheduleItem[],
    createTask: (task: PartialTask) => void,
    editTask: (id: string, modTask: PartialTask) => void,
    deleteTask: (id: string) => void,
    toggleChecked: (id: string) => void,
    getTaskById: (id: string) => Promise<ScheduleItem | undefined>,
    getTasksByDay: (day: DateString) => Promise<ScheduleItem[]>,
    getTasksByDateRange: (startDate: DateString, endDate: DateString) => Promise<ScheduleItem[]>,
}

const ItemContext = createContext<ItemContextProps>(null!);

export const ScheduleItemProvider = ({ children }: React.PropsWithChildren) => {
    //const tasks = useTasksQueryAll() ?? [];

    const rootTasks = useLiveQuery(
        () => getTasksByParentIdAPI(""),
        []
    ) ?? [];

    const tasksAPI = {
        createTask: (task: PartialTask): void => {
            const id: string = nanoid();
            const validTask: Task = createTaskFromDraft(id,task);
            createTaskAPI(validTask);
        },

        editTask: (id: string, modTask: PartialTask): void => {
            updateTaskAPI(id, modTask);
        },

        deleteTask: (id: string): void => {
            deleteTaskAPI(id);
        },

        toggleChecked: (id: string): void => {
            toggleCheckedAPI(id);
        },

        getTaskById: (id: string) => getItemByIdAPI(id),

        getTasksByDay: (day: DateString): Promise<ScheduleItem[]> => getTasksByDayAPI(day),

        getTasksByDateRange: (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => getTasksByDateRangeAPI(startDate, endDate),
    }

    return (
        <ItemContext.Provider value={{rootTasks, ...tasksAPI}}>
            {children}
        </ItemContext.Provider>
    );
}

export const useTasks = () => {
    const context = useContext(ItemContext);
    return context;
}