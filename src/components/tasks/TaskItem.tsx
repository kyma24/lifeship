import CheckButton from "@/components/buttons/CheckButton";
import Divider from "@/components/Divider";
import SubtaskDropdown from "@/components/SubtaskDropdown";
import useSubtasks from "@/hooks/useSubtasks";
import { Task } from "@/types";
import { addDurationTPFormatted, formatTimePeriod } from "@/utils/dateUtils";
import { Repeat } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskItem = ({ task, onComplete, withDate }: {
    task: Task,
    onComplete: (id: string) => void,
    withDate: boolean
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { subtasks } = useSubtasks(task.id);

    const navigate = useNavigate();

    const handleTaskClick = () => {
        navigate(`/task/${task.id}`);
    }

    const handleSubtasksExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <li className="flex flex-col w-full bg-gray-900 border-gray-800 border rounded-2xl">
            <div
                className="flex flex-row items-center w-full h-15 p-3 gap-3"
                onClick={handleTaskClick}
            >
                <div className={`h-full aspect-square rounded-full transition duration-300 ${task.checked ? "bg-gray-500" : "bg-gray-300"}`} />
                <div className="flex flex-col text-left justify-center leading-tight">
                    <p className={`font-bold text-ellipsis transition duration-300 ${task.checked ? "line-through" : "no-underline text-[#f3f4f6]"}`}>{task.name}</p>
                    {task.doDate?.date ? (
                        <div className="flex flex-row items-center gap-2">
                            <p>
                                {withDate && task.doDate.date} {" "}
                                {task.doDate.timePeriod ? (
                                    <>
                                        {formatTimePeriod(task.doDate.timePeriod)} {" "}
                                        {(task.doDate.timePeriod.type === "exact") ? (
                                            (task.doDate.duration) && `→ ${addDurationTPFormatted(task.doDate.timePeriod, task.doDate.duration)}`
                                        ) : (
                                            <p>{task.doDate.timePeriod.timeOfDay}: {task.doDate.duration}m</p>
                                        )}
                                    </>
                                ) : ("")}
                            </p>
                            {task.doDate.recurrence && <Repeat className="size-4" strokeWidth={2} />}
                        </div>
                    ) : (
                        ((task.doDate?.duration ?? 0) > 0) && (<p>{task.doDate?.duration}m</p>)
                    )}
                </div>
                <CheckButton
                    checked={task.checked ?? false} 
                    onChange={(e) => {
                        e.stopPropagation();
                        onComplete(task.id);
                    }} 
                    styles="ml-auto"
                />
            </div>
            { (subtasks && (subtasks.length > 0)) && 
                <>
                    <Divider />
                    <SubtaskDropdown
                        subtasks={subtasks}
                        isExpanded={isExpanded}
                        onExpand={handleSubtasksExpand}
                        onCompleteSubtask={onComplete}
                    />
                </>
            }
        </li>
    );
}

export default TaskItem;