import { useTasks } from '@/components/features/tasks/context/TaskContext';
import CreateTaskBlock from '@/components/features/tasks/CreateTaskBlock';
import TaskList from '@/components/features/tasks/TaskList';
import { PartialTask } from '@/types';

const defaultTask: PartialTask = {
  name: "",
  description: "",
  tags: [],
  doDate: null,
  checked: false
}

const TodoView = () => {
  const { tasks, createTask, toggleChecked } = useTasks();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="sticky top-0 z-50 flex flex-row w-full justify-center align-center">
        <div className="flex flex-col font-dongle">
          <h2>Todo</h2>
          <div className="font-dongle font-bold text-2xl">things to do</div>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-3xl overflow-y-auto p-3 gap-3">
        <TaskList
            tasks={tasks}
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