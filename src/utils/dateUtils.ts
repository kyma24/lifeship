import { RRule } from "rrule";
import { DateComponents, DateString, DoInfo, ISOString, RecurrenceRule, RemoteItem, Task, TimeOfDay, TimePeriod } from "../types"
import { toZonedTime } from "date-fns-tz";

// default info
export const getBaseDoInfo = (): DoInfo => ({
    date: getTodayString(),
    timePeriod: null,
    duration: null,
    timezone: null,
    recurrence: null
});

// recurrence
export const getNextOccurrence = (task: Task): DateString | null => {
    if(!task.doInfo?.recurrence) return null;

    const ruleString = RRule.parseString(task.doInfo.recurrence.rrule);
    const date = toNativeDate(task.doInfo.date);
    ruleString.dtstart = date;
    
    const rule = new RRule(ruleString);
    const next = rule.after(date);

    return (next) ? toDateStr(next) : null;
};

export const getPrevOccurrence = (task: Task): DateString | null => {
    if(!task.doInfo?.recurrence) return null;

    const ruleString = RRule.parseString(task.doInfo.recurrence.rrule);
    const date = toNativeDate(task.doInfo.date);
    ruleString.dtstart = date;

    const rule = new RRule(ruleString);
    const prev = rule.before(date);

    return (prev) ? toDateStr(prev) : null;
};

// basic conversions
export const toDateStr = (utcDate: Date, timezone?: string): DateString => {
    const properTimezone = (timezone) ? timezone : getTimezone();
    const zonedDate = toZonedTime(utcDate, properTimezone);
    // YYYY-MM-DD
    const formattedStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: properTimezone,
        year: "numeric", month: "2-digit", day: "2-digit",
    }).format(zonedDate);

    return formattedStr as DateString;
};

export const toLocalDoInfo = (remoteItem: RemoteItem): DoInfo => {
    const retInfo = {
        date: remoteItem.do_date,
        duration: remoteItem.duration ?? null,
        timezone: remoteItem.timezone ?? null,
        recurrence: {
            rrule: remoteItem.rrule ?? "",
            endDate: remoteItem.end_date ?? null,
        }
    } as DoInfo;

    if(remoteItem.time_period_type === "exact") {
        return {...retInfo,
            timePeriod: {
                type: "exact",
                minutesDayStart: remoteItem.exact_mins_date_start ?? 0
            } as TimePeriod
        };
    }
    
    return {...retInfo,
        timePeriod: {
            type: "tod",
            timeOfDay: remoteItem.time_of_day ?? "morning"
        } as TimePeriod
    };
}

export const nativeToDateInfo = (utcDate: Date, timezone?: string): DoInfo => {
    const properTimezone = (timezone) ? timezone : getTimezone();
    const zonedDate = toZonedTime(utcDate, properTimezone);
    const minutesDayStart = zonedDate.getHours()*60 + zonedDate.getMinutes();
    return {
        date: toDateStr(utcDate, timezone),
        timePeriod: {
            type: "exact",
            minutesDayStart: minutesDayStart
        } as TimePeriod,
        duration: null,
        timezone: timezone,
        recurrence: null,
    } as DoInfo;
}

export const toDateComponents = (dateString: DateString): DateComponents => {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day } as DateComponents;
};

export const toTimeComponents = (rawMinutes: number) => {
    const hrs = Math.floor(rawMinutes/60);
    const mins = rawMinutes % 60;
    return { hrs, mins };
}

export const toNativeDate = (dateString: DateString, minutesDayStart?: number): Date => {
    const {year, month, day} = toDateComponents(dateString);
    const ret = new Date(year, month-1, day);
    if(minutesDayStart) {
        const {hrs, mins} = toTimeComponents(minutesDayStart);
        ret.setHours(hrs, mins);
    }
    return ret;
};

const isValidTimeOfDay = (str: string): boolean => {
    return (str==="morning") || (str==="afternoon") || (str==="evening");
}

export const parseTimeString = (tstr: string): TimePeriod | null => {
    if(tstr==="") return null;
    // tod: "morning", "afternoon", "evening"
    if(isValidTimeOfDay(tstr)) return {
        type: "tod",
        timeOfDay: tstr as TimeOfDay
    };

    // exact: parse _ _ : _ _ (AM/PM)
    const regex: RegExp = /^(?<hours>0?\d|1\d|2[0-3]):(?<minutes>[0-5]\d)\s?(?<meridiem>am|pm)?$/i;
    const res = tstr.match(regex);
    if(res?.groups) {
        const { hours, minutes, meridiem } = res.groups;
        if(!hours || !minutes) return null;

        if(meridiem) {
            switch (meridiem.toLowerCase()) {
                case "am":
                    if((+hours)>12) return null;
                    return {
                        type: "exact",
                        minutesDayStart: (+hours%12)*60+(+minutes)
                    };
                case "pm":
                    if((+hours)>12) return null;
                    return {
                        type: "exact",
                        minutesDayStart: ((+hours%12)+12)*60+(+minutes)
                    };
                default:
                    return null;
            }
        } 
        else return {
            type: "exact",
            minutesDayStart: (+hours)*60+(+minutes)
        };
    }

    return null;
}

