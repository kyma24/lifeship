import Captcha from "@/components/Captcha";
import { signIn, signInAnon } from "@/utils/backend/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRef, useState } from "react"

export const LoginScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [captchaToken, setCaptchaToken] = useState<string>("");
    const captchaRef = useRef(null);

    const [status, setStatus] = useState<"idle"|"processing"|"success"|"error">("idle");
    const [error, setError] = useState<AuthError | null>(null);

    const resetCaptchaToken = () => {
        setCaptchaToken("");
    }

    const handleSetCaptchaToken = (token: string) => {
        setCaptchaToken(token);
    }

    const handleLogin = async () => {
        setStatus("processing");
        const { data, error } = await signIn(email, password, captchaToken);
        resetCaptchaToken();
        setStatus(error ? "error" : "success");
        setError(error);
    }

    const handleAnonLogin = async () => {
        setStatus("processing");
        const { data, error } = await signInAnon(captchaToken);
        resetCaptchaToken();
        setStatus(error ? "error" : "success");
        setError(error);
    }

    const bg = "w-full h-full flex justify-center items-center";

    switch (status) {
        case "idle":
            return (
                <div className={bg}>
                    <div className="w-fit h-fit p-8 flex flex-col gap-4 bg-gray-800 rounded-xl">
                        <h2 className="w-full text-center">
                            Sign In
                        </h2>

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

                        <Captcha
                            captchaRef={captchaRef}
                            onSetCaptchaToken={handleSetCaptchaToken}
                        />

                        <button onClick={handleLogin}>
                            Sign in
                        </button>

                        <button onClick={handleAnonLogin}>
                            Enter as Guest
                        </button>
                    </div>
                </div>
            );
        case "processing":
            return (
                <div className={bg}>
                    <p>Processing...</p>
                </div>
            );
        case "success":
            return (
                <div className={bg}>
                    <p>Logged in successfully</p>
                </div>
            );
        case "error":
            return (
                <div className={bg}>
                    <p>Error: {error?.message}, reload to reset</p>
                </div>
            );
        default:
            return <></>;
    }
}