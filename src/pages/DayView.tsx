import useCurrentDate from '@/hooks/useCurrentDate';
import { getTodayString, toMonthDayFormat, toWeekdayFormat } from '@/utils/dateUtils';
import ItemList from '@/components/schedule-items/ItemList';
import { useScheduleItems } from '@/context/ScheduleItemContext';
import { PartialTask } from '@/types';
import CreateTaskBlock from '@/components/schedule-items/tasks/CreateTaskBlock';
import useDayTasks from '@/hooks/useDayTasks';
import { defaultTask } from '@/utils/constants';

const defaultTodayTask: PartialTask = {...defaultTask, 
  doInfo: {
    date: getTodayString(),
    timePeriod: null,
    duration: null,
    timezone: null,
    recurrence: null
  }
};

const DayView = () => {
    const date = useCurrentDate();

    const { dayTasks } = useDayTasks(date);

    const { createTask, toggleChecked } = useScheduleItems();

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
                <div className="flex flex-col font-dongle">
                    <h2>{toWeekdayFormat(date)}</h2>
                    <div className="font-dongle font-bold text-2xl">{toMonthDayFormat(date)}</div>
                </div>
            </div>
            <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
                <ItemList
                    items={dayTasks}
                    onCompleteTask={toggleChecked} 
                    withDate={false}
                />
                <CreateTaskBlock 
                    defaultTask={defaultTodayTask} 
                    onCreateTask={createTask}
                />
            </div>
        </div>
    );
}

export default DayView;