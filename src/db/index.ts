import Dexie, { Table } from "dexie";
import { Block, DateString, PartialBlock, PartialTask, ScheduleItem, Task } from "@/types";
import { getNextOccurrence, getPrevOccurrence, nowISO } from "@/utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { compareItemsByDate } from "@/utils/taskUtils";
import { supabase } from "@/lib/supabase";
import { toLocalShape, toRemoteShape } from "@/utils/itemUtils";
import { debouncedSync } from "@/utils/backend/sync";
import { getCurrentUserId } from "@/utils/backend/auth";

interface SyncStateRec {
    key: string;
    value: string;
}

class AppDatabase extends Dexie {
    items!: Table<ScheduleItem, string>;
    syncState!: Table<SyncStateRec, string>;

    constructor() {
        super("AppDatabase");
        this.version(1).stores ({
            items: "id, parentId, doInfo.date, variant, [variant+checked], [parentId+deletedAt], [doInfo.date+deletedAt]",
            syncState: "key"
        });
    }
}

export const db = new AppDatabase();

// local

export const createTaskAPI = async (task: Task) => {
    await db.items.add({...task,
        dirty: true
    });
    debouncedSync();
};
export const createBlockAPI = async (block: Block) => {
    await db.items.add({...block,
        dirty: true
    });
    debouncedSync();
};

export const updateTaskAPI = async (id: string, modTask: PartialTask) => {
    await db.items.update(id, {...modTask, 
        updatedAt: nowISO(),
        dirty: true
    });
    debouncedSync();
};
export const updateBlockAPI = async (id: string, modBlock: PartialBlock) => {
    await db.items.update(id,{...modBlock, 
        updatedAt: nowISO(),
        dirty: true
    });
    debouncedSync();
};

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
        //.delete();
        .modify({ 
            deletedAt: nowISO(),
            dirty: true
        });
    debouncedSync();
}

export const toggleCheckedAPI = async (id: string) => {
    const task = await db.items.get(id);
    if(!task) throw new Error(`Item ${id} not found`);
    if(task.variant !== "task") throw new Error(`Item ${id} cannot be checked`);

    if(!task.doInfo?.recurrence) {
        await db.items.update(id, { 
            checked: !task.checked,
            updatedAt: nowISO(),
            dirty: true
        } as PartialTask);
        debouncedSync();
        return;
    }

    // check off, advance to next occurrence
    if(!task.checked) {
        const next = getNextOccurrence(task);
        if(!next) return;

        await db.items.update(id, {
            doInfo: {...task.doInfo, date: next},
            checked: false,
            updatedAt: nowISO(),
            dirty: true
        } as PartialTask);
        debouncedSync();
    } 
    // uncheck, return to last occurrence
    else {
        const prev = getPrevOccurrence(task);
        if(!prev) return;

        await db.items.update(id, {
            doInfo: {...task.doInfo, date: prev},
            checked: false,
            updatedAt: nowISO(),
            dirty: true
        } as PartialTask);
        debouncedSync();
    }
}

// queries

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
            .where("[doInfo.date+deletedAt]")
            .equals([today,""])
            .toArray();
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

// don't get deleted
export const getTasksByDateRangeAPI = async (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => {
    try {
        return await db.items
            .where("doInfo.date")
            .between(startDate, endDate)
            .sortBy("doInfo.date");
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getTasksByParentIdAPI = async (parentId: string): Promise<ScheduleItem[]> => {
    try {
        return await db.items
            .where("[parentId+deletedAt]")
            .equals([parentId,""])
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
    .where("[parentId+deletedAt]")
    .equals([parentId,""])
    .and(item => (item.variant==="task" && item.checked))
    .count()
);

// remote
export const pushChangesAPI = async () => {
    const dirtyItems = await db.items.filter(it => it.dirty).toArray();
    const userId = await getCurrentUserId();

    for(const item of dirtyItems) {
        const remoteItem = { ...toRemoteShape(item), user_id: userId };

        const { error } = await supabase
            .from("items")
            .upsert(remoteItem);
        
        if(!error) {
            await db.items.update(item.id, { dirty: false });
            console.log("success");
        } else {
            console.log(error);
        }
    }
}

export const pullChangesAPI = async (lastSyncedAt: string) => {
    const { data: remoteItems } = await supabase
        .from("items")
        .select("*")
        .gt("updated_at", lastSyncedAt);
    
    for(const remote of (remoteItems ?? [])) {
        const local = await db.items.get(remote.id);
        // last write wins: local less recent
        if(!local || (remote.updated_at > local.updatedAt)) {
            await db.items.put(toLocalShape(remote)!);
        }
    }
}