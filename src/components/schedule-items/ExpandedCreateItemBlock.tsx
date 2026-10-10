import { DateString, DoInfo, PartialScheduleItem, RecurrenceRule } from "@/types";
import { useState } from "react";
import Divider from "../Divider";
import DatePicker from "../doInfo/DatePicker";
import { getBaseDoInfo } from "@/utils/dateUtils";

const ExpandedCreateItemBlock = ({ variant, defaultItem, onCreateItem, onClose }: {
    variant: "task" | "block",
    defaultItem: PartialScheduleItem,
    onCreateItem: (draftItem: PartialScheduleItem) => void,
    onClose: () => void,
}) => {
    const [draftItem, setDraftItem] = useState<PartialScheduleItem>(defaultItem);

    const handleCancel = () => {
        setDraftItem(defaultItem);
        onClose();
    };
    
    const handleSubmit = () => {
        if(draftItem.name?.trim() === "") return;
        onCreateItem(draftItem);
        setDraftItem(defaultItem);
        onClose();
    }

    const handleDateChange = (newDate: DateString | null) => {
        const updates: PartialScheduleItem = { doInfo:
            (!newDate)
                ? null
                : { ...draftItem.doInfo ?? getBaseDoInfo(), date: newDate}
        }
        setDraftItem({...draftItem, ...updates});
    }

    const handleTimeChange = (newTime: Partial<DoInfo> | null) => {
        // feat: add date if none
        if(!draftItem.doInfo) return;

        const updates: PartialScheduleItem = { doInfo:
            (newTime)
                ? { ...draftItem.doInfo, ...newTime }
                : { ...draftItem.doInfo,
                    timePeriod: null,
                    duration: null,
                    timezone: null }
        };
        setDraftItem({...draftItem, ...updates});
    }

    const handleRecurrenceChange = (newRecurrence: RecurrenceRule | null) => {
        // feat: add date if none
        if(!draftItem.doInfo) return;

        const updates: PartialScheduleItem = { doInfo:
            { ...draftItem.doInfo, recurrence: newRecurrence }
        };
        setDraftItem({...draftItem, ...updates});
    }

    return (
        <li className="flex flex-col w-full border border-gray-700 rounded-2xl">
            <div className="flex flex-col px-4 p-3 gap-2">
                {/* item name / description */}
                <div className="flex flex-col">
                    <input
                        value={draftItem.name}
                        onChange={e => setDraftItem({...draftItem, name: e.target.value})}
                        placeholder={`${variant} name`}
                        className={`outline-none font-bold text-xl ${(draftItem.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                    
                    <textarea
                        value={draftItem.description}
                        onChange={e => setDraftItem({...draftItem, description: e.target.value})}
                        placeholder="description"
                        className={`outline-none field-sizing-content text-lg ${(draftItem.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                </div>

                {/* property tags, e.g. doInfo/priority/tags */}
                <div className="flex flex-row gap-2">
                    <DatePicker 
                        doInfo={draftItem.doInfo!}
                        onDateChange={handleDateChange}
                        onTimeChange={handleTimeChange}
                        onRecurrenceChange={handleRecurrenceChange}
                    />
                </div>
            </div>

            <Divider color="gray-800" />

            {/* footer, e.g. parent project, cancel/create */}
            <div className="flex flex-row p-3">

                {/* INSERT PARENT PROJECT SELECTOR */}

                <div className="ml-auto flex flex-row gap-3">
                    <button
                        className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                        onClick={handleCancel}
                    >
                        <p className="leading-5">cancel</p>
                    </button>
                    <button
                        className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                        onClick={handleSubmit}
                    >
                        <p className="leading-5">add {variant}</p>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default ExpandedCreateItemBlock;