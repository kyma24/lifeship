import { Block, PartialBlock } from "./container";
import { DoDate } from "./date";
import { PartialTask, Task } from "./task";

export * from "./task";
export * from "./date";
export * from "./container";
export * from "./menu";

export interface BaseItem {
    id: string;
    name: string;
    description?: string | "";
    parentId: string;
    childOrder?: number;
    tags?: string[];
    doDate?: DoDate | null;
    isDeleted?: boolean | false; // soft delete

    color?: string;
    icon?: string;
}

export type ScheduleItem = Task | Block;
export type PartialScheduleItem = PartialTask | PartialBlock;