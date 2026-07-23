import Dexie, { Table } from "dexie";
import { DateString, PartialTask, Task } from "../types";
import { getNextOccurrence, getPrevOccurrence } from "../utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { compareTasksByDate } from "@/utils/taskUtils";

class TasksDatabase extends Dexie {
    tasks!: Table<Task, string>;
    constructor() {
        super("TasksDatabase");
        this.version(1).stores ({
            tasks: "id, parentId, doDate.date, checked",
        });
    }
}

const db = new TasksDatabase();

export const createTaskAPI = (task: Task): Promise<string> => db.tasks.add(task);
export const updateTaskAPI = (id: string, modTask: PartialTask): Promise<number> => db.tasks.update(id, modTask);

const getDescendantIds = async (rootId: string) => {
    const descendants: string[] = [rootId];
    let curParents = [rootId];

    while(curParents.length > 0) {
        const children = await db.tasks
            .where("parentId")
            .anyOf(curParents)
            .toArray();
        
        const childIds = children.map(ch => ch.id);
        descendants.push(...childIds);
        curParents = childIds;
    }

    return descendants;
}

export const deleteTaskAPI = async (id: string) => {
    const toDeleteIds = await getDescendantIds(id);
    await db.tasks
        .where("id")
        .anyOf(toDeleteIds)
        .delete();
        // BELOW FOR WHEN CONSIDERING SYNC
        //.modify({ isDeleted: true });
}

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
    useLiveQuery(async () => {
        const tasks = await db.tasks.toArray();
        return tasks.sort(compareTasksByDate);
    }, []) ?? [];

export const getTaskByIdAPI = async (id: string): Promise<Task | undefined> => {
    try {
        return db.tasks.get(id);
    } catch (err) {
        throw new Error(`Failed to fetch task: ${err}`);
    }
}

export const getTasksByDayAPI = async (today: DateString): Promise<Task[]> => {
    try {
        return await db.tasks
            .where("doDate.date")
            .equals(today)
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch tasks: ${err}`);
    }
};

export const getTasksByDateRangeAPI = async (startDate: DateString, endDate: DateString): Promise<Task[]> => {
    try {
        return await db.tasks
            .where("doDate.date")
            .between(startDate, endDate)
            .sortBy("doDate.date");
    } catch (err) {
        throw new Error(`Failed to fetch tasks: ${err}`);
    }
};

export const getTasksByParentIdAPI = async (parentId: string): Promise<Task[]> => {
    try {
        return await db.tasks
            .where("parentId")
            .equals(parentId)
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch tasks: ${err}`);
    }
};