import { Task } from '@/types'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, onCompleteTask, withDate=true }: {
    tasks: Task[],
    onCompleteTask: (id: string) => void,
    withDate: boolean,
}) => (
    <ul className="flex flex-col gap-3">
      {tasks.map(task => (
            <TaskItem
              key={task.id} 
              task={task}
              onComplete={onCompleteTask} 
              withDate={withDate}
            />
      ))}
    </ul>
);

export default TaskList