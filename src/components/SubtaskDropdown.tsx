import { Task } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import TaskList from "./tasks/TaskList";

const SubtaskDropdown = ({ subtasks, isExpanded, onExpand, onCompleteSubtask }: {
    subtasks: Task[],
    isExpanded: boolean,
    onExpand: () => void,
    onCompleteSubtask: (id: string) => void
}) => {
    return (
        <div>
            {/* subtask list */}
            { isExpanded &&
                <TaskList
                    tasks={subtasks}
                    onCompleteTask={onCompleteSubtask}
                    withDate={true}
                    isSubtask={true}
                />
            }
            
            {/* expand button */}
            <button
                className="flex flex-row w-full p-3 py-2 text-xs justify-between"
                onClick={onExpand}
            >
                <div>
                    <p>0/{subtasks.length}</p>
                </div>
                <div>
                    {isExpanded ? (
                        <ChevronUp 
                            className="size-4"
                            strokeWidth={2} 
                        />
                    ) : (
                        <ChevronDown 
                            className="size-4"
                            strokeWidth={2} 
                        />
                    )}
                </div>
            </button>
        </div>
    );
};

export default SubtaskDropdown;