import { useTasks } from '@/features/tasks/context/TaskContext';
import TaskList from '@/features/tasks/TaskList';

const TodoView = () => {
  const { tasks, toggleChecked } = useTasks();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
        <div className="flex flex-col font-dongle">
          <h2>Todo</h2>
          <div className="font-dongle font-bold text-2xl">things to do</div>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl overflow-y-auto">
        <TaskList
            tasks={tasks}
            onCompleteTask={toggleChecked} 
            withDate={true}
          />
        </div>
    </div>
  )
}

export default TodoView