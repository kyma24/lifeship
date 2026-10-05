import { useScheduleItems } from '@/context/ScheduleItemContext';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from '@/components/doInfo/DatePicker';

import { Ellipsis, X } from 'lucide-react';
import CheckTaskButton from '@/components/buttons/CheckTaskButton';
import { DateString, DoInfo, PartialTask, RecurrenceRule, Task } from '@/types';
import { defaultTask } from '@/utils/constants';
import ItemList from '@/components/schedule-items/ItemList';
import useSubtasks from '@/hooks/useSubtasks';
import CreateTaskBlock from '@/components/schedule-items/tasks/CreateTaskBlock';
import { getBaseDoInfo, isValidDateString, nowISO, itemWillOccurOn } from '@/utils/dateUtils';
import { mergeItemWithException } from '@/utils/exceptionUtils';
import MenuButton from '@/components/buttons/MenuButton';

const TaskView = () => {
    const [modTask, setModTask] = useState<PartialTask>(null!);
    const [loading, setLoading] = useState<boolean>(true);
    const initFor = useRef<string|null>(null);

    const params = useParams();
    const id = params.id;
    // if single, undefined; else, datestring occurrenceDate
    const date = params.date;

    const { rootItems, rootExceptions } = useScheduleItems();

    // get base task
    const baseTask = rootItems.find((item) => item.id === id); //useLiveQuery(() => getItemById(id!), [id]);
    const isRecurring = baseTask?.doInfo?.recurrence?.rrule ?? false;

    // get corresponding exception
    const exception = (isRecurring)
        ? rootExceptions.find((exc) => (
            (exc.itemId === id) 
            && (exc.occurrenceDate === date)
            && (exc.variant === "modified")
        ))
        : null;
    
    // merge into display task
    const task = (baseTask && exception)
        ? mergeItemWithException(baseTask, exception)
        : {...baseTask, doInfo: (baseTask?.doInfo)
            ? {...baseTask.doInfo, date }
            : {...getBaseDoInfo(), date }
        } as Task;

    const navigate = useNavigate();

    const { createTask, editTaskAll, editTaskOne, deleteItem, toggleChecked } = useScheduleItems();

    const { subtasks } = useSubtasks(id!);

    useEffect(() => {
        if((task?.variant === "task") && (initFor.current !== task.id)) {
            const {id, ...partialTask} = task;
            initFor.current = id;
            setModTask(partialTask);
            setLoading(false);
        }
    }, [task]);

    // query unsuccessful, or removed by exception
    if(!task || !baseTask) return (<div>not found task</div>);
    
    // plan: open dropdown to change single/all
    const handleSubmitAll = (taskUpdates: PartialTask = modTask) => {
        if(taskUpdates.name?.trim() === "") 
            taskUpdates.name = task.name;
        editTaskAll(id!,taskUpdates);
    }

    const handleSubmitSingle = (taskUpdates: PartialTask = modTask) => {
        if(taskUpdates.name?.trim() === "")
            taskUpdates.name = task.name;
        if(!task.doInfo?.date) return;
        // if has exception, do not make separate one on top of it
        editTaskOne(
            id!,
            taskUpdates,
            exception?.effectDate ?? task.doInfo.date,
            exception?.occurrenceDate ?? task.doInfo.date
        );
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const taskUpdates: PartialTask = { name: e.target.value };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitAll(taskUpdates);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const taskUpdates: PartialTask = { description: e.target.value };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitAll(taskUpdates);
    }

    const handleCheckedChange = () => {
        const taskUpdates: PartialTask = {
            checked: !modTask.checked, 
            checkedAt: (modTask.checked) ? null : nowISO()
        };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        toggleChecked(id!,date! as DateString);
    }

    const handleCheckAll = () => {
        const taskUpdates: PartialTask = {
            checked: !modTask.checked, 
            checkedAt: (modTask.checked) ? null : nowISO()
        };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitAll(taskUpdates);
    }

    const handleDateChange = (newDate: DateString | null) => {
        const taskUpdates: PartialTask = { doInfo: 
            (!newDate)
                ? null
                : { ...task!.doInfo ?? getBaseDoInfo(), date: newDate }
        };
        console.log(taskUpdates);
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitSingle(taskUpdates);
    }

    const handleTimeChange = (newTime: Partial<DoInfo> | null) => {
        // feat: add date if none
        if(!task.doInfo) return;

        const taskUpdates: PartialTask = 
        { doInfo:
            (newTime)
                ? { ...task.doInfo, ...newTime }
                : { ...task.doInfo, 
                    timePeriod: null, 
                    duration: null, 
                    timezone: null }
        };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitAll(taskUpdates);
    }

    const handleRecurrenceChange = (newRecurrence: RecurrenceRule | null) => {
        // feat: add date if none
        if(!task.doInfo) return;

        const taskUpdates: PartialTask = { doInfo:
            { ...task.doInfo, recurrence: newRecurrence }
        };
        setModTask({...modTask, ...taskUpdates});
        // for auto-registering changes
        handleSubmitAll(taskUpdates);
    }

    const handleCreateSubtask = (draftTask: PartialTask) => {
        createTask({...draftTask, parentId: id});
    }

    // plan: open dropdown to delete single/all
    const handleTaskDelete = async () => {
        if(window.confirm('Delete this task?')) {
            deleteItem(id!);
            navigate(-1);
        }
    }

    // invalid date param
    if(date && !isValidDateString(date)) return (<div>invalid occurrence date</div>);

    // valid date in recurrence?
    if(isRecurring && date && !exception) {
        if(!itemWillOccurOn(baseTask, date as DateString))
            return (<div>task on date does not exist</div>);
    }

    // non-task item
    if(task.variant !== "task") return (<div>not a task</div>);

    // loading buffer
    if(loading) return (<div>loading...</div>);
    
    return (
        <div className="w-full flex flex-col items-center p-3 gap-3 overflow-x-hidden overflow-y-scroll">
            <div className="sticky flex flex-row justify-between w-dvw px-3 h-8 border-b border-gray-700">
                {/* path/task name on scroll */}
                <p>
                </p>

                <div className="flex flex-row gap-3">
                    {/* menu */}
                    <MenuButton
                        onCheck={handleCheckedChange}
                        onCheckAll={handleCheckAll}
                        onDelete={handleTaskDelete}
                    />

                    {/* close */}
                    <button
                        className="w-fit h-fit"
                        onClick={() => navigate(-1)}
                    >
                        <X strokeWidth={2} />
                    </button>
                </div>
            </div>


            {/* task name, properties */}
            <div className="flex flex-col w-full p-3 gap-3">

                {/* task name, check button */}
                <div className="flex flex-row w-full items-center justify-between gap-3">
                    <div className="flex flex-row w-full items-center gap-2">
                        {/* task icon */}
                        <div className="shrink-0 h-15 aspect-square bg-gray-700 rounded-full" />

                        <h1 className="max-w-full text-left">
                            <textarea
                                value={modTask.name}
                                onChange={handleNameChange}
                                placeholder="task name"
                                className={`max-w-full p-3 box-border resize-none outline-none field-sizing-content
                                    transition-color duration-300
                                    ${modTask.checked
                                        ? "text-[#9ca3af] line-through" 
                                        : `no-underline ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}`
                                    }
                                `}
                            />
                        </h1>
                    </div>

                    {/* check button */}
                    <CheckTaskButton
                        checked={modTask.checked ?? false}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleCheckedChange();
                        }}
                    /> 
                </div>

                <div className="w-full flex flex-col items-center gap-3">
                    <textarea
                        value={modTask.description}
                        onChange={handleDescriptionChange}
                        placeholder="description"
                        className={`w-full h-fit p-3 border border-gray-700 rounded-2xl resize-none outline-none field-sizing-content ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                </div>

                <div className="flex flex-row">
                    <DatePicker
                        doInfo={modTask.doInfo ?? null}
                        onDateChange={handleDateChange}
                        onTimeChange={handleTimeChange}
                        onRecurrenceChange={handleRecurrenceChange}
                    />
                </div>
            </div>

            {/* subtasks */}
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
        </div>
    )
}

export default TaskView