import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export async function ensureAuthenticated() {
    const { data: { session }} = await supabase.auth.getSession();
    if(!session) {
        await supabase.auth.signInAnonymously();
    }
}