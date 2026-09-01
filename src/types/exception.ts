import { Tables } from "./database.types";
import { DateString, DoInfo, ISOString } from "./date";


export interface ItemOverrides {
    // variant: "task" | "block";
    // name: string;
    description?: string;
    parentId?: string;
    childOrder?: number;
    tags?: string[];
    doInfo?: DoInfo | null;

    color?: string;
    icon?: string;

    priority?: number; // 1-3?
    checked?: boolean;
    checkedAt?: ISOString | null;

    // sync metadata
    /*deletedAt: ISOString | null;
    updatedAt: ISOString;
    createdAt: ISOString;
    deviceId: string;

    dirty: boolean;*/
}

// DEPENDENT ON REMOTE SCHEMA (run supabase gen types upon schema change)
export type RemoteException = Tables<'exceptions'>; /*Database['public']['Tables']['exceptions']['Row']*/

export interface RecurrenceException {
    id: string;
    itemId: string;
    effectDate: DateString;
    occurrenceIndex: number;
    variant: "modified" | "deleted";
    // add recurrence/multiple dates sometime
    overrides: ItemOverrides;

    deletedAt: ISOString | null;
    updatedAt: ISOString;
    createdAt: ISOString;
    deviceId: string;
    userId: string;

    dirty: boolean;
}

/*
// NON-DEPENDENT ON REMOTE SCHEMA

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
    overrides?: Json;

    deleted_at?: ISOString;
    updated_at: ISOString;
    created_at: ISOString;
    device_id: string;
    user_id: string;
}*/