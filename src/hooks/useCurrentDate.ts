import { useEffect, useState } from "react";
import { toDateStr } from "../utils/dateUtils";
import { DateString } from "@/types";
import { processCheckedAPI } from "@/db";

function useCurrentDate(): DateString {
    const [today, setToday] = useState<DateString>(toDateStr(new Date(), ""));

    useEffect(() => {
        const update = () => {
            const newDateStr = toDateStr(new Date(), "")
            if(newDateStr !== today) setToday(newDateStr);
        };

        document.addEventListener("visibilitychange", () => {
            if(document.visibilityState === "visible") update();
        });
        window.addEventListener("focus", update);

        return () => {
            document.removeEventListener("visibilitychange", update);
            window.removeEventListener("focus", update);
        }
    }, []);

    useEffect(() => {
        processCheckedAPI(today);
    }, [today]);

    return today;
}

export default useCurrentDate;