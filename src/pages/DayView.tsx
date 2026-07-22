import useCurrentDate from '@/hooks/useCurrentDate';
import { toDateStr, toMonthDayFormat, toWeekdayFormat } from '@/utils/dateUtils';
import TaskList from '@/components/features/tasks/TaskList';
import { useTasks } from '@/components/features/tasks/context/TaskContext';
import useWeekTasks from '@/hooks/useWeekTasks';
import { PartialTask } from '@/types';

const defaultTodayTask: PartialTask = {
  name: "",
  description: "",
  tags: [],
  doDate: {
    date: toDateStr(new Date()),
    timePeriod: null,
    duration: null,
    timezone: null,
    recurrence: null
  },
  checked: false
}

const DayView = () => {
    const date = useCurrentDate();

    const { tasksByDay } = useWeekTasks(date);
    const todayTasks = tasksByDay.get(date);

    const { toggleChecked } = useTasks();

    return (
        <div className="flex flex-col justify-center items-center">
        <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
            <div className="flex flex-col font-dongle">
            <h2>{toWeekdayFormat(date)}</h2>
            <div className="font-dongle font-bold text-2xl">{toMonthDayFormat(date)}</div>
            </div>
        </div>
        {todayTasks ? (
            <div className="flex flex-col w-full max-w-3xl overflow-y-auto">
            <TaskList
                tasks={todayTasks}
                onCompleteTask={toggleChecked} 
                withDate={false}
                defaultTask={defaultTodayTask}
            />
            </div>
        ) : (
            <div>no tasks today</div>
        )}
        </div>
    );
}

export default DayView;