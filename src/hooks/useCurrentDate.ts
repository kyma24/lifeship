import { useEffect, useState } from "react";
import { toDateStr } from "../utils/dateUtils";

function useCurrentDate(): string {
    const [today, setToday] = useState<string>(toDateStr(new Date(), ""));

    useEffect(() => {
        const update = () => setToday(toDateStr(new Date(), ""));

        document.addEventListener("visibilitychange", () => {
            if(document.visibilityState === "visible") update();
        });
        window.addEventListener("focus", update);

        return () => {
            document.removeEventListener("visibilitychange", update);
            window.removeEventListener("focus", update);
        }
    }, []);

    return today;
}

export default useCurrentDate;