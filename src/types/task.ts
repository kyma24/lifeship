import { DateString, TimePeriod } from "./date";

export interface Task {
    id: string;
    name: string;
    description?: string | "";
    parentId: string;
    childOrder?: string[];
    priority?: number | 3; // 1-3?
    tags?: string[];
    doDate?: DoDate | null;
    checked: boolean;
    isDeleted?: boolean | false; // soft delete
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