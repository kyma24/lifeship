import Dexie, { Table } from "dexie";
import { Block, DateString, ItemOverrides, PartialBlock, PartialScheduleItem, PartialTask, RecurrenceException, ScheduleItem, Task } from "@/types";
import { getNextOccurrence, getPrevOccurrence, ISOToDateStr, nowISO } from "@/utils/dateUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { compareItemsByDate } from "@/utils/taskUtils";
import { supabase } from "@/lib/supabase";
import { toLocalItemShape, toRemoteItemShape } from "@/utils/itemUtils";
import { debouncedSync, setLastSyncedAt } from "@/utils/backend/sync";
import { getCurrentUserId } from "@/utils/backend/auth";
import { toLocalExceptionShape, toRemoteExceptionShape } from "@/utils/exceptionUtils";
import { nanoid } from "nanoid";
import { getDeviceId } from "@/utils/backend/device";
import { isEqual } from "lodash";

interface SyncStateRec {
    key: string;
    value: string;
}

class AppDatabase extends Dexie {
    items!: Table<ScheduleItem, string>;
    exceptions!: Table<RecurrenceException, string>;
    syncState!: Table<SyncStateRec, string>;

    constructor() {
        super("AppDatabase");
        this.version(1).stores ({
            items: "id, parentId, doInfo.date, variant, [variant+checked], [parentId+deletedAt], [doInfo.date+deletedAt]",
            exceptions: "id, itemId, effectDate, [itemId+effectDate]",
            syncState: "key"
        });
    }
}

export const db = new AppDatabase();

const idNotInExceptions = async (id: string) => {
    const { count, error } = await supabase
        .from("exceptions")
        .select("id", { count: "exact", head: true })
        .eq("id", id);
    return error || count==0;
};

// local

export const createItemAPI = async (item: ScheduleItem) => {
    await db.items.add({...item,
        createdAt: nowISO(),
        updatedAt: nowISO(),
        dirty: true
    });
    debouncedSync();
}

export const updateItemAPI = async (
    id: string, 
    modItem: PartialScheduleItem
) => {
    await db.items.update(id, {...modItem,
        updatedAt: nowISO(),
        dirty: true
    });

    debouncedSync();
}

export const updateTaskAPI = async (
    id: string, 
    modItem: PartialScheduleItem, 
    exceptionId?: string,
    effectDate?: DateString
) => {
    // handle exception
    if(exceptionId) {
        if(!effectDate) return;

        const item = await db.items.get(id);
        const overrides: Record<string, unknown> = {};
        if(item) {
            // get changed properties
            for(const prop in Object.keys(modItem)) {
                if(isEqual(
                    modItem[prop as keyof PartialScheduleItem],
                    item[prop as keyof ScheduleItem]
                )) continue;

                overrides[prop as keyof ItemOverrides]=(modItem as Record<string, unknown>)[prop];
            }
        }

        // create or update exception
        const isNewException = await idNotInExceptions(exceptionId);
        if(isNewException) createExceptionAPI(effectDate,id,"modified",overrides);
        else updateExceptionAPI(exceptionId, "modified", overrides);
    }
    else updateItemAPI(id, modItem);
}

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
            updatedAt: nowISO(),
            deletedAt: nowISO(),
            dirty: true
        });
    await db.exceptions
        .where("itemId")
        .anyOf(toDeleteIds)
        .modify({
            updatedAt: nowISO(),
            deletedAt: nowISO(),
            dirty: true
        });
    debouncedSync();
}

const createExceptionAPI = async (date: DateString, taskId: string, variant: "modified" | "deleted", overrides?: ItemOverrides) => {
    const userId = await getCurrentUserId();
    if(!userId) return;

    const id: string = nanoid();
    await db.exceptions.add({
        id,
        itemId: taskId,
        effectDate: date,
        overrides: overrides ?? {},

        occurrenceIndex: 0,
        variant,

        deletedAt: null,
        createdAt: nowISO(),
        updatedAt: nowISO(),
        deviceId: getDeviceId(),
        userId,
        
        dirty: true,
    });
    debouncedSync();
};

const updateExceptionAPI = async (id: string, variant: "modified" | "deleted", overrides?: ItemOverrides) => {
    if(variant === "modified")
        await db.exceptions.update(id, { 
            overrides: overrides,
            updatedAt: nowISO(),
            dirty: true
        });
    if(variant === "deleted") {
        await db.exceptions.update(id, {
            variant: "deleted",
            updatedAt: nowISO(),
            dirty: true
        });
    }
    debouncedSync();
};

