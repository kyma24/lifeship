import { ScheduleItem } from ".";
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