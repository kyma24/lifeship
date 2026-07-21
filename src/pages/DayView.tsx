import useCurrentDate from '@/hooks/useCurrentDate';
import { toMonthDayFormat, toWeekdayFormat } from '@/utils/dateUtils';
import TaskList from '@/features/tasks/TaskList';
import { useTasks } from '@/features/tasks/context/TaskContext.tsx';
import useWeekTasks from '@/hooks/useWeekTasks';

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
            />
            </div>
        ) : (
            <div>no tasks today</div>
        )}
        </div>
    );
}

export default DayView;