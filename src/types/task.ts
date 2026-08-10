import { BaseItem, ISOString } from ".";

export interface Task extends BaseItem {
    variant: "task";
    priority?: number; // 1-3?
    checked: boolean;
    checkedAt: ISOString | null;
}

export type PartialTask = Partial<Omit<Task,"id">>;