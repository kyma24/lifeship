export interface DoInfo {
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

export type DateString = string & {__brand: "DateString"};

export type ISOString = string & {__brand: "ISOString"};

export interface DateComponents { 
    year: number; 
    month: number; 
    day: number; 
};