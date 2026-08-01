import { DoInfo } from "@/types";
import { addDurationTPFormatted, formatDateString, formatTimePeriod } from "@/utils/dateUtils";
import { Repeat } from "lucide-react";

const TaskDoDateDisplay = ({doInfo, withDate}: {
    doInfo: DoInfo, 
    withDate: boolean
}) => {
    const { date, timePeriod, duration, timezone, recurrence } = doInfo;

    if(date) {
        return (
            <div className="flex flex-row items-center gap-2">
                <div>
                    {withDate && `${formatDateString(date)} `}

                    {timePeriod &&
                        <>
                            {formatTimePeriod(timePeriod)} {" "}
                            {(timePeriod.type === "exact") ? (
                                (duration) ? `→ ${addDurationTPFormatted(timePeriod, duration)}` : ""
                            ) : (
                                (duration) ? <p>{`${duration}m`}</p> : ""
                            )}
                        </>
                    }
                </div>
                {recurrence && <Repeat className="size-4" strokeWidth={2} />}
            </div>
        );
    }
    
    return ((duration ?? 0) > 0) && (<p>{duration}m</p>);
};

export default TaskDoDateDisplay;