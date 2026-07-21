import { PartialTask, Task } from "@/types";

export const createTaskFromDraft = (id: string, draftTask: PartialTask): Task => (
    {
        id: id,
        name: draftTask.name ?? "",
        description: draftTask.description ?? "",
        parent_id: draftTask.parent_id ?? undefined,
        child_order: draftTask.child_order ?? undefined,
        priority: draftTask.priority ?? 3,
        tags: draftTask.tags ?? [],
        doDate: draftTask.doDate ?? null,
        checked: draftTask.checked ?? false,
        is_deleted: draftTask.is_deleted ?? false
    } as Task
);

// -1: a < b, 0: a = b, 1: a > b
export const compareTasksByDate = (a: Task, b: Task): number => {
    if(!a.doDate?.date && !b.doDate?.date) return 0;
    if(!a.doDate?.date) return -1;
    if(!b.doDate?.date) return 1;
    return 0;
};