
export type TimePeriod = null
    | { type: "exact"; minutesDayStart: number }
    | { type: "tod"; timeOfDay: TimeOfDay };

export type TimeOfDay = "morning" | "afternoon" | "evening";