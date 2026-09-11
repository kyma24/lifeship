import { supabase } from "../../lib/supabase"

/*const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
    });
    return { error };
};*/

export const signInAnon = async (captchaToken: string) => {
    const { data, error } = await supabase.auth.signInAnonymously({
        options: { captchaToken }
    });
    return { data, error };
}

export const signIn = async (email: string, password: string, captchaToken: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken }
    });

    return { data, error };
};

export const signOut = async () => {
    await supabase.auth.signOut();
}

export const onAuthChange = (callback: (userId: string | null) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user?.id ?? null);
    });
}

export const getCurrentUserId = async (): Promise<string | null> => {
    const { data: { session }} = await supabase.auth.getSession();
    return session?.user?.id ?? null;
}