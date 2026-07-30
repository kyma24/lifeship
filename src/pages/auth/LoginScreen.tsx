import { signInWithEmail } from "@/utils/backend/auth";
import { useState } from "react"

export const LoginScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

    const handleSubmit = async () => {
        setStatus("sending");
        const { error } = await signInWithEmail(email);
        setStatus(error ? "error" : "sent");
    }

    switch (status) {
        case "idle":
            return (
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@lifeship.com"
                    />
                    <button onClick={handleSubmit}>
                        Send login link
                    </button>
                </div>
            );
        case "sending":
            return (
                <p>Sending...</p>
            );
        case "sent":
            return (
                <p>Check email for sign-in link</p>
            );
        case "error":
            return (
                <p>Error</p>
            );
        default:
            return <></>;
    }
}