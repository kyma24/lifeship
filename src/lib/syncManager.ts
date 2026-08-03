import { debouncedSync, runSync } from "@/utils/backend/sync";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";

let channel: RealtimeChannel | null = null;

export const startRealtimeSync = (userId: string) => {
    if(channel) return;
    channel = supabase
        .channel("items-updates")
        .on(
            "postgres_changes",
            {
                event: '*',
                schema: "public",
                table: "items",
                filter: `user_id=eq.${userId}`
            },
            () => {
                debouncedSync();
            }
        )
        .subscribe();
};

export const stopRealtimeSync = () => {
    if(channel) {
        supabase.removeChannel(channel);
        channel=null;
    }
}

let initialized = false;

export const initSyncManager = () => {
    if(initialized) return;
    initialized=true;
    
    // network connect
    window.addEventListener("online", () => runSync());

    // on app startup
    runSync();

    // periodically (fallback)
    setInterval(() => runSync(), 60_000);

    // on remote update
    supabase.auth.onAuthStateChange((event, session) => {
        if(event === "SIGNED_IN" && session?.user) {
            startRealtimeSync(session.user.id);
        }
        if(event === "SIGNED_OUT") {
            stopRealtimeSync();
        }
    });
}