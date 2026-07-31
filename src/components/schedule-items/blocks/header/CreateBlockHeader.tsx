import Divider from "@/components/Divider";
import { PartialBlock } from "@/types";
import { useState } from "react";

const CreateBlockHeader = ({ id, startBlock, onChangeBlock, onClose }: {
    id: string,
    startBlock: PartialBlock,
    onChangeBlock: (id: string, modBlock: PartialBlock) => void,
    onClose: () => void,
}) => {
    const [draftBlock, setDraftBlock] = useState<PartialBlock>(startBlock);

    const handleSubmit = () => {
        if(draftBlock.name?.trim() === "") return;
        onChangeBlock(id, draftBlock);
        onClose();
    }

    return (
        <div className="flex flex-col w-full border border-gray-700 rounded-2xl">
            <div className="flex flex-col px-4 p-3 gap-2">
                {/* task name / description */}
                <div className="flex flex-col">
                    <input
                        value={draftBlock.name}
                        onChange={e => setDraftBlock({...draftBlock, name: e.target.value})}
                        placeholder="block name"
                        className={`outline-none font-bold text-xl ${(draftBlock.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                    
                    <textarea
                        value={draftBlock.description}
                        onChange={e => setDraftBlock({...draftBlock, description: e.target.value})}
                        placeholder="description"
                        className={`outline-none field-sizing-content text-lg ${(draftBlock.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                </div>

                {/* property tags, e.g. doInfo/priority/tags
                <div className="flex flex-row gap-2">
                    <DatePicker 
                        doInfo={draftBlock.doInfo!}
                        onChange={handleDoDateChange}
                    />

                    <button
                        className="flex justify-center items-center p-2 aspect-square rounded-full border border-gray-700"
                        onClick={handleToggleRecurrence}
                    > 
                        {draftBlock.doInfo?.recurrence 
                        ? <Repeat className="size-4" strokeWidth={2} />
                        : <RepeatOff className="size-4" strokeWidth={2} />}
                    </button>
                </div> */}
            </div>

            <Divider />

            {/* footer, e.g. parent project, cancel/create */}
            <div className="flex flex-row p-3">

                {/* INSERT PARENT PROJECT SELECTOR */}

                <div className="ml-auto flex flex-row gap-3">
                    <button
                        className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                        onClick={onClose}
                    >
                        <p className="leading-5">cancel</p>
                    </button>
                    <button
                        className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                        onClick={handleSubmit}
                    >
                        <p className="leading-5">save</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBlockHeader;