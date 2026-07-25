import { PartialTask, ScheduleItem, Task } from "@/types";

export const defaultTask: PartialTask = {
  name: "",
  parentId: "",
  description: "",
  tags: [],
  doDate: null,
  checked: false,
  variant: "task"
}

export const createTaskFromDraft = (id: string, draftTask: PartialTask): Task => (
    {
        id: id,
        name: draftTask.name ?? "",
        description: draftTask.description ?? "",
        parentId: draftTask.parentId ?? undefined,
        childOrder: draftTask.childOrder ?? undefined,
        priority: draftTask.priority ?? 3,
        tags: draftTask.tags ?? [],
        doDate: draftTask.doDate ?? null,
        checked: draftTask.checked ?? false,
        isDeleted: draftTask.isDeleted ?? false,
        variant: draftTask.variant ?? "task",
    } as Task
);

// -1: a < b, 0: a = b, 1: a > b
export const compareItemsByDate = (a: ScheduleItem, b: ScheduleItem): number => {
    if(!a.doDate?.date && !b.doDate?.date) return 0;
    if(!a.doDate?.date) return -1;
    if(!b.doDate?.date) return 1;
    return 0;
};

export const isPartialTaskDifferent = (task: Task, modTask: PartialTask): boolean => {
    if(!task || !modTask) return false;
    const {id, ...noIdTask} = task;
    return JSON.stringify(noIdTask) !== JSON.stringify(modTask);
}