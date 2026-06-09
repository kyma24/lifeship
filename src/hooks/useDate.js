import { useEffect, useState } from "react"

const useDate = (interval = 60_000) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const update = () => setNow(new Date());
        
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") update();
        });
        window.addEventListener("focus", update);

        return () => {
            document.removeEventListener("visibilitychange", update);
            window.removeEventListener("focus", update);
        }
    }, []);

    return now;
}

export default useDate