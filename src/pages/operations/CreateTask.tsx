import { useState } from 'react'
import TaskDatePicker from '@/components/TaskDatePicker';
import { Repeat, RepeatOff, Tags } from 'lucide-react';
import { DateString, PartialTask, RecurrenceRule } from '@/types';

const defaultTask: PartialTask = {
  name: "",
  description: "",
  tags: [],
  doDate: null,
  checked: false
}

const CreateTask = ({ isOpen, onCreate }: {
    isOpen: boolean,
    onCreate: (draftTask: PartialTask) => void,
}) => {
  const [draftTask, setDraftTask] = useState<PartialTask>(defaultTask);

  const handleSubmit = () => {
    if(draftTask.name?.trim() === "") return;
    onCreate(draftTask);
    setDraftTask(defaultTask);
  }

  const handleStartTimeChange = (date: DateString) => {
    setDraftTask({...draftTask, doDate: {...draftTask.doDate!, date}});
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
  
  return (
    <div
      className={`fixed inset-x-0 bottom-0 ${isOpen ? "translate-y-0" : "translate-y-[101%]"} transition-transform duration-400 ease-in-out
                  flex flex-col gap-3
                  z-100 w-full h-fit bg-[#1f2028] rounded-t-4xl p-8`}
    >
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
          <TaskDatePicker
            doDate={draftTask.doDate!}
            onChange={handleStartTimeChange}
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
          <TaskDatePicker
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
          <TaskDatePicker
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
          className={`h-10 ml-auto aspect-square rounded-full transition-colors duration-300 ease-in-out
            ${(draftTask.name?.trim() !== "") ?
                "bg-amber-100 text-amber-900"
              :
                "bg-gray-500 border border-gray-800"
              }`
            }
          onClick={handleSubmit}
        > 
          {">"}
        </button>
      </div>
    </div>
  )
}

export default CreateTask