import { BaseItem } from ".";

export interface Task extends BaseItem {
    variant: "task";
    priority?: number; // 1-3?
    checked: boolean;
}

export type PartialTask = Partial<Omit<Task,"id">>;