const deleteExceptionAPI = async (id: string) => {
    await db.exceptions.update(id, {
        updatedAt: nowISO(),
        deletedAt: nowISO(),
        dirty: true
    });
}

const deleteAllExceptionsOfItemAPI = async (itemId: string) => {
    const toDeleteIds = (await db.exceptions
        .where("itemId")
        .equals(itemId)
        .toArray())
        .map((exc) => exc.id);

    for(const id of toDeleteIds) {
        await deleteExceptionAPI(id);
    }
}

const toggleCheckedEXAPI = async (taskId: string, date: DateString) => {
    const curExceptions = await db.exceptions
        .where("[itemId+effectDate]")
        .equals([taskId,date])
        .toArray();
        
    // TO BE IMPROVED: assumes only one exception
    const taskException = (curExceptions.length > 0) ? curExceptions[0] : null;

    const task = await db.items.get(taskId);
    if(!task) throw new Error(`Item ${taskId} not found`);
    if(task.variant !== "task") throw new Error(`Item ${taskId} cannot be checked`);

    if(!taskException) {
        // create if no exception exists yet
        await createExceptionAPI(date, taskId, "modified", {
            checked: !task.checked,
            checkedAt: (task.checked) ? null : nowISO(),
        });
    } else {
        // modify existing exception
        const ogOverrides = taskException.overrides;
        await updateExceptionAPI(taskException.id, "modified", {
            ...ogOverrides,
            checked: !ogOverrides.checked,
            checkedAt: (ogOverrides.checked) ? null : nowISO(),
        });
    }
}

export const toggleCheckedAPI = async (id: string, date?: DateString) => {
    const task = await db.items.get(id);
    if(!task) throw new Error(`Item ${id} not found`);
    if(task.variant !== "task") throw new Error(`Item ${id} cannot be checked`);

    const isRecurring = task.doInfo?.recurrence?.rrule || false;

    if(isRecurring && date) toggleCheckedEXAPI(task.id, date);
    else {
        await db.items.update(id, {
            checked: !task.checked,
            checkedAt: (task.checked) ? null : nowISO(),
            updatedAt: nowISO(),
            dirty: true
        } as PartialTask);
    }

    debouncedSync();
}

// queries
export const useTasksQueryAll = (): ScheduleItem[] =>
    useLiveQuery(async () => {
        const items = await db.items.toArray();
        return items.sort(compareItemsByDate);
    }, []) ?? [];

export const useExceptionsQueryAll = (): RecurrenceException[] => 
    useLiveQuery(async () => {
        const exceptions = await db.exceptions.toArray();
        return exceptions;
    }, []) ?? [];

export const getItemByIdAPI = async (id: string): Promise<ScheduleItem | undefined> => {
    try {
        const rawBaseItem = db.items.get(id);
        return rawBaseItem;
    } catch (err) {
        throw new Error(`Failed to fetch task: ${err}`);
    }
}

