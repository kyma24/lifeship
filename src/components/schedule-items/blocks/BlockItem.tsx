import { useState } from "react";
import ItemList from "../ItemList";
import CreateTaskBlock from "../tasks/CreateTaskBlock";
import { defaultTask } from "@/utils/constants";
import { Block, BlockActions, PartialTask } from "@/types";
import { useScheduleItems } from "@/context/ScheduleItemContext";
import useSubtasks from "@/hooks/useSubtasks";
import CreateBlockHeader from "./header/CreateBlockHeader";
import { getPartialBlock } from "@/utils/blockUtils";
import DisplayBlockHeader from "./header/DisplayBlockHeader";

const BlockItem = ({ block }: {
    block: Block
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [isModifying, setIsModifying] = useState<boolean>(false);

    const { createTask, editBlock, toggleChecked, deleteItem } = useScheduleItems();

    const { subtasks } = useSubtasks(block.id);

    const handleCreateSubtask = (draft: PartialTask) => {
        createTask({...draft, parentId: block.id});
    }

    const handleDeleteBlock = () => {
        if(window.confirm('Delete this task?')) {
            deleteItem(block.id);
        }
    }

    const blockActions: BlockActions = {
        edit: () => setIsModifying(!isModifying),
        delete: handleDeleteBlock,
    };

    return (
        <li className="flex flex-col px-3 w-full">
            {(isModifying)
                ? (
                    <CreateBlockHeader
                        id={block.id}
                        startBlock={getPartialBlock(block)}
                        onChangeBlock={editBlock}
                        onClose={() => setIsModifying(false)}
                    />
                )
                : (
                    <DisplayBlockHeader
                        block={block}
                        subtasks={subtasks ?? []}
                        isExpanded={isExpanded}
                        onClick={() => setIsExpanded(!isExpanded)}
                        actions={blockActions}
                    />
                )
            }

            {isExpanded && (
                <ul className="flex flex-col w-full gap-2">
                    <ItemList
                        items={subtasks ?? []}
                        onCompleteTask={toggleChecked}
                        withDate={true}
                        isSubtask={true}
                    />
                    <CreateTaskBlock
                        defaultTask={defaultTask}
                        onCreateTask={handleCreateSubtask}
                    />
                </ul>
            )}
        </li>
    );
};

export default BlockItem;