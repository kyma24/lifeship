import { DateString, ISOString, ItemOverrides, RecurrenceException, RemoteException, ScheduleItem, Task } from "@/types";
import { Json } from "@/types/database.types";
import { RRule, rrulestr } from "rrule";
import { getEndOfDay, getStartOfDay, toDateStr, toNativeDate } from "./dateUtils";
import { nanoid } from "nanoid";

export const mergeItemsWithExceptions = (
    items: ScheduleItem[], 
    exceptions: RecurrenceException[], 
    startDate: DateString, 
    endDate: DateString,
    today: DateString
) => {
    // tasks w/o new date but effect date within range OR new date within range
    const exceptionsToApply = exceptions
        .filter((exc) => {
            const ret = !exc.deletedAt;
            const newDate = exc.overrides?.doInfo?.date ?? null;
            if(newDate) return ret && (newDate>=startDate) && (newDate<=endDate);
            return ret && (exc.effectDate>=startDate) && (exc.effectDate<=endDate);
        });

    // key: base taskId
    const exceptionsByTaskId: Record<string,RecurrenceException[]> = {};
    for(const exc of exceptionsToApply) {
        const excId=exc.itemId;
        if(exceptionsByTaskId[excId]) exceptionsByTaskId[excId].push(exc);
        else exceptionsByTaskId[excId]=[exc];
    }

    const displayTasks: Task[] = [];
    const countTaskOnDate = new Map<DateString,number>();

    // go through all items:
    for(const item of items) {
        const curDate = item.doInfo?.date;
        if((item.variant !== "task") || !curDate || item.deletedAt) continue;

        // deal with no recurrence
        if(!item.doInfo?.recurrence?.rrule) {
            // has exception in range?
            const exc = exceptionsByTaskId[item.id] ?? [];
            if(exc.length>0) {
                const overrides = exc[0]?.overrides ?? {};
                displayTasks.push({...item, ...overrides, exceptionId: ""});
                console.log(item.id);
            }
            // account for overdue
            else if((startDate === today) && (curDate < today)) {
                displayTasks.push({...item, exceptionId: ""});
            }
            // account for normal task within range
            else if ((curDate >= startDate) && (curDate <= endDate)) {
                displayTasks.push({...item, exceptionId: ""});
            }
            continue;
        }

        if(exceptionsByTaskId[item.id]) {
            // go thru all exceptions with taskId=item.id:
            countTaskOnDate.clear();
            for(const exc of exceptionsByTaskId[item.id] ?? []) {
                const newDate = exc.overrides?.doInfo?.date;

                // if modifying without date
                if(!newDate) {
                    const newTask: Task = {...item, ...exc.overrides, exceptionId: exc.id};
                    displayTasks.push(newTask);

                    const curCount = countTaskOnDate.get(exc.effectDate) ?? 0;
                    countTaskOnDate.set(exc.effectDate,(curCount<=0)?(-1):(1));
                    continue;
                }

                // if newDate not in range or alrdy taken: don't include
                if(((countTaskOnDate.get(newDate) ?? 0) > 0) || (newDate<startDate) || (newDate>endDate)) continue;
                // if in range: merge overrides with taskId, exceptionId=exception.id
                else {
                    const newTask: Task = {...item, ...exc.overrides, exceptionId: exc.id};
                    displayTasks.push(newTask);

                    // mark exception.effectDate & newDate as "visited" (-1: removed, 0: untouched, 1: replaced)
                    const curCount = countTaskOnDate.get(exc.effectDate) ?? 0;
                    countTaskOnDate.set(exc.effectDate,(curCount<=0)?(-1):(1));
                    countTaskOnDate.set(newDate,1);
                }
            }
        }
        
        // occDates -> all occurrences of item in range
        const rruleObj = rrulestr(item.doInfo.recurrence.rrule) as RRule;
        const occDates: DateString[] = rruleObj
            .between(getStartOfDay(toNativeDate(startDate)), getEndOfDay(toNativeDate(endDate)))
            .map((date) => toDateStr(date));

        // for each non-"visited" in occDates: add base task to return, no exceptions found
        for(const date of occDates) {
            if((countTaskOnDate.get(date) === 0) || (!countTaskOnDate.has(date))) {
                displayTasks.push({...item, 
                    doInfo: {...item.doInfo, date},
                    exceptionId: nanoid() // FIX: MAKE SECURE LATER? (nanoid)
                });
            }
        }
    }

    return displayTasks;
}

const serializeOverrides = (overrides: ItemOverrides | null): Json => {
    return overrides as Json;
}

const deserializeOverrides = (json: Json | null): ItemOverrides => {
    if(!json || typeof json !== "object" || Array.isArray(json)) return {};
    const overrides: Record<string,unknown> = {};
    for(const key of Object.keys(json)) {
        overrides[key as keyof ItemOverrides] = (json as Record<string,unknown>)[key];
    }
    return overrides;
}

export const toRemoteExceptionShape = (ex: RecurrenceException): RemoteException => {
    return {
        id: ex.id,
        item_id: ex.itemId,
        effect_date: ex.effectDate,
        occurrence_index: ex.occurrenceIndex,
        variant: ex.variant,
        overrides: serializeOverrides(ex.overrides),

        deleted_at: ex.deletedAt ?? null,
        updated_at: ex.updatedAt,
        created_at: ex.createdAt,
        device_id: ex.deviceId,
        user_id: ex.userId
    };
}

export const toLocalExceptionShape = (remoteEx: RemoteException): RecurrenceException => {
    return {
        id: remoteEx.id,
        itemId: remoteEx.item_id,
        // CHECK VALIDITY?
        effectDate: remoteEx.effect_date as DateString,
        occurrenceIndex: remoteEx.occurrence_index ?? 0,
        variant: (remoteEx.variant === "deleted") ? "deleted" : "modified",
        overrides: deserializeOverrides(remoteEx.overrides),

        deletedAt: remoteEx.deleted_at as ISOString ?? null,
        updatedAt: remoteEx.updated_at as ISOString,
        createdAt: remoteEx.created_at as ISOString,
        deviceId: remoteEx.device_id,
        userId: remoteEx.user_id,

        dirty: false
    };
}