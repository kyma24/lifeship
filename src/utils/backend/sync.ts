import { db, pullChangesAPI, pushChangesAPI } from "@/db"
import { nowISO } from "../dateUtils";

const getLastSyncedAt = async (): Promise<string> => {
    const state = await db.syncState.get("lastSyncedAt");
    return state?.value ?? new Date(0).toISOString();
}

const setLastSyncedAt = async (timestamp: string) => {
    await db.syncState.put({ key: "lastSyncedAt", value: timestamp });
}

export const sync = async () => {
    const lastSyncedAt = await getLastSyncedAt();
    await pushChangesAPI();
    await pullChangesAPI(lastSyncedAt);
    await setLastSyncedAt(nowISO());
}

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
    let timeoutId: number;
    return ((...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
}

export const debouncedSync = debounce(() => sync(), 1500);