import { useBottomSheet } from "@/context/BottomSheetContext";
import { useScheduleItems } from "@/context/ScheduleItemContext";
import { PartialScheduleItem } from "@/types";
import CreateItemSheet from "../schedule-items/CreateItemSheet";

const AddTaskButton = () => {
    const { openSheet, closeSheet } = useBottomSheet();
    const { createTask, createBlock } = useScheduleItems();

    const handleCreate = (draft: PartialScheduleItem) => {
        closeSheet();
        if(draft.variant === "task") createTask(draft);
        if(draft.variant === "block") createBlock(draft);
    }

    const handleCreateOpen = () => {
        openSheet(
            CreateItemSheet,
            { onCreate: handleCreate }
        );
    };

    return (
        <button
            className="h-12 aspect-square rounded-full flex justify-center items-center p-1 bg-amber-100"
            onClick={handleCreateOpen}
        >
            <p className="font-dongle text-[3rem] h-4 text-amber-900">+</p>
        </button>
    );
}

export default AddTaskButton;