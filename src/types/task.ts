import { DateString, TimePeriod } from "./date";

export interface BaseItem {
    id: string;
    name: string;
    description?: string | "";
    parentId: string;
    childOrder?: number;
    tags?: string[];
    doDate?: DoDate | null;
    isDeleted?: boolean | false; // soft delete
}

export interface Task extends BaseItem {
    variant: "task";
    priority?: number; // 1-3?
    checked: boolean;
}

export type PartialTask = Partial<Omit<Task,"id">>;

export interface DoDate {
    date: DateString;
    timePeriod: TimePeriod | null;
    duration: number | null; // minutes
    timezone: string | null; // null = floating
    recurrence: RecurrenceRule | null;
}

export interface RecurrenceRule {
    rrule: string | "FREQ=DAILY";
    endDate?: string;
}