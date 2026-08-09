import { DateString, DropdownOption, PartialScheduleItem } from "@/types";
import { defaultBlock, defaultDayBlock, defaultDayTask, defaultTask } from "@/utils/constants";
import { useState } from "react";
import ExpandedCreateItemBlock from "./ExpandedCreateItemBlock";
import { Plus } from "lucide-react";
import Dropdown from "../Dropdown";

const CreateItemBlock = ({ date, isCreating, onToggleCreating, onCreateItem, isCondensed=false }: {
    date?: DateString,
    isCreating: boolean,
    onToggleCreating: () => void,
    onCreateItem: (draftItem: PartialScheduleItem) => void,
    isCondensed?: boolean
}) => {
    const [variant, setVariant] = useState<"task"|"block">("task");

    const variantDropdown: DropdownOption[] = [
        { label: "task" },
        { label: "block" }
    ];

    const indToVariant = (ind: number) => {
        if(ind===0) return "task";
        else return "block";
    }

    if(isCreating && (variant === "task")) {
        return (
            <ExpandedCreateItemBlock
                variant="task"
                defaultItem={date ? defaultDayTask(date) : defaultTask}
                onCreateItem={onCreateItem}
                onClose={onToggleCreating}
            />
        );
    }

    if(isCreating && (variant === "block")) {
        return (
            <ExpandedCreateItemBlock
                variant="block"
                defaultItem={date ? defaultDayBlock(date) : defaultBlock}
                onCreateItem={onCreateItem}
                onClose={onToggleCreating}
            />
        );
    }

    return (
        <div className="flex flex-row items-center justify-start w-full gap-3 px-3">
            <button
                onClick={onToggleCreating}
                className="bg-gray-700 p-1 rounded-full"
            >
                <Plus
                    strokeWidth={3}
                    className="size-4"
                />
            </button>
            <div className="flex flex-row items-center gap-2">
                <p className="font-bold text-gray-600">add</p>
                <Dropdown
                    currentOption={(variant==="task") ? 0 : 1}
                    options={variantDropdown}
                    onOptionClick={(ind: number) => setVariant(indToVariant(ind))}
                    className="text-gray-600"
                />
            </div>
        </div>
    );
};

export default CreateItemBlock