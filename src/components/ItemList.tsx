import { ScheduleItem } from '@/types'
import TaskItem from './tasks/TaskItem'

const ItemList = ({ tasks, onCompleteTask, withDate=true, isSubtask=false }: {
    tasks: ScheduleItem[],
    onCompleteTask: (id: string) => void,
    withDate: boolean,
    isSubtask?: boolean
}) => (
    <ul className={`
      flex flex-col 
      ${isSubtask ? "" : "gap-3"}
    `}>
      {tasks.map(task => {
        if(task.variant === "block") return (<></>);
        return (
          <TaskItem
            key={task.id} 
            task={task}
            onComplete={onCompleteTask} 
            withDate={withDate}
            isSubtask={isSubtask}
          />
        );
      })}
    </ul>
);

export default ItemList