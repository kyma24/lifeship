import useCurrentDate from '@/hooks/useCurrentDate';
import { toDateStr, toMonthDayFormat, toWeekdayFormat } from '@/utils/dateUtils';
import TaskList from '@/components/tasks/TaskList';
import { useTasks } from '@/context/TaskContext';
import { PartialTask } from '@/types';
import CreateTaskBlock from '@/components/tasks/CreateTaskBlock';
import useDayTasks from '@/hooks/useDayTasks';

const defaultTodayTask: PartialTask = {
  name: "",
  parentId: "",
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

    const { dayTasks } = useDayTasks(date);

    const { createTask, toggleChecked } = useTasks();

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
                <div className="flex flex-col font-dongle">
                <h2>{toWeekdayFormat(date)}</h2>
                <div className="font-dongle font-bold text-2xl">{toMonthDayFormat(date)}</div>
                </div>
            </div>
            <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
                <TaskList
                    tasks={dayTasks}
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