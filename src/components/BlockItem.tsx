import { ChevronDown, ChevronUp, SunMedium } from "lucide-react";
import { useState } from "react";
import ItemList from "./ItemList";
import CreateTaskBlock from "./tasks/CreateTaskBlock";
import { defaultTask } from "@/utils/taskUtils";
import { Block, PartialTask } from "@/types";
import { useScheduleItems } from "@/context/ScheduleItemContext";
import useSubtasks from "@/hooks/useSubtasks";

const BlockItem = ({ block }: {
    block: Block
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const { createTask, toggleChecked } = useScheduleItems();

    const { subtasks } = useSubtasks(block.id);

    const handleCreateSubtask = (draft: PartialTask) => {
        createTask({...draft, parentId: block.id});
    }

    return (
        <li className="flex flex-col w-full p-3">
            <div
                className="flex flex-row w-full p-3 pb-0 justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-row gap-3 items-center">
                    {/* icon */}
                    <div>
                        <SunMedium 
                            className="size-6"
                            strokeWidth={2} 
                        />
                    </div>

                    <div className="flex flex-col text-left justify-center leading-tight">
                        {/* title, no. tasks left */}
                        <p className="font-bold">{block.name} ({(subtasks ?? []).length})</p>
                        {/* time */}
                        <p className="text-sm">10:30 - 12:50</p>
                    </div>
                </div>

                {/* caret/expand */}
                <div>
                    {isExpanded ? (
                        <ChevronUp 
                            className="size-6"
                            strokeWidth={2} 
                        />
                    ) : (
                        <ChevronDown
                            className="size-6"
                            strokeWidth={2}
                        />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="flex flex-col w-full gap-3">
                    <ItemList
                        items={subtasks ?? []}
                        onCompleteTask={toggleChecked}
                        withDate={true}
                    />
                    <CreateTaskBlock
                        defaultTask={defaultTask}
                        onCreateTask={handleCreateSubtask}
                    />
                </div>
            )}
        </li>
    );
};

export default BlockItem;