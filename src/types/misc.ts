import { DateString, ISOString, PartialTask, ScheduleItem } from ".";

export interface MenuItemInfo {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string; }>;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
}

export interface DropdownOption {
    label: string;
    description?: string;
    meta?: string | null;
}

export interface DayItemBuckets {
    overdue: ScheduleItem[];
    unsorted: ScheduleItem[];
    scheduled: ScheduleItem[];
    morning?: ScheduleItem[];
    afternoon?: ScheduleItem[];
    evening?: ScheduleItem[];
    completed: ScheduleItem[];
}

export interface RecurrenceException {
    id: string;
    itemId: string;
    effectDate: DateString;
    occurrenceIndex: number;
    variant: "modified" | "deleted";
    // add recurrence/multiple dates sometime
    overrides: PartialTask;

    deletedAt: ISOString | null;
    updatedAt: ISOString;
    createdAt: ISOString;
    deviceId: string;
    userId: string;

    dirty: boolean;
}

export interface RemoteException {
    id: string;
    item_id: string;
    effect_date: string;
    occurrence_index: number;
    variant: "modified" | "deleted";

    name?: string;
    description?: string;
    parent_id?: string | null;
    child_order?: number;
    tags?: string[];
    do_date?: string | null;
    duration?: number | null;
    timezone?: string | null;
    time_period_type?: string | null;
    exact_mins_date_start?: number | null;
    time_of_day?: string | null;
    rrule?: string | null;
    end_date?: string | null;
    
    color?: string;
    icon?: string;

    priority?: number;
    checked?: boolean;
    checked_at?: ISOString | null;

    deleted_at?: ISOString;
    updated_at: ISOString;
    created_at: ISOString;
    device_id: string;
    user_id: string;
}