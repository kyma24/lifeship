import { sync } from "@/utils/backend/sync";

let initialized = false;

export const initSyncManager = () => {
    if(initialized) return;
    initialized=true;
    
    // network connect
    window.addEventListener("online", () => sync());

    // on app startup
    sync();

    console.log("synced");
}