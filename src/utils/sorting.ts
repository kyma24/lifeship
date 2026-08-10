import { ScheduleItem } from "@/types";
import { getNumberTOD } from "./dateUtils";

type Comparator<T> = (a: T, b: T) => number;

function chainComparators<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (a,b) => {
        for(const comp of comparators) {
            const res = comp(a,b);
            if(res !== 0) return res;
        }
        return 0;
    };
}

const byChildOrder: Comparator<ScheduleItem> = (a,b) => a.childOrder - b.childOrder;

const byDoDate: Comparator<ScheduleItem> = (a,b) => {
    if(!a.doInfo || !b.doInfo) return Number(!b.doInfo) - Number(!a.doInfo);
    return a.doInfo.date.localeCompare(b.doInfo.date);
};

const byTimePeriod: Comparator<ScheduleItem> = (a,b) => {
    if(!a.doInfo?.timePeriod || !b.doInfo?.timePeriod) return Number(!b.doInfo?.timePeriod) - Number(!a.doInfo?.timePeriod);

    const aTP = a.doInfo.timePeriod;
    const bTP = b.doInfo.timePeriod;

    if((aTP.type === "exact") && (bTP.type === "exact")) 
        return aTP.minutesDayStart - bTP.minutesDayStart;

    if((aTP.type === "tod") && (bTP.type === "tod"))
        return getNumberTOD(aTP.timeOfDay) - getNumberTOD(bTP.timeOfDay);

    // tod < exact
    return ((aTP.type === "tod") ? -1 : 1);
};

// variant & checked
const byCheckedStatus: Comparator<ScheduleItem> = (a,b) => {
    if(!(a.variant === "task") || !(b.variant === "task"))
        return Number(!(a.variant === "task")) - Number(!(b.variant === "task"));
    return Number(a.checked) - Number(b.checked);
};

export const todoComparator = chainComparators(byChildOrder, byCheckedStatus, byDoDate, byTimePeriod);