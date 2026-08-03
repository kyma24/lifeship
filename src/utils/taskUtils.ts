import { PartialTask, ScheduleItem, Task } from "@/types";
import { nowISO } from "./dateUtils";
import { getDeviceId } from "./backend/device";

export const createTaskFromDraft = (id: string, draftTask: PartialTask): Task => (
    {
        id: id,
        name: draftTask.name ?? "",
        description: draftTask.description ?? "",
        parentId: draftTask.parentId ?? "",
        childOrder: draftTask.childOrder ?? 0,
        priority: draftTask.priority ?? 3,
        tags: draftTask.tags ?? [],
        doInfo: draftTask.doInfo ?? null,
        checked: draftTask.checked ?? false,
        variant: draftTask.variant ?? "task",
        
        deletedAt: draftTask.deletedAt ?? "",
        updatedAt: nowISO(),
        createdAt: draftTask.createdAt ?? nowISO(),
        deviceId: getDeviceId(),
        userId: draftTask.userId,
        dirty: true,
    } as Task
);

// -1: a < b, 0: a = b, 1: a > b
export const compareItemsByDate = (a: ScheduleItem, b: ScheduleItem): number => {
    if(!a.doInfo?.date && !b.doInfo?.date) return 0;
    if(!a.doInfo?.date) return -1;
    if(!b.doInfo?.date) return 1;
    return 0;
};

export const isPartialTaskDifferent = (task: Task, modTask: PartialTask): boolean => {
    if(!task || !modTask) return false;
    const {id, ...noIdTask} = task;
    return JSON.stringify(noIdTask) !== JSON.stringify(modTask);
}