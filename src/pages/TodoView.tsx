import { useScheduleItems } from '@/context/ScheduleItemContext';
import CreateTaskBlock from '@/components/schedule-items/tasks/CreateTaskBlock';
import ItemList from '@/components/schedule-items/ItemList';
import { defaultTask } from '@/utils/constants';

const TodoView = () => {
  const { rootItems, createTask, toggleChecked } = useScheduleItems();

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
            items={rootItems}
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