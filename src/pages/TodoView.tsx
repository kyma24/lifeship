import { useScheduleItems } from '@/context/ScheduleItemContext';
import CreateTaskBlock from '@/components/tasks/CreateTaskBlock';
import ItemList from '@/components/ItemList';
import { PartialTask } from '@/types';
import { defaultTask } from '@/utils/taskUtils';

const TodoView = () => {
  const { rootTasks, createTask, toggleChecked } = useScheduleItems();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
        <div className="flex flex-col font-dongle">
          <h2>Todo</h2>
          <div className="font-dongle font-bold text-2xl">things to do</div>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
        <ItemList
            items={rootTasks}
            onCompleteTask={toggleChecked} 
            withDate={true}
          />
        <CreateTaskBlock 
            defaultTask={defaultTask} 
            onCreateTask={createTask}
        />
        </div>
    </div>
  )
}

export default TodoView