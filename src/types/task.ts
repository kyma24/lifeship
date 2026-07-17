import { TimePeriod } from "./date";

export interface Task {
    id: string;
    name: string;
    description?: string | "";
    parent_id?: string;
    child_order?: string[];
    priority?: number | 3; // 1-3?
    tags?: string[];
    doDate?: DoDate;
    checked?: boolean | false;
    is_deleted?: boolean | false; // soft delete
}

export type PartialTask = Partial<Omit<Task,"id">>;

export interface DoDate {
    date: string;
    timePeriod: TimePeriod | null;
    duration: number | null; // minutes
    timezone: string | null; // null = floating
    recurrence: RecurrenceRule | null;
}

export interface RecurrenceRule {
    rrule: string | "FREQ=DAILY";
    endDate?: string;
}