import { BaseItem, Task } from "./task";

export interface Block extends BaseItem {
    variant: "block";
}

export type ScheduleItem = Task | Block;