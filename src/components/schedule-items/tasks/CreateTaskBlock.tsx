import { PartialScheduleItem, PartialTask } from "@/types";
import { useState } from "react";
import ExpandedCreateItemBlock from "../ExpandedCreateItemBlock";

const CreateTaskBlock = ({ defaultTask, onCreateTask, isCondensed=false }: {
    defaultTask: PartialTask,
    onCreateTask: (draftTask: PartialTask) => void,
    isCondensed?: boolean
}) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleCreate = (draftItem: PartialScheduleItem) => {
        if(draftItem.variant === "task") {
            onCreateTask(draftItem);
        } else {
            throw new Error("Incorrect item variant");
        }
    }

    return (
        (isCreating) ? (
            <ExpandedCreateItemBlock
                variant="task"
                defaultItem={defaultTask}
                onCreateItem={handleCreate}
                onClose={() => setIsCreating(false)}
            />
        ) : (
            <li
                className="flex flex-row items-center w-full h-15 p-3 gap-3 border border-gray-800 rounded-2xl"
                onClick={() => setIsCreating(true)}
            >
                <div className="text-left justify-center font-bold text-gray-600">
                    add task
                </div>
                <div className="ml-auto w-6 h-6 p-4 rounded-full shrink-0 flex items-center justify-center">
                    <p className="font-dongle text-[3rem] h-4 text-gray-700">+</p>
                </div>
            </li>
        )
    );
};

export default CreateTaskBlock;