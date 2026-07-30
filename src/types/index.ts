import { Block, PartialBlock } from "./container";
import { DoInfo, ISOString } from "./date";
import { PartialTask, Task } from "./task";

export * from "./task";
export * from "./date";
export * from "./container";
export * from "./menu";

export interface BaseItem {
    id: string;
    name: string;
    description?: string;
    parentId: string;
    childOrder: number;
    tags?: string[];
    doDate?: DoInfo | null;

    color?: string;
    icon?: string;

    // sync metadata
    deletedAt: ISOString | null;
    updatedAt: ISOString;
    createdAt: ISOString;
    userId: string;
    deviceId: string;
}

export type ScheduleItem = Task | Block;
export type PartialScheduleItem = PartialTask | PartialBlock;