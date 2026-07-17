import React, { useEffect, useState } from 'react'
import useCurrentDate from '@/hooks/useCurrentDate';
import { getDay, getMonth, getStartOfDay, getWeekday, toMs } from '@/utils/dateUtils';
import TaskList from '@/features/tasks/TaskList';
import { useTasks } from '@/features/tasks/context/TaskContext';
import useWeekTasks from '@/hooks/useWeekTasks';

const DayView = () => {
  const date = useCurrentDate();
  const msDate = toMs(getStartOfDay(date));

  const { tasksByDay } = useWeekTasks(date);
  const todayTasks = tasksByDay[msDate];

  const { toggleCompleted } = useTasks();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
        <div className="flex flex-col font-dongle">
          <h2>{getWeekday(date)}</h2>
          <div className="font-dongle font-bold text-2xl">{getMonth(date)} {getDay(date)}</div>
        </div>
      </div>
      {todayTasks ? (
        <div className="flex flex-col w-full max-w-3xl overflow-y-auto">
          <TaskList
            tasks={todayTasks}
            onCompleteTask={toggleCompleted} 
            withDate={false}
          />
        </div>
      ) : (
        <div>no tasks today</div>
      )}
    </div>
  )
}

export default DayView