export const getTasksByDayAPI = async (today: DateString): Promise<ScheduleItem[]> => {
    try {
        const rawBaseItems= await db.items
            .where("[doInfo.date+deletedAt]")
            .equals([today,""])
            .toArray();
        return rawBaseItems;
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getItemsBeforeDateAPI = async (endDate: DateString): Promise<ScheduleItem[]> => {
    try {
        const rawBaseItems= await db.items
            .where("doInfo.date")
            .belowOrEqual(endDate)
            .toArray();
        // go thru exceptions w/ final doDate before endDate, collect
        return rawBaseItems;
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
}

export const getTasksByDateRangeAPI = async (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => {
    // NOT IN USE
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
        const rawBaseTasks = await db.items
            .where("[parentId+deletedAt]")
            .equals([parentId,""])
            .toArray();
        return rawBaseTasks;
    } catch (err) {
        throw new Error(`Failed to fetch items: ${err}`);
    }
};

export const getItemsToDisplayAPI = async (): Promise<ScheduleItem[]> => {
    try {
        const rawBaseItems = await db.items  
            .where("[parentId+deletedAt]")
            .equals(["",""])
            .toArray();
        return rawBaseItems;
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

// runs on new day
export const processCheckedAPI = async (today: DateString) => {
    const checkedTasks = await db.items.filter(task => (task.variant === "task") && (task.checked || false)).toArray();
    const checkedExceptions = await db.exceptions.filter(ex => (ex.overrides?.checked || false)).toArray();

    // process checked tasks
    for(const task of checkedTasks) {
        if(task?.variant !== "task") continue;
        if(!task.checked || !task.checkedAt) continue;

        // checked off future task -> don't process yet
        if(ISOToDateStr(task.checkedAt) >= today) continue;

        // tentative; assumes no recurrence in subtasks
        if(task.parentId) continue;

        // tombstone task
        await deleteItemAPI(task.id);

        // tombstone all exceptions connected to task
        await deleteAllExceptionsOfItemAPI(task.id);
    }

    // process checked exceptions
    for(const exc of checkedExceptions) {
        const task = await db.items.get(exc.itemId);
        if(task?.variant !== "task") continue;
        
        const overrides = exc.overrides;
        // shouldn't happen, filtered out non-checked
        if(!overrides.checkedAt) continue;
        
        // checked off future task -> don't process yet
        if(ISOToDateStr(overrides.checkedAt) >= today) continue;

        // tentative; assumes no recurrence in subtasks
        if(task.parentId) continue;
        
        // no recurrence: soft delete
        if(!task.doInfo?.recurrence?.rrule) {
            deleteItemAPI(task.id);
            return;
        }

        // tombstone exception
        await deleteExceptionAPI(exc.id);
    }
}

// remote
export const pushChangesAPI = async () => {
    const userId = await getCurrentUserId();

    // items
    const dirtyItems = await db.items.filter(it => it.dirty).toArray();

    for(const item of dirtyItems) {
        const remoteItem = { ...toRemoteItemShape(item), user_id: userId };

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

    // exceptions
    const dirtyExceptions = await db.exceptions.filter(it => it.dirty).toArray();

    for(const ex of dirtyExceptions) {
        const remoteException = { ...toRemoteExceptionShape(ex), user_id: userId};

        const { error } = await supabase
            .from("exceptions")
            .upsert(remoteException);
        
        if(!error) {
            await db.exceptions.update(ex.id, { dirty: false });
            console.log("success");
        } else {
            console.log(error);
        }
    }
}

export const pullChangesAPI = async (lastSyncedAt: string) => {
    const userId = await getCurrentUserId();

    // items
    const { data: remoteItems } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", userId)
        .gt("updated_at", lastSyncedAt);
    
    for(const remote of (remoteItems ?? [])) {
        // remove dead rows
        if(remote.deleted_at) {
            await db.items.delete(remote.id);
            continue;
        }

        const local = await db.items.get(remote.id);
        // last write wins: local less recent
        if(!local || (remote.updated_at > local.updatedAt)) {
            await db.items.put(toLocalItemShape(remote)!);
        }
    }

    // exceptions
    const { data: remoteExceptions } = await supabase
        .from("exceptions")
        .select("*")
        .eq("user_id", userId)
        .gt("updated_at", lastSyncedAt);

    for(const remote of (remoteExceptions ?? [])) {
        // remove dead rows
        if(remote.deleted_at) {
            await db.exceptions.delete(remote.id);
            continue;
        }

        const local = await db.exceptions.get(remote.id);
        // last write wins: local less recent
        if(!local || (remote.updated_at > local.updatedAt)) {
            await db.exceptions.put(toLocalExceptionShape(remote)!);
        }
    }
}

export const hardPullAPI = async () => {
    const userId = await getCurrentUserId();

    // items
    const { data: allRemoteItems, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", userId)
        // don't repull deleted items
        .is("deleted_at", null);
    
    if(itemsError) throw itemsError;

    await db.transaction("rw", db.items, async () => {
        await db.items.clear();
        await db.items.bulkPut(
            allRemoteItems.map(item => toLocalItemShape(item))
        );
    });

    // exceptions
    const { data: allRemoteExceptions, error: exceptionsError } = await supabase
        .from("exceptions")
        .select("*")
        .eq("user_id", userId)
        // don't repull deleted items
        .is("deleted_at", null);
    
    if(exceptionsError) throw exceptionsError;
    
    await db.transaction("rw", db.exceptions, async () => {
        await db.exceptions.clear();
        await db.exceptions.bulkPut(
            allRemoteExceptions.map(ex => toLocalExceptionShape(ex))
        );
    });

    await setLastSyncedAt(new Date().toISOString());
}