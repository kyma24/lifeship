import Dexie, { Table } from "dexie";
import { Block, DateString, PartialBlock, PartialTask, ScheduleItem, Task } from "@/types";
import { getNextOccurrence, getPrevOccurrence } from "@/utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { compareItemsByDate } from "@/utils/taskUtils";

class ItemsDatabase extends Dexie {
    items!: Table<ScheduleItem, string>;
    constructor() {
        super("ItemsDatabase");
        this.version(1).stores ({
            items: "id, parentId, doDate.date, variant, [variant+checked], [parentId+deletedAt]",
        });
    }
}

const db = new ItemsDatabase();

export const createTaskAPI = (task: Task): Promise<string> => db.items.add(task);
export const createBlockAPI = (block: Block): Promise<string> => db.items.add(block);

export const updateTaskAPI = (id: string, modTask: PartialTask): Promise<number> => db.items.update(id, modTask);
export const updateBlockAPI = (id: string, modBlock: PartialBlock): Promise<number> => db.items.update(id,modBlock);

const getDescendantIds = async (rootId: string) => {
    const descendants: string[] = [rootId];
    let curParents = [rootId];

    while(curParents.length > 0) {
        const children = await db.items
            .where("parentId")
            .anyOf(curParents)
            .toArray();
        
        const childIds = children.map(ch => ch.id);
        descendants.push(...childIds);
        curParents = childIds;
    }

    return descendants;
}

export const deleteItemAPI = async (id: string) => {
    const toDeleteIds = await getDescendantIds(id);
    await db.items
        .where("id")
        .anyOf(toDeleteIds)
        .delete();
        // BELOW FOR WHEN CONSIDERING SYNC
        //.modify({ isDeleted: true });
}

export const toggleCheckedAPI = async (id: string) => {
    const task = await db.items.get(id);
    if(!task) throw new Error(`Item ${id} not found`);
    if(task.variant !== "task") throw new Error(`Item ${id} cannot be checked`);

    if(!task.doDate?.recurrence) {
        await db.items.update(id, { checked: !task.checked } as PartialTask);
        return;
    }

    // check off, advance to next occurrence
    if(!task.checked) {
        const next = getNextOccurrence(task);
        if(!next) return;

        await db.items.update(id, {
            doDate: {...task.doDate, date: next},
            checked: false
        } as PartialTask);
    } 
    // uncheck, return to last occurrence
    else {
        const prev = getPrevOccurrence(task);
        if(!prev) return;

        await db.items.update(id, {
            doDate: {...task.doDate, date: prev},
            checked: false
        } as PartialTask);
    }
}

export const useTasksQueryAll = (): ScheduleItem[] =>
    useLiveQuery(async () => {
        const items = await db.items.toArray();
        return items.sort(compareItemsByDate);
    }, []) ?? [];

export const getItemByIdAPI = async (id: string): Promise<ScheduleItem | undefined> => {
    try {
        return db.items.get(id);
    } catch (err) {
        throw new Error(`Failed to fetch task: ${err}`);
    }
}

export const getTasksByDayAPI = async (today: DateString): Promise<ScheduleItem[]> => {
    try {
        return await db.items
            .where("doDate.date")
            .equals(today)
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getTasksByDateRangeAPI = async (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => {
    try {
        return await db.items
            .where("doDate.date")
            .between(startDate, endDate)
            .sortBy("doDate.date");
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getTasksByParentIdAPI = async (parentId: string): Promise<ScheduleItem[]> => {
    try {
        return await db.items
            .where("parentId")
            .equals(parentId)
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getItemsToDisplayAPI = async (): Promise<ScheduleItem[]> => {
    try {
        return await db.items  
            .where("[parentId+deletedAt]")
            .equals(["",""])
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
}

export const getSubtaskCheckedCountAPI = (parentId: string) => (
    db.items
    .where("parentId")
    .equals(parentId)
    .and(item => (item.variant==="task" && item.checked))
    .count()
);