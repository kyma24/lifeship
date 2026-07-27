import CheckButton from "@/components/buttons/CheckButton";
import Divider from "@/components/Divider";
import SubtaskDropdown from "@/components/schedule-items/SubtaskDropdown";
import useSubtaskCompletion from "@/hooks/useSubtaskCompletion";
import useSubtasks from "@/hooks/useSubtasks";
import { Task } from "@/types";
import { addDurationTPFormatted, formatTimePeriod } from "@/utils/dateUtils";
import { Repeat, Workflow } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskDoDateDisplay from "./TaskDoDateDisplay";

const TaskItem = ({ task, onComplete, withDate, isSubtask }: {
    task: Task,
    onComplete: (id: string) => void,
    withDate: boolean,
    isSubtask: boolean
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { subtasks } = useSubtasks(task.id);
    const checkedSubtaskCount = useSubtaskCompletion(task.id);

    const navigate = useNavigate();

    const handleTaskClick = () => {
        navigate(`/task/${task.id}`);
    }

    const handleSubtasksExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <li className={`
            flex flex-col w-full 
            ${isSubtask
                ? ""
                : "bg-gray-900 border-gray-800 border rounded-2xl"
            }
        `}>
            <div
                className="flex flex-row items-center w-full h-15 p-3 gap-3"
                onClick={handleTaskClick}
            >
                <div className={`
                    h-full aspect-square rounded-full transition duration-300 
                    ${task.checked 
                        ? (isSubtask ? "bg-gray-800" : "bg-gray-500")
                        : (isSubtask ? "bg-gray-700" :"bg-gray-300")
                    }
                `} />
                <div className="flex flex-col text-left justify-center leading-tight">
                    <p className={`font-bold text-ellipsis transition duration-300 
                        ${task.checked ? "line-through" : "no-underline text-[#f3f4f6]"}
                    `}>
                        {task.name}
                    </p>

                    <div className="flex flex-row gap-2">
                        {/* subtask count */}
                        { (isSubtask && subtasks && (subtasks.length > 0)) &&
                            <div className="flex flex-row gap-0.5 items-center">
                                <Workflow className="size-4" strokeWidth={2} />
                                <p className="text-sm">{checkedSubtaskCount}/{subtasks.length}</p>
                            </div>
                        }
                        
                        { task.doDate && 
                            <TaskDoDateDisplay 
                                doDate={task.doDate}
                                withDate={withDate}
                            />
                        }
                    </div>
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
            { (!isSubtask && subtasks && (subtasks.length > 0)) && 
                <>
                    <Divider />
                    <SubtaskDropdown
                        subtasks={subtasks}
                        checkedCount={checkedSubtaskCount ?? 0}
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