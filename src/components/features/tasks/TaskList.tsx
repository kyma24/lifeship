import { PartialTask, Task } from '@/types'
import TaskItem from './TaskItem'
import CreateTaskBlock from './CreateTaskBlock'

const TaskList = ({ tasks, onCompleteTask, withDate=true, defaultTask }: {
    tasks: Task[],
    onCompleteTask: (id: string) => void,
    withDate: boolean,
    defaultTask: PartialTask
}) => (
    <ul className="flex flex-col p-3 gap-3">
      {tasks.map(task => (
            <TaskItem
              key={task.id} 
              task={task}
              onComplete={onCompleteTask} 
              withDate={withDate}
            />
      ))}
      <CreateTaskBlock 
        defaultTask={defaultTask} 
      />
    </ul>
);

export default TaskList