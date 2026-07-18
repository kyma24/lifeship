import { createContext } from "react";
import { createTaskAPI, deleteTaskAPI, getTaskByIdAPI, getTasksByDayAPI, toggleCheckedAPI, updateTaskAPI, useTasksQueryAll } from "@/db";
import { PartialTask, Task } from "@/types";
import { nanoid } from "nanoid";

interface TaskContextProps {
    tasks: Task[],
    /*createTask: (task: Task) => void,
    editTask: (id: string, modTask: PartialTask) => void,
    deleteTask: (id: string) => void,
    toggleChecked: (id: string) => void,
    getTaskById: (id: string) => Promise<Task | undefined>,*/
}

const TaskContext = createContext<TaskContextProps>(null!);

export const TaskProvider = ({ children }: React.PropsWithChildren) => {
    const tasks = useTasksQueryAll() ?? [];

    const tasksAPI = {
        createTask: (task: Task): void => {
            const validTask = {...task, id: nanoid()};
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

        // CHECK
        getTasksByDay: (day: string) => getTasksByDayAPI(day),
    }

    return (
        <TaskContext.Provider value={{tasks, ...tasksAPI}}>
            {children}
        </TaskContext.Provider>
    )
}