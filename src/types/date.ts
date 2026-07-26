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

export type TimePeriod = null
    | { type: "exact"; minutesDayStart: number }
    | { type: "tod"; timeOfDay: TimeOfDay };

export type TimeOfDay = "morning" | "afternoon" | "evening";

declare const brand: unique symbol;
export type DateString = string & {[brand]: "DateString"};

export interface DateComponents { 
    year: number; 
    month: number; 
    day: number; 
};