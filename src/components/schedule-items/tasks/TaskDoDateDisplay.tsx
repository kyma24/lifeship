import { DoInfo } from "@/types";
import { addDurationTPFormatted, formatDateString, formatTimePeriod } from "@/utils/dateUtils";
import { Repeat } from "lucide-react";

const TaskDoDateDisplay = ({doDate, withDate}: {
    doDate: DoInfo, 
    withDate: boolean
}) => {
    const { date, timePeriod, duration, timezone, recurrence } = doDate;

    if(date) {
        return (
            <div className="flex flex-row items-center gap-2">
                <p>
                    {withDate && `${formatDateString(date)} `}

                    {timePeriod &&
                        <>
                            {formatTimePeriod(timePeriod)} {" "}
                            {(timePeriod.type === "exact") ? (
                                (duration) && `→ ${addDurationTPFormatted(timePeriod, duration)}`
                            ) : (
                                <p>(duration) && {`${duration}m`}</p>
                            )}
                        </>
                    }
                </p>
                {recurrence && <Repeat className="size-4" strokeWidth={2} />}
            </div>
        );
    }
    
    return ((duration ?? 0) > 0) && (<p>{duration}m</p>);
};

export default TaskDoDateDisplay;