import { RRule } from "rrule";
import { Task } from "../types"
import { toZonedTime } from "date-fns-tz";

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
}