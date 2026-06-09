import { createTaskAPI, deleteTaskAPI, getStrayTasksAPI, getTaskByIdAPI, getTasksByDayAPI, toggleCompleteAPI, updateTaskAPI, useTasksQueryAll } from "@/db";
import { nanoid } from "nanoid";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const tasks = useTasksQueryAll() ?? [];

    const tasksAPI = {
        createTask: (task) => {
            const validTask = {...task, id: nanoid()};
            createTaskAPI(validTask);
        },

        // change only dirty fields?
        editTask: (modTask) => {
            updateTaskAPI(modTask);
        },

        deleteTask: (id) => {
            deleteTaskAPI(id);
        },

        toggleCompleted: (task) => {
            toggleCompleteAPI(task.id);
        },

        getTaskById: (id) => getTaskByIdAPI(id),

        getStrayTasks: () => getStrayTasksAPI(),

        getTasksByDay: (day) => getTasksByDayAPI(day),
    }

    return (
        <TaskContext.Provider value={{tasks, ...tasksAPI}}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    return context;
}






let init_tasks = [
    {
        id: 1,
        parentId: 1,
        name: "abjidsof",
        description: "ima test",
        completed: false,
        startTime: (new Date(2026,6,5,7,13,0)).toISOString(),
        duration: 60,
        deadline: '',
        recurrence: {
            rrule: 'FREQ=WEEKLY;BYDAY=MO',
            endDate: null,
        },
        tags: ["a", "b", "c"]
    },
    {
        id: 2,
        parentId: 2,
        name: "another one",
        description: "ima test",
        completed: false,
        startTime: '',
        duration: 10,
        deadline: '',
        recurrence: null,
        tags: ["b"]
    },
]

const TaskProviderFrontendState = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const tasksMap = useMemo(() => (
        Object.fromEntries(tasks.map(task => [task.id, task]))
    ), [tasks]);

    useEffect(() => {
        // get tasks from db, then set to state
        setTasks(init_tasks);
        setLoading(false);
    }, []);

    const tasksAPI = {
        createTask: (task) => {
            const validTask = {...task, id: nanoid()};
            setTasks(tasks.concat(validTask));
        },

        // change only dirty fields?
        editTask: (modTask) => {
            const id = modTask.id;
            setTasks(tasks.map(task => (task.id == id) ? modTask : task))
        },

        deleteTask: (id) => {
            setTasks(tasks.filter(task => task.id !== id));
        },

        setCompleted: (id) => {
            setTasks(tasks.map(task => (task.id === id) ? {...task, completed: true} : task));
            // deal w recurrence too
        }
    }

    return (
        <TaskContext.Provider value={{tasks, tasksMap, loading, ...tasksAPI}}>
            {children}
        </TaskContext.Provider>
    );
};