import { useState } from 'react'
import DatePicker from '@/components/DatePicker';
import { ArrowUp, Repeat, RepeatOff, Tags } from 'lucide-react';
import { DoInfo, PartialBlock, PartialScheduleItem, PartialTask, RecurrenceRule } from '@/types';
import { defaultTask } from '@/utils/taskUtils';
import Divider from '@/components/Divider';
import { defaultBlock } from '@/utils/blockUtils';

const CreateItemSheet = ({ isOpen, onCreate }: {
    isOpen: boolean,
    onCreate: (draft: PartialScheduleItem) => void,
}) => {
  const [variant, setVariant] = useState<string>("");

  const renderContent = (curVariant: string) => {
    switch (curVariant) {
      case "task":
        return <CreateTaskDisplay onCreate={onCreate} />;
      case "block":
        return <CreateBlockDisplay onCreate={onCreate} />;
      default:
        return <ChooseVariantDisplay onClickVariant={handleClickVariant} />;
    }
  }

  const handleClickVariant = (curVariant: string) => {
    setVariant(curVariant);
  }
  
  return (
    <div
      className={`fixed inset-x-0 bottom-0 ${isOpen ? "translate-y-0" : "translate-y-[101%]"} transition duration-400 ease-in-out
                  flex flex-col gap-3
                  z-100 w-full h-fit bg-[#1f2028] rounded-t-4xl p-8`}
    >
      {renderContent(variant)}
    </div>
  )
}

const ChooseVariantDisplay = ({ onClickVariant }: {
  onClickVariant: (s: string) => void,
}) => {
  return (
    <>
      <div className="text-xl font-bold">
        Add...
      </div>

      <div className="flex flex-col w-full justify-center">
        <button
          className="flex flex-row h-15 py-3 gap-3 items-center"
          onClick={() => onClickVariant("task")}
        >
          <div className={`
              h-full aspect-square rounded-full transition duration-300 
              bg-gray-300
          `} />
          <p className="text-lg font-semibold">Task</p>
        </button>

        <Divider />

        <button
          className="flex flex-row h-15 py-3 gap-3 items-center"
          onClick={() => onClickVariant("block")}
        >
          <div className={`
              h-full aspect-square rounded-full transition duration-300 
              bg-gray-300
          `} />
          <p className="text-lg font-semibold">Block</p>
        </button>
      </div>
    </>
  );
};

const CreateBlockDisplay = ({ onCreate }: {
  onCreate: (draft: PartialScheduleItem) => void,
}) => {
  const [draftBlock, setDraftBlock] = useState<PartialBlock>(defaultBlock);

  const handleSubmit = () => {
    const trimmedName = draftBlock.name?.trim();
    if(trimmedName === "") return;
    onCreate({...draftBlock, name: trimmedName});
    setDraftBlock(defaultBlock);
  }

  const handleDoDateChange = (doDate: DoInfo) => {
    setDraftBlock({...draftBlock, doDate: {...draftBlock.doDate!,
      date: doDate.date,
      timePeriod: doDate.timePeriod
    }});
  }

  const draftIsValid = (draft: PartialBlock) => {
    return draft.name?.trim() !== "";
  }

  return (
    <>
      <div className="flex flex-col gap-1">
            <input
              value={draftBlock.name}
              onChange={e => setDraftBlock({...draftBlock, name: e.target.value})}
              placeholder="block name"
              className={`outline-none text-3xl ${(draftBlock.name !== "") ? "text-[#f3f4f6]" : ""}`}
            />
            
            <textarea
              value={draftBlock.description}
              onChange={e => setDraftBlock({...draftBlock, description: e.target.value})}
              placeholder="description"
              className={`outline-none text-xl ${(draftBlock.name !== "") ? "text-[#f3f4f6]" : ""}`}
            />
      </div>

      <button
        className={`flex justify-center items-center h-10 ml-auto 
          aspect-square rounded-full 
          transition-colors duration-300 ease-in-out
          ${draftIsValid(draftBlock) ?
              "bg-amber-100 text-amber-900"
            :
              "bg-gray-500 border border-gray-800"
            }`
          }
        onClick={handleSubmit}
      > 
        <ArrowUp className="size-6" strokeWidth={2} />
      </button>
    </>
  );
};

const CreateTaskDisplay = ({ onCreate }: {
  onCreate: (draft: PartialScheduleItem) => void,
}) => {
  const [draftTask, setDraftTask] = useState<PartialTask>(defaultTask);

  const handleSubmit = () => {
    const trimmedName = draftTask.name?.trim();
    if(trimmedName === "") return;
    onCreate({...draftTask, name: trimmedName});
    setDraftTask(defaultTask);
  }

  const handleDoDateChange = (doDate: DoInfo) => {
    setDraftTask({...draftTask, doDate: {...draftTask.doDate!, 
      date: doDate.date,
      timePeriod: doDate.timePeriod
    }});
  }

  const handleDurationChange = (duration: number) => {
    setDraftTask({...draftTask, doDate: {...draftTask.doDate!, duration}});
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

  /*const handleEndTimeChange = (date) => {
    const duration = (toMs(date) - toMs(draftTask.startTime))/60000;
    handleDurationChange = (Math.max(0,duration));
  }

  const handleDeadlineChange = (deadline) => {
    setDraftTask({...draftTask, deadline: toMs(deadline)});
  }*/

  const draftIsValid = (draft: PartialTask) => {
    return draft.name?.trim() !== "";
  }

  return (
    <>
        <div className="flex flex-col gap-1">
            <input
              value={draftTask.name}
              onChange={e => setDraftTask({...draftTask, name: e.target.value})}
              placeholder="task name"
              className={`outline-none text-3xl ${(draftTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
            />
            
            <textarea
              value={draftTask.description}
              onChange={e => setDraftTask({...draftTask, description: e.target.value})}
              placeholder="description"
              className={`outline-none text-xl ${(draftTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
            />
        </div>
        
        {/*separate display for start time, duration, deadline, recurrence*/}
        <div className="flex flex-row gap-6 items-center text-md">
          <div className="flex flex-row gap-2 items-center">
            <DatePicker
              doDate={draftTask.doDate!}
              onChange={handleDoDateChange}
            />

            <p>→</p>

            <div className="flex flex-row items-center gap-0.5">
              <input
                type="number"
                value={draftTask.doDate?.duration!}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                className="px-2 py-1 field-sizing-content border border-gray-700"
              />
              <p>m</p>
            </div>

            {/* end time picker
            <DatePicker
              doDate={addDurationMs(draftTask.startTime, draftTask.duration)}
              onChange={handleEndTimeChange}
            />
            */}
          </div>

          
          {/* recurring? */}
          <div className="flex flex-row items-center text-md">
            <button
              className="flex justify-center items-center p-2 aspect-square rounded-full border border-gray-700"
              onClick={handleToggleRecurrence}
            > 
              {draftTask.doDate?.recurrence 
                ? <Repeat className="size-4" strokeWidth={2} />
                : <RepeatOff className="size-4" strokeWidth={2} />}
            </button>
          </div>

          {/*<div className="flex flex-row items-center">
            <p>{"due: "}</p>
            <DatePicker
              doDate={draftTask.deadline}
              onChange={handleDeadlineChange}
            />
          </div>*/}
        </div>

        <div className="flex flex-row gap-2 items-center">
          {/* add more tags */}
          <button
            className="flex justify-center items-center p-2 aspect-square rounded-full border border-gray-700"
          > 
            <Tags className="size-4" strokeWidth={2} />
          </button>

          {/* submit info */}
          <button
            className={`flex justify-center items-center h-10 ml-auto 
              aspect-square rounded-full 
              transition-colors duration-300 ease-in-out
              ${draftIsValid(draftTask) ?
                  "bg-amber-100 text-amber-900"
                :
                  "bg-gray-500 border border-gray-800"
                }`
              }
            onClick={handleSubmit}
          > 
            <ArrowUp className="size-6" strokeWidth={2} />
          </button>
        </div>
      </>
  );
};

export default CreateItemSheet