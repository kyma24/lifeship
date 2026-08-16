import { ISOString, PartialTask, RecurrenceException, RemoteException } from "@/types";
import { toLocalDoInfo } from "./dateUtils";

export const toRemoteExceptionShape = (ex: RecurrenceException): RemoteException => {
    let retEx = {
        id: ex.id,
        item_id: ex.itemId,
        effect_date: ex.effectDate,
        occurrence_index: ex.occurrenceIndex,
        variant: ex.variant,

        deleted_at: (ex.deletedAt === "") ? null : ex.deletedAt,
        updated_at: ex.updatedAt,
        created_at: ex.createdAt,
        user_id: ex.userId,
        device_id: ex.deviceId,
    } as RemoteException;

    if(!ex.overrides) return retEx;
    
    const overrides: PartialTask = ex.overrides;

    if("name" in overrides) retEx={...retEx, name: overrides.name};
    if("parentId" in overrides) retEx={...retEx, parent_id: (overrides.parentId === "") ? null : overrides.parentId ?? null};
    if("childOrder" in overrides) retEx={...retEx, child_order: overrides.childOrder};
    if("description" in overrides) retEx={...retEx, description: overrides.description ?? ""};
    if("tags" in overrides) retEx={...retEx, tags: overrides.tags ?? []};
    if("doInfo" in overrides) retEx={...retEx,
        do_date: overrides.doInfo?.date as string ?? null,
        duration: overrides.doInfo?.duration ?? 0,
        timezone: overrides.doInfo?.timezone ?? null,
        time_period_type: overrides.doInfo?.timePeriod?.type ?? null,
        exact_mins_date_start: (overrides.doInfo?.timePeriod?.type === "exact") ? overrides.doInfo.timePeriod.minutesDayStart : null,
        time_of_day: (overrides.doInfo?.timePeriod?.type === "tod") ? overrides.doInfo.timePeriod.timeOfDay : null,
        rrule: overrides.doInfo?.recurrence?.rrule ?? null,
        end_date: overrides.doInfo?.recurrence?.endDate ?? null,
    };
    if("color" in overrides) retEx={...retEx, color: overrides.color};
    if("icon" in overrides) retEx={...retEx, icon: overrides.icon};
    if("priority" in overrides) retEx={...retEx, priority: overrides.priority};
    if("checked" in overrides) retEx={...retEx, checked: overrides.checked};
    if("checkedAt" in overrides) retEx={...retEx, checked_at: overrides.checkedAt}

    return retEx;
}

export const toLocalExceptionShape = (remoteEx: RemoteException): RecurrenceException => {
    const retEx = {
        id: remoteEx.id,
        itemId: remoteEx.item_id,
        effectDate: remoteEx.effect_date,
        occurrenceIndex: remoteEx.occurrence_index,
        variant: remoteEx.variant,

        deletedAt: remoteEx.deleted_at ?? ("" as ISOString),
        updatedAt: remoteEx.updated_at,
        createdAt: remoteEx.created_at,
        userId: remoteEx.user_id,
        deviceId: remoteEx.device_id,
    } as RecurrenceException;

    let overrides: PartialTask = {};
    if("name" in remoteEx) overrides={...overrides, name: remoteEx.name ?? ""};
    if("description" in remoteEx) overrides={...overrides, description: remoteEx.description ?? ""};
    if("parent_id" in remoteEx) overrides={...overrides, parentId: remoteEx.parent_id ?? ""};
    if("child_order" in remoteEx) overrides={...overrides, childOrder: remoteEx.child_order ?? 0};
    if("tags" in remoteEx) overrides={...overrides, tags: remoteEx.tags};
    if("do_date" in remoteEx) overrides={...overrides, doInfo: toLocalDoInfo(remoteEx)};
    if("color" in remoteEx) overrides={...overrides, color: remoteEx.color ?? ""};
    if("icon" in remoteEx) overrides={...overrides, icon: remoteEx.icon ?? ""};

    if("priority" in remoteEx) overrides={...overrides, priority: remoteEx.priority};
    if("checked" in remoteEx) overrides={...overrides, checked: remoteEx.checked};
    if("checkedAt" in remoteEx) overrides={...overrides, checkedAt: remoteEx.checked_at};

    return {...retEx, overrides};
}