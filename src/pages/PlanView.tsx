import Bucket from "@/components/buckets/Bucket";
import CreateItemBlock from "@/components/schedule-items/CreateItemBlock";
import ItemList from "@/components/schedule-items/ItemList";
import { useScheduleItems } from "@/context/ScheduleItemContext";
import useCurrentDate from "@/hooks/useCurrentDate";
import useWeekTasks from "@/hooks/useWeekTasks";
import { DateString, DayItemBuckets, PartialScheduleItem } from "@/types";
import { defaultDayItemBuckets, weekdays } from "@/utils/constants";
import { getBackOneWeekStr, getDayComponent, getForwardOneWeekStr, getFullWeekStrs, getMonthComponent, getYearComponent, isValidDateString, toMonthDayFormat, toWeekdayFormat } from "@/utils/dateUtils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PlanView = () => {
    const today = useCurrentDate();
    const [isDayView, setIsDayView] = useState<boolean>(true);

    const navigate = useNavigate();

    const params = useParams();
    const tempDate = params.date;
    const displayDate = (tempDate && isValidDateString(tempDate)) ? (tempDate as DateString) : today;

    const fullWeekDates = useMemo(() => 
        getFullWeekStrs(displayDate)
    , [displayDate]);

    const fullWeekSchedule = useWeekTasks(displayDate);

    const handleDisplayDateChange = (date: DateString) => {
        if(date < today) return;
        navigate(`/plan/${date}`);
    };

    return (
      <div className="flex flex-col justify-center items-center">
        {/* header */}
        <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
            <div className="flex flex-col font-dongle">
                <h2>
                    {toWeekdayFormat(displayDate)}
                </h2>
                <div className="font-dongle font-bold text-2xl">
                    {toMonthDayFormat(displayDate)}
                </div>
            </div>
        </div>

        { isDayView
            ? (
                <DayView 
                    today={today}
                    displayDate={displayDate}
                    fullWeekDates={fullWeekDates}
                    fullDaySchedule={fullWeekSchedule[displayDate] ?? defaultDayItemBuckets}
                    onChangeDate={handleDisplayDateChange}
                />
            ) : (
                /*<WeekView 
                    today={today}
                    displayDate={displayDate}
                    fullWeekDates={fullWeekDates}
                />*/
                <></>
            )
        }
      </div>
    );
};

const DayView = ({ today, displayDate, fullWeekDates, fullDaySchedule, onChangeDate }: {
    today: DateString,
    displayDate: DateString,
    fullWeekDates: DateString[],
    fullDaySchedule: DayItemBuckets,
    onChangeDate: (date: DateString) => void
}) => {
    const [isOverdueExpanded, setIsOverdueExpanded] = useState<boolean>(true);
    const [isAnyTimeExpanded, setIsAnyTimeExpanded] = useState<boolean>(true);
    const [isScheduledExpanded, setIsScheduledExpanded] = useState<boolean>(true);
    const [isCompletedExpanded, setIsCompletedExpanded] = useState<boolean>(true);

    const [isAnyTimeCreating, setIsAnyTimeCreating] = useState<boolean>(false);
    const [isScheduledCreating, setIsScheduledCreating] = useState<boolean>(false);

    const { createTask, createBlock, toggleChecked } = useScheduleItems();

    const handleCreateItem = (draftItem: PartialScheduleItem) => {
        if(draftItem.variant === "task") createTask(draftItem);
        if(draftItem.variant === "block") createBlock(draftItem);
    }

    const handleChangeDate = (date: DateString) => {
        onChangeDate(date);
        setIsAnyTimeCreating(false);
        setIsScheduledCreating(false);
    }

    const handleToggleChecked = (id: string) => {
        toggleChecked(id, displayDate);
    }

    return (
        <>
            {/* week nav */}
            <WeekSelector
                today={today}
                displayDate={displayDate}
                fullWeekDates={fullWeekDates}
                onChangeDate={handleChangeDate}
            />

            {/* scheduling */}
            <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-6">
                { ((displayDate === today) && (fullDaySchedule.overdue.length > 0)) &&
                    <Bucket
                        name={`overdue (${fullDaySchedule.overdue.length})`}
                        isExpanded={isOverdueExpanded}
                        onExpandToggle={() => setIsOverdueExpanded(!isOverdueExpanded)}
                    >
                        <ItemList
                            items={fullDaySchedule.overdue}
                            onCompleteTask={handleToggleChecked} 
                            withDate={true}
                        />
                    </Bucket>
                }

                <Bucket
                    name={`any time (${fullDaySchedule.unsorted.length})`}
                    isExpanded={isAnyTimeExpanded}
                    onExpandToggle={() => setIsAnyTimeExpanded(!isAnyTimeExpanded)}
                    className="flex flex-col gap-2"
                >
                    { (fullDaySchedule.unsorted.length > 0) &&
                        <ItemList
                            items={fullDaySchedule.unsorted}
                            onCompleteTask={handleToggleChecked} 
                            withDate={false}
                        />
                    }
                    <CreateItemBlock
                        date={displayDate}
                        isCreating={isAnyTimeCreating}
                        onToggleCreating={() => {
                            setIsAnyTimeCreating(!isAnyTimeCreating);
                            setIsScheduledCreating(false);
                        }}
                        onCreateItem={handleCreateItem}
                        isCondensed={true}
                    />
                </Bucket>

                <Bucket
                    name={`scheduled (${fullDaySchedule.scheduled.length})`}
                    isExpanded={isScheduledExpanded}
                    onExpandToggle={() => setIsScheduledExpanded(!isScheduledExpanded)}
                    className="flex flex-col gap-2"
                >
                    { (fullDaySchedule.scheduled.length > 0) &&
                        <ItemList
                            items={fullDaySchedule.scheduled}
                            onCompleteTask={handleToggleChecked} 
                            withDate={false}
                        />
                    }
                    <CreateItemBlock
                        date={displayDate}
                        isCreating={isScheduledCreating}
                        onToggleCreating={() => {
                            setIsAnyTimeCreating(false);
                            setIsScheduledCreating(!isScheduledCreating);
                        }}
                        onCreateItem={handleCreateItem}
                        isCondensed={true}
                    />
                </Bucket>

                { (fullDaySchedule.completed.length > 0) &&
                    <Bucket
                        name={"completed"}
                        isExpanded={isCompletedExpanded}
                        onExpandToggle={() => setIsCompletedExpanded(!isCompletedExpanded)}
                    >
                        <ItemList
                            items={fullDaySchedule.completed}
                            onCompleteTask={handleToggleChecked} 
                            withDate={true}
                        />
                    </Bucket>
                }
            </div>
        </>
    );
};

