import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if(event === "SIGNED_IN" && session) {
                navigate('/', { replace: true });
            }
        });
    }, [navigate]);

    return <p>Signing in...</p>
}