// revise with current date later
export const getTodayString = () => {
    return toDateStr(getToday());
};

export const getTomorrowString = () => {
    return toDateStr(getTomorrow());
};

// time period management
export const createTimePeriod = (type: string, newMinutesDayStart?: number, newTimeOfDay?: TimeOfDay): TimePeriod => {
    if((type === "exact") && newMinutesDayStart) return { type: "exact", minutesDayStart: newMinutesDayStart } as TimePeriod;
    if((type === "tod") && newTimeOfDay) return { type: "tod", timeOfDay: newTimeOfDay} as TimePeriod;
    return null;
}

const addDurationTP = (timePeriod: TimePeriod, duration: number): TimePeriod => {
    if(timePeriod?.type !== "exact") return timePeriod;
    const ret = createTimePeriod(timePeriod.type, timePeriod.minutesDayStart + duration);
    return ret;
}

export const addDurationTPFormatted = (timePeriod: TimePeriod, duration: number): string => {
    const ret = formatTimePeriod(addDurationTP(timePeriod, duration));
    return ret;
}

// transformations
export const getEndOfWeekDS = (dateString: DateString): DateString => {
    const startDate = toNativeDate(dateString);
    const endDate = getEndOfWeek(startDate);
    const ret = toDateStr(endDate);
    return ret;
}

// formatting
export const toWeekdayFormat = (dateString: DateString): string => {
    const date: Date = toNativeDate(dateString);
    const weekdayString: string = date.toLocaleDateString("en-US", { weekday: "long" });
    return weekdayString;
}

export const toWeekdayAbbrFormat = (dateString: DateString): string => {
    const date: Date = toNativeDate(dateString);
    const weekdayString: string = date.toLocaleDateString("en-US", { weekday: "short" });
    return weekdayString;
}

export const toMonthDayFormat = (dateString: DateString): string => {
    const date: Date = toNativeDate(dateString);
    const monthDayString: string = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return monthDayString;
}

export const formatDateString = (dateString: DateString): string => {
    const date: Date = toNativeDate(dateString);
    return formatDate(date);
}

const formatTimeComponent = (comp: number | null): string => {
    if(!comp) return "";
    return String(comp).padStart(2,'0');
}

export const formatTimePeriod = (timePeriod: TimePeriod): string => {
    if(timePeriod?.type === "exact") {
        const {hrs, mins} = toTimeComponents(timePeriod.minutesDayStart);
        return `${formatTimeComponent(hrs)}:${formatTimeComponent(mins)}`;
    } else if (timePeriod?.type === "tod") {
        return timePeriod.timeOfDay;
    }
    return "";
}

export const formatRecurrence = (recurrence: RecurrenceRule): string => {
    if(recurrence?.rrule === "FREQ=DAILY") {
        return "every day";
    }
    return "";
}

// to be reprocessed

export const nowISO = (): ISOString => {
    const now = new Date();
    return now.toISOString() as ISOString;
}

export const getTimezone = (task?: Task): string => 
    task?.doInfo?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toDate = (ms: number): Date => new Date(ms);
export const toMs = (date: Date): number => date.getTime();

export const getToday = (): Date => new Date();
export const getTomorrow = (): Date => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate()+1);
    return tmrw;
};
export const getYesterday = (): Date => {
    const ystr = new Date();
    ystr.setDate(ystr.getDate()-1);
    return ystr;
};

export const getStartOfDay = (today: Date): Date => new Date(new Date(today).setHours(0,0,0,0));
export const getEndOfDay = (today: Date): Date => new Date(new Date(today).setHours(23,59,59,999));

export const getWeekday = (date: Date): string => date.toLocaleDateString("en-US", { weekday: "long" });
export const getMonth = (date: Date): string => date.toLocaleDateString("en-US", { month: "long" });
export const getMonthAbbr = (date: Date): string => date.toLocaleDateString("en-US", { month: "short" });
export const getDay = (date: Date): string => date.toLocaleDateString("en-US", { day: "numeric" });

export const getEndOfWeek = (date: Date): Date => {
    const retDate = getStartOfDay(date);
    retDate.setDate(date.getDate() + 6);
    retDate.setHours(23,59,59,999);
    return retDate;
};

export const isSameDay = (today: Date, date: Date): boolean =>
    (date.getDate() === today.getDate()) && (date.getMonth() === today.getMonth()) && (date.getFullYear() === today.getFullYear());
export const isSameWeek = (today: Date, date: Date): boolean => {
    const startOfWeek = getStartOfDay(today);
    const endOfWeek = getEndOfWeek(startOfWeek);

    return (date >= startOfWeek) && (date <= endOfWeek);
};

export const formatDate = (date: Date): string => {
    if(isSameDay(getToday(), date)) return "Today";
    if(isSameDay(getYesterday(), date)) return "Yesterday";
    if(isSameDay(getTomorrow(), date)) return "Tomorrow";
    if(isSameWeek(getToday(), date)) return getWeekday(date);
    return `${getMonthAbbr(date)} ${getDay(date)}`;
};