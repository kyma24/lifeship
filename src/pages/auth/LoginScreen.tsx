import { signIn, signInAnon } from "@/utils/backend/auth";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react"

export const LoginScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [status, setStatus] = useState<"idle"|"processing"|"success"|"error">("idle");
    const [error, setError] = useState<AuthError | null>(null);

    const handleLogin = async () => {
        setStatus("processing");
        const { data, error } = await signIn(email, password);
        setStatus(error ? "error" : "success");
        setError(error);
    }

    const handleAnonLogin = async () => {
        setStatus("processing");
        const { data, error } = await signInAnon();
        setStatus(error ? "error" : "success");
        setError(error);
    }

    switch (status) {
        case "idle":
            return (
                <div className="flex flex-col gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@lifeship.com"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="pswd123"
                    />
                    <button onClick={handleLogin}>
                        Sign in
                    </button>

                    <button onClick={handleAnonLogin}>
                        Enter as Guest
                    </button>
                </div>
            );
        case "processing":
            return (
                <p>Processing...</p>
            );
        case "success":
            return (
                <p>Logged in successfully</p>
            );
        case "error":
            return (
                <p>Error: {error?.message}, reload to reset</p>
            );
        default:
            return <></>;
    }
}