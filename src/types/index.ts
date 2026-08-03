import { Block, PartialBlock } from "./block";
import { DoInfo, ISOString } from "./date";
import { PartialTask, Task } from "./task";

export * from "./task";
export * from "./date";
export * from "./block";
export * from "./misc";

export interface BaseItem {
    id: string;
    name: string;
    description?: string;
    parentId: string;
    childOrder: number;
    tags?: string[];
    doInfo?: DoInfo | null;

    color?: string;
    icon?: string;

    // sync metadata
    deletedAt: ISOString | null;
    updatedAt: ISOString;
    createdAt: ISOString;
    userId: string;
    deviceId: string;

    dirty: boolean;
}

export type ScheduleItem = Task | Block;
export type PartialScheduleItem = PartialTask | PartialBlock;

export interface RemoteItem {
    id: string;
    variant: "task" | "block";
    name: string;
    parent_id: string;
    child_order: number;

    description?: string;
    tags?: string[];
    do_date?: string;
    duration?: number;
    timezone?: string;
    time_period_type?: string;
    exact_mins_date_start?: number;
    time_of_day?: string;
    rrule?: string;
    end_date?: string;
    
    color?: string;
    icon?: string;

    // task
    priority?: number;
    checked: boolean;

    // block
    fixed: boolean;

    deleted_at?: ISOString;
    updated_at: ISOString;
    device_id: string;
    user_id: string;
    created_at: ISOString;
};