import { RRule } from "rrule";
import { Task } from "../types"
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";

export const getNextOccurrence = (task: Task): string | null => {
    if(!task.doDate?.recurrence) return null;
    
    const rule = RRule.fromString(task.doDate.recurrence.rrule);
    // DATEMOD - turn next into date-only string
    const next = rule.after(new Date());
    return "";
};

export const getPrevOccurrence = (task: Task): string | null => {
    if(!task.doDate?.recurrence) return null;

    const rule = RRule.fromString(task.doDate.recurrence.rrule);
    // DATEMOD - turn prev into date-only string
    const prev = rule.before(new Date());
    return "";
};

export const toDateStr = (utcDate: Date, timezone: string): string => {
    const zonedDate = toZonedTime(utcDate, timezone);
    
    const year = zonedDate.getFullYear();
    const month = zonedDate.getMonth()+1;
    const date = zonedDate.getDate();

    // YYYY-MM-DD
    return `${year}-${(month>=10)?(month):(`0${month}`)}-${(date>=10)?(date):(`0${date}`)}`;
};

// to be reprocessed

export const getTimezone = (task: Task): string =>
    "";

export const toLocalDate = (utcMs: number, task: Task): Date =>
    toZonedTime(new Date(utcMs), getTimezone(task));

export const toUTCMs = (localDate: Date, task: Task): number =>
    fromZonedTime(localDate, getTimezone(task)).getTime();

export const customFormatDate = (utcMs: number, task: Task, fmt: string = "MMM d, yyyy"): string => 
    format(
        toZonedTime(new Date(utcMs), getTimezone(task)),
        fmt, 
        { timeZone: getTimezone(task) }
    );

export const formatTime = (utcMs: number, task: Task) =>
    customFormatDate(utcMs, task, "h:mm a");

export const formatDateTime = (utcMs: number, task: Task) =>
    customFormatDate(utcMs, task, "MMM d h::mm a");

export const toDate = (ms: number): Date => new Date(ms);
export const toMs = (date: Date): number => date.getTime();
export const nowMs = (): number => Date.now();

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
export const getYear = (date: Date): string => date.toLocaleDateString("en-US", { year: "numeric" });
export const getTime = (date: Date): string => {
    const hours = date.getHours();
    const mins = date.getMinutes();
    return `${(hours%12==0)?12:hours%12}:${(mins<10)?'0':''}${mins} ${(hours<12)?'AM':'PM'}`;
};

export const addDurationMs = (ms: number, duration: number): number => ms + duration*60000;
export const addDuration = (date: Date, duration: number): Date => toDate(addDurationMs(date.getTime(), duration));

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