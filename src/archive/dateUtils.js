import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

export const getTimezone = (task) =>
    task?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toLocalDate = (utcMs, task) =>
    toZonedTime(newDate(utcMs), getTimezone(task));

export const toUTCMs = (localDate, task) =>
    fromZonedTime(localDate, getTimezone(task)).getTime();

export const customFormatDate = (utcMs, task, fmt=`MMM d, yyyy`) =>
    format(toZonedTime(new Date(utcMs), getTimezone(task)), fmt, {
        timeZone: getTimezone(task)
    });

export const formatTime = (utcMs, task) => 
    customFormatDate(utcMs, task, 'h:mm a');

export const formatDateTime = (utcMs, task) =>
    customFormatDate(utcMs, task, 'MMM d h::mm a');

export const toDate = (ms) => new Date(ms);
export const getToday = () => new Date();
export const getTomorrow = () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate()+1);
    return tmrw;
}

export const getStartOfDay = (today) => new Date(new Date(today).setHours(0,0,0,0));
export const getEndOfDay = (today) => new Date(new Date(today).setHours(23,59,59,999));

export const toMs = (date) => date.getTime();
export const nowMs = () => Date.now();

export const getWeekday = (date) => date.toLocaleDateString("en-US", { weekday: "long" });
export const getMonth = (date) => date.toLocaleDateString("en-US", { month: "long" });
export const getMonthAbbr = (date) => date.toLocaleDateString("en-US", { month: "short" });
export const getDay = (date) => date.toLocaleDateString("en-US", { day: "numeric" });
export const getYear = (date) => date.toLocaleDateString("en-US", { year: "numeric" });
export const getTime = (date) => {
    const hours = date.getHours();
    const mins = date.getMinutes();
    return `${(hours>0)?hours%12:12}:${(mins<10)?'0':''}${mins} ${(hours<12)?'AM':'PM'}`;
}

export const addDurationMs = (ms, duration) => ms + duration*60000;
export const addDuration = (date, duration) => toDate(addDurationMs(date.getTime(),duration));
export const getEndOfWeek = (date) => {
    const retDate = getStartOfDay(date);
    retDate.setDate(date.getDate() + 6);
    retDate.setHours(23,59,59,999);
    return retDate;
}

export const isSameDay = (today, date) => (date.getDate() === today.getDate()) && (date.getMonth() === today.getMonth()) && (date.getYear() === today.getYear());
export const isSameWeek = (today, date) => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0,0,0,0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    return (date >= startOfWeek) && (date <= endOfWeek);
}

export const formatDate = (date) => {
    if(isSameDay(getToday(), date)) return "Today";
    if(isSameDay(getTomorrow(), date)) return "Tomorrow";
    if(isSameWeek(getToday(), date)) return getWeekday(date);
    return `${getMonthAbbr(date)} ${getDay(date)}`;
}

export const procTimezone = (tz, date) => {
    const timezone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}