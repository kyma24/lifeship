import { Task } from '@/types'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, onCompleteTask, withDate=true, isSubtask=false }: {
    tasks: Task[],
    onCompleteTask: (id: string) => void,
    withDate: boolean,
    isSubtask?: boolean
}) => (
    <ul className={`
      flex flex-col 
      ${isSubtask ? "" : "gap-3"}
    `}>
      {tasks.map(task => (
            <TaskItem
              key={task.id} 
              task={task}
              onComplete={onCompleteTask} 
              withDate={withDate}
              isSubtask={isSubtask}
            />
      ))}
    </ul>
);

export default TaskList