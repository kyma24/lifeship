import CompleteButton from '@/components/CompleteButton';
import { toDate, getTime, addDuration, formatDate } from '@/utils/dateUtils'
import { Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

const TaskItem = ({ task, onComplete, withDate }) => {
    const navigate = useNavigate();

    const handleTaskClick = () => {
        navigate(`/task/${task.id}`);
    }

    return (
        <li
            className="flex flex-row items-center w-full h-15 p-3 gap-3 bg-gray-900 border-gray-800 border rounded-2xl"
            onClick={handleTaskClick}
        >
            <div className={`h-full aspect-square rounded-full transition duration-300 ${task.completed ? "bg-gray-500" : "bg-gray-300"}`} />
            <div className="flex flex-col text-left justify-center leading-tight">
                <p className={`font-bold text-ellipsis transition duration-300 ${task.completed ? "line-through" : "no-underline text-[#f3f4f6]"}`}>{task.name}</p>
                {task.startTime ? (
                    <div className="flex flex-row items-center gap-2">
                        <p>
                            {withDate && formatDate(toDate(task.startTime))} {" "}
                            {getTime(toDate(task.startTime))} {" "}
                            {(task.duration > 0) && `→ ${getTime(addDuration(toDate(task.startTime), task.duration))}`}
                        </p>
                        {task.recurrence && <Repeat className="size-4" strokeWidth={2} />}
                    </div>
                ) : (
                    (task.duration > 0) && (<p>{task.duration}m</p>)
                )}
            </div>
            <CompleteButton
                completed={task.completed} 
                onChange={(e) => {
                    e.stopPropagation();
                    onComplete(task);
                }} 
                styles="ml-auto"
            />
        </li>
    )
}

export default TaskItem