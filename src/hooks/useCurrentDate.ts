import { useEffect, useState } from "react";
import { toDateStr } from "../utils/dateUtils";
import { DateString } from "@/types";

function useCurrentDate(): DateString {
    const [today, setToday] = useState<DateString>(toDateStr(new Date(), ""));

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