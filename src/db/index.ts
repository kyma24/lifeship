import Dexie, { Table } from "dexie";
import { PartialTask, Task } from "../types";
import { getNextOccurrence, getPrevOccurrence } from "../utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";

class TasksDatabase extends Dexie {
    tasks!: Table<Task, string>;
    constructor() {
        super("TasksDatabase");
        this.version(1).stores ({
            tasks: "id, parentId, doDate.date",
        });
    }
}

const db = new TasksDatabase();

export const createTaskAPI = (task: Task): Promise<string> => db.tasks.add(task);
export const updateTaskAPI = (id: string, modTask: PartialTask): Promise<number> => db.tasks.update(id, modTask);
export const deleteTaskAPI = (id: string): Promise<void> => db.tasks.delete(id);
export const toggleCheckedAPI = async (id: string) => {
    const task = await db.tasks.get(id);
    if(!task) throw new Error(`Task ${id} not found`);

    if(!task.doDate?.recurrence) {
        await db.tasks.update(id, { checked: !task.checked });
        return;
    }

    // check off, advance to next occurrence
    if(!task.checked) {
        const next = getNextOccurrence(task);
        if(!next) return;

        await db.tasks.update(id, {
            doDate: {...task.doDate, date: next},
            checked: false
        });
    } 
    // uncheck, return to last occurrence
    else {
        const prev = getPrevOccurrence(task);
        if(!prev) return;

        await db.tasks.update(id, {
            doDate: {...task.doDate, date: prev},
            checked: false
        });
    }
}

export const useTasksQueryAll = (): Task[] =>
    useLiveQuery(() => db.tasks.orderBy("doDate.date").toArray()) ?? [];

export const getTaskByIdAPI = (id: string): Promise<Task | undefined> => db.tasks.get(id);

// CHECK
export const getTasksByDayAPI = (today: string) => (
    db.tasks.where("doDate.date")
        .equals(today)
);