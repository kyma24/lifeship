import { ScheduleItem } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemList from "./ItemList";

const SubtaskDropdown = ({ subtasks, checkedCount, isExpanded, onExpand, onCompleteSubtask }: {
    subtasks: ScheduleItem[],
    checkedCount: number,
    isExpanded: boolean,
    onExpand: () => void,
    onCompleteSubtask: (id: string) => void
}) => {
    return (
        <div>
            {/* subtask list */}
            { isExpanded &&
                <ItemList
                    items={subtasks}
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
                    <p>{checkedCount}/{subtasks.length}</p>
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