const WeekSelector = ({ today, displayDate, fullWeekDates, onChangeDate }: {
    today: DateString,
    displayDate: DateString,
    fullWeekDates: DateString[],
    onChangeDate: (date: DateString) => void
}) => {
    const dateStyles = (date: DateString): string => {
        if(date < today) return "text-gray-600";
        if(date === displayDate) return "bg-gray-800 font-bold";
        if(date === today) return "text-indigo-400 font-semibold";
        return "";
    };

    const handleBackToToday = () => {
        onChangeDate(today);
    };

    const handleBackOneWeek = () => {
        const newDate = getBackOneWeekStr(displayDate);

        if(newDate < today) onChangeDate(today);
        else onChangeDate(newDate);
    };

    const handleForwardOneWeek = () => {
        const newDate = getForwardOneWeekStr(displayDate);
        onChangeDate(newDate);
    };

    const handleOpenMonthSelector = () => {
        return;
    };

    return (
        <div className="flex flex-col w-full p-3 gap-3">
            <div className="flex flex-row w-full items-end justify-between">
                {/* calendar selector */}
                <button
                    onClick={handleOpenMonthSelector}
                    className="flex flex-row gap-1 items-center justify-center
                                font-bold bg-gray-800 leading-3 p-3 rounded-full"
                >
                    <p>
                        {getMonthComponent(displayDate)} {getYearComponent(displayDate)}
                    </p>

                    <ChevronDown
                        strokeWidth={3}
                        className="size-4"
                    />
                </button>

                {/* week nav */}
                <div
                    className="flex flex-row gap-2
                        leading-3 p-3 border border-gray-700 rounded-full"
                >
                    <button
                        onClick={handleBackOneWeek}
                    >
                        <ChevronLeft
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>

                    <p className="text-gray-700">|</p>

                    <button
                        onClick={handleBackToToday}
                    >
                        Today
                    </button>

                    <p className="text-gray-700">|</p>

                    <button
                        onClick={handleForwardOneWeek}
                    >
                        <ChevronRight
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>
                </div>
            </div>
            
            {/* weekday selector */}
            <div className="flex flex-row justify-evenly w-full max-w-200">
                { fullWeekDates.map((date, ind) => (
                    <button
                        key={ind}
                        onClick={() => {
                            if (date < today) return;
                            onChangeDate(date);
                        }}
                        className={`flex flex-col w-full h-15 items-center justify-center 
                                ${ dateStyles(date) } 
                                rounded-xl`}
                    >
                        <p className="text-sm leading-4">{weekdays[ind]}</p>
                        <p className="text-xl leading-5">{getDayComponent(date)}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

/*
const WeekView = ({ today, displayDate, fullWeekDates }: {
    today: DateString,
    displayDate: DateString,
    fullWeekDates: DateString[]
}) => {
    return (
        <>
            <div>WeekView</div>
        </>
    );
};
*/

export default PlanView;