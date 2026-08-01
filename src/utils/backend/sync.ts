import { db, pullChangesAPI, pushChangesAPI } from "@/db"
import { nowISO } from "../dateUtils";

export const getLastSyncedAt = async (): Promise<string> => {
    const state = await db.syncState.get("lastSyncedAt");
    return state?.value ?? new Date(0).toISOString();
}

export const setLastSyncedAt = async (timestamp: string) => {
    await db.syncState.put({ key: "lastSyncedAt", value: timestamp });
}

const sync = async () => {
    const lastSyncedAt = await getLastSyncedAt();
    await pushChangesAPI();
    await pullChangesAPI(lastSyncedAt);
    await setLastSyncedAt(nowISO());
}

let syncInFlight = false;
export const runSync = async () => {
    if(syncInFlight) return;
    syncInFlight = true;
    try {
        await sync();
    } finally {
        syncInFlight=false;
    }
}

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
    let timeoutId: number;
    return ((...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
}

export const debouncedSync = debounce(() => runSync(), 1500);