
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