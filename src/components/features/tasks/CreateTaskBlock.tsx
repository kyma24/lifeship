import Divider from "@/components/Divider";
import PropertyTag from "@/components/PropertyTag";
import TaskDatePicker from "@/components/TaskDatePicker";
import { DoDate, PartialTask, RecurrenceRule } from "@/types";
import { useState } from "react";
import { useTasks } from "./context/TaskContext";
import { Repeat, RepeatOff } from "lucide-react";

const CreateTaskBlock = ({ defaultTask }: {
    defaultTask: PartialTask
}) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [draftTask, setDraftTask] = useState<PartialTask>(defaultTask);

    const { createTask } = useTasks();
    
    const handleSubmit = () => {
        if(draftTask.name?.trim() === "") return;
        createTask(draftTask);
        setDraftTask(defaultTask);
        setIsCreating(false);
    }

    const handleDoDateChange = (doDate: DoDate) => {
        setDraftTask({...draftTask, doDate: {...draftTask.doDate!, 
          date: doDate.date,
          timePeriod: doDate.timePeriod
        }});
    }

    const handleToggleRecurrence = () => {
        setDraftTask({...draftTask, doDate: {...draftTask.doDate!, recurrence:
          (draftTask.doDate?.recurrence 
            ? null 
            : {
                rrule: 'FREQ=DAILY',
                endDate: "",
              } as RecurrenceRule
          )
        }});
      }

    return (
        (isCreating) ? (
            <li className="flex flex-col w-full border border-gray-700 rounded-2xl">
                <div className="flex flex-col px-4 p-3 gap-2">
                    {/* task name / description */}
                    <div className="flex flex-col">
                        <input
                            value={draftTask.name}
                            onChange={e => setDraftTask({...draftTask, name: e.target.value})}
                            placeholder="task name"
                            className={`outline-none font-bold text-xl ${(draftTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
                        />
                        
                        <textarea
                            value={draftTask.description}
                            onChange={e => setDraftTask({...draftTask, description: e.target.value})}
                            placeholder="description"
                            className={`outline-none field-sizing-content text-lg ${(draftTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
                        />
                    </div>

                    {/* property tags, e.g. doDate/priority/tags */}
                    <div className="flex flex-row gap-2">
                        <TaskDatePicker 
                            doDate={draftTask.doDate!}
                            onChange={handleDoDateChange}
                        />

                        <button
                            className="flex justify-center items-center p-2 aspect-square rounded-full border border-gray-700"
                            onClick={handleToggleRecurrence}
                        > 
                            {draftTask.doDate?.recurrence 
                            ? <Repeat className="size-4" strokeWidth={2} />
                            : <RepeatOff className="size-4" strokeWidth={2} />}
                        </button>
                    </div>
                </div>

                <Divider />

                {/* footer, e.g. parent project, cancel/create */}
                <div className="flex flex-row p-3">

                    {/* INSERT PARENT PROJECT SELECTOR */}

                    <div className="ml-auto flex flex-row gap-3">
                        <button
                            className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                            onClick={() => setIsCreating(false)}
                        >
                            <p className="leading-5">cancel</p>
                        </button>
                        <button
                            className="flex align-center justify-center p-2 bg-gray-800 rounded-md"
                            onClick={handleSubmit}
                        >
                            <p className="leading-5">add task</p>
                        </button>
                    </div>
                </div>
            </li>
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