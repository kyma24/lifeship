import TaskItem from './TaskItem'

const TaskList = ({ tasks, onCompleteTask, withDate=true }) => {
  if(tasks.length === 0) return <div>no tasks</div>
  
  return (
    <ul className="flex flex-col p-3 gap-3">
      {tasks.map(task => (
          <TaskItem
            key={task.id} 
            task={task}
            onComplete={onCompleteTask} 
            withDate={withDate}
          />
      ))}
    </ul>
  )
}

export default TaskList