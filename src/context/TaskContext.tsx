import { createContext, useContext } from "react";
import { createTaskAPI, deleteTaskAPI, getTaskByIdAPI, getTasksByDateRangeAPI, getTasksByDayAPI, getTasksByParentIdAPI, toggleCheckedAPI, updateTaskAPI, useTasksQueryAll } from "@/db";
import { DateString, PartialTask, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";

interface TaskContextProps {
    tasks: Task[],
    rootTasks: Task[],
    createTask: (task: PartialTask) => void,
    editTask: (id: string, modTask: PartialTask) => void,
    deleteTask: (id: string) => void,
    toggleChecked: (id: string) => void,
    getTaskById: (id: string) => Promise<Task | undefined>,
    getTasksByDay: (day: DateString) => Promise<Task[]>,
    getTasksByDateRange: (startDate: DateString, endDate: DateString) => Promise<Task[]>,
}

const TaskContext = createContext<TaskContextProps>(null!);

export const TaskProvider = ({ children }: React.PropsWithChildren) => {
    const tasks = useTasksQueryAll() ?? [];

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

        getTaskById: (id: string) => getTaskByIdAPI(id),

        getTasksByDay: (day: DateString): Promise<Task[]> => getTasksByDayAPI(day),

        getTasksByDateRange: (startDate: DateString, endDate: DateString): Promise<Task[]> => getTasksByDateRangeAPI(startDate, endDate),
    }

    return (
        <TaskContext.Provider value={{tasks, rootTasks, ...tasksAPI}}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => {
    const context = useContext(TaskContext);
    return context;
}