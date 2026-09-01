import { BaseItem, ISOString } from ".";

export interface BaseTask extends BaseItem {
    variant: "task";
    priority?: number; // 1-3?
    checked: boolean;
    checkedAt: ISOString | null;
}

export interface Task extends BaseTask {
    exceptionId: string;
}

export type PartialTask = Partial<Omit<Task,"id">>;