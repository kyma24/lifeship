import { DayItemBuckets, ISOString, RemoteItem, ScheduleItem, TimePeriod } from "@/types";
import { getTodayString, toLocalDoInfo } from "./dateUtils";

export const sortToDayItemBuckets = (items: ScheduleItem[]): DayItemBuckets => {
    const itemBuckets: DayItemBuckets = {
        overdue: [],
        unsorted: [],
        scheduled: [],
        /*morning: [],
        afternoon: [],
        evening: [],*/
        completed: []
    };

    for(const item of items) {
        if((item.variant === "task") && item.checked) 
            itemBuckets.completed.push(item);
        else if((item.doInfo?.date ?? "") < getTodayString())
            itemBuckets.overdue.push(item);
        else if(item.doInfo?.timePeriod)
            itemBuckets.scheduled.push(item);
        /*else if(item.doInfo?.timePeriod && (item.doInfo.timePeriod.type === "exact")) {
            const minutesDayStart = item.doInfo.timePeriod.minutesDayStart;
            // before 12PM
            if(minutesDayStart <= 720) itemBuckets.morning.push(item);
            // before 6PM
            else if(minutesDayStart < 1080) itemBuckets.afternoon.push(item);
            // after 6PM
            else itemBuckets.evening.push(item);
        }
        else if(item.doInfo?.timePeriod && (item.doInfo.timePeriod.type === "tod")) {
            const timeOfDay = item.doInfo.timePeriod.timeOfDay;
            if(timeOfDay === "morning") itemBuckets.morning.push(item);
            else if(timeOfDay === "afternoon") itemBuckets.afternoon.push(item);
            else itemBuckets.evening.push(item);
        }*/
        else itemBuckets.unsorted.push(item);
    }

    return itemBuckets;
}

export const toRemoteShape = (item: ScheduleItem): RemoteItem => (
    {
        id: item.id,
        variant: item.variant,
        name: item.name,
        parent_id: (item.parentId === "") ? null : item.parentId,
        child_order: item.childOrder,

        description: item.description ?? "",
        tags: item.tags ?? [],
        do_date: item.doInfo?.date ?? null,
        duration: item.doInfo?.duration ?? 0,
        timezone: item.doInfo?.timezone ?? null,
        time_period_type: item.doInfo?.timePeriod?.type ?? null,
        exact_mins_date_start: (item.doInfo?.timePeriod?.type === "exact") ? item.doInfo.timePeriod.minutesDayStart : null,
        time_of_day: (item.doInfo?.timePeriod?.type === "tod") ? item.doInfo.timePeriod.timeOfDay : null,
        rrule: item.doInfo?.recurrence?.rrule ?? null,
        end_date: item.doInfo?.recurrence?.endDate ?? null,

        color: item.color ?? null,
        icon: item.icon ?? null,

        priority: (item.variant === "task") ? (item.priority ?? null) : null,
        checked: (item.variant === "task") ? item.checked : null,

        fixed: (item.variant === "block") ? item.fixed : null,

        deleted_at: (item.deletedAt === "") ? null : item.deletedAt,
        updated_at: item.updatedAt,
        created_at: item.createdAt,
        user_id: item.userId,
        device_id: item.deviceId,
    } as RemoteItem
);

export const toLocalShape = (remoteItem: RemoteItem): ScheduleItem => {
    const retItem = {
        id: remoteItem.id,
        name: remoteItem.name,
        description: remoteItem.description,
        parentId: remoteItem.parent_id ?? "",
        childOrder: remoteItem.child_order,
        tags: remoteItem.tags,
        doInfo: (remoteItem.do_date) ? toLocalDoInfo(remoteItem) : null,

        color: remoteItem.color ?? "",
        icon: remoteItem.icon ?? "",

        deletedAt: remoteItem.deleted_at ?? ("" as ISOString),
        updatedAt: remoteItem.updated_at,
        createdAt: remoteItem.created_at,
        userId: remoteItem.user_id,
        deviceId: remoteItem.device_id,

        dirty: false
    }

    if(remoteItem.variant === "task") {
        return {...retItem,
            variant: "task",
            priority: remoteItem.priority,
            checked: remoteItem.checked
        };
    } else {
        return {...retItem,
            variant: "block",
            fixed: remoteItem.fixed
        };
    }
}