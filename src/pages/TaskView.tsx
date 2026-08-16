import { useScheduleItems } from '@/context/ScheduleItemContext';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from '@/components/doInfo/DatePicker';

import { Trash2, UndoDot, Save, Ellipsis, X } from 'lucide-react';
import CheckButton from '@/components/buttons/CheckButton';
import { DoInfo, PartialTask } from '@/types';
import { isPartialTaskDifferent } from '@/utils/taskUtils';
import { defaultTask } from '@/utils/constants';
import ItemList from '@/components/schedule-items/ItemList';
import useSubtasks from '@/hooks/useSubtasks';
import CreateTaskBlock from '@/components/schedule-items/tasks/CreateTaskBlock';
import { useLiveQuery } from 'dexie-react-hooks';

const TaskView = () => {
    const [modTask, setModTask] = useState<PartialTask>(null!);
    const [loading, setLoading] = useState<boolean>(true);
    const initFor = useRef<string|null>(null);

    const params = useParams();
    const id = params.id;

    const task = useLiveQuery(() => getItemById(id!), [id]);
    
    const navigate = useNavigate();

    const { createTask, editTask, deleteItem, toggleChecked, getItemById } = useScheduleItems();

    const { subtasks } = useSubtasks(id!);

    useEffect(() => {
        if((task?.variant === "task") && (initFor.current !== task.id)) {
            const {id, ...partialTask} = task;
            initFor.current = id;
            setModTask(partialTask);
            setLoading(false);
        }
    }, [task]);

    const handleRevert = () => {
        if((!task) || (task.variant !== "task")) return;
        const {id, ...partialTask} = task;
        setModTask(partialTask);
    }
    
    // plan: open dropdown to change single/all
    const handleSubmit = () => {
        if(modTask.name?.trim() === "") return;
        editTask(id!, modTask);
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const newTask: PartialTask = {...modTask, name: e.target.value};
        setModTask(newTask);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        const newTask: PartialTask = {...modTask, description: e.target.value};
        setModTask(newTask);
    }

    const handleCheckedChange = () => {
        const newTask: PartialTask = {...modTask, checked: !modTask.checked};
        setModTask(newTask);
    }

    const handleDoInfoChange = (doInfo: DoInfo | null) => {
        const newTask: PartialTask = {...modTask, doInfo};
        setModTask(newTask);
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

    if(!task) return (<div>not found task</div>);
    if(task.variant !== "task") return (<div>not a task</div>);
    if(loading) return (<div>loading...</div>);

    const hasChanged = isPartialTaskDifferent(task, modTask);
    
    return (
        <div className="w-full flex flex-col items-center p-3 gap-3 overflow-x-hidden overflow-y-scroll">
            <div className="sticky flex flex-row justify-between w-dvw px-3 h-8 border-b border-gray-700">
                {/* path/task name on scroll */}
                <p>
                </p>

                <div className="flex flex-row gap-3">
                    {/* menu */}
                    <button 
                        className="w-fit h-fit"
                    >
                        <Ellipsis strokeWidth={2} />
                    </button>
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
                                className={`max-w-full p-3 resize-y box-border outline-none field-sizing-content
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
                    <CheckButton
                        checked={modTask.checked ?? false}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleCheckedChange();
                        }}
                    /> 
                </div>

                <div className="flex flex-row">
                    <DatePicker
                        doInfo={modTask.doInfo ?? null}
                        onChange={handleDoInfoChange}
                    />
                </div>

                <div className="w-full flex flex-col items-center gap-3">
                    <textarea
                        value={modTask.description}
                        onChange={handleDescriptionChange}
                        placeholder="description"
                        className={`w-full min-h-25 p-3 border border-gray-700 rounded-2xl outline-none field-sizing-content ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
                    />
                </div>
            </div>     
            
            <div className="w-full flex flex-row p-3 gap-3">
                {/* delete */}
                <button
                    className={`p-2 border-2 border-red-700 bg-red-900 rounded-full`}
                    onClick={handleTaskDelete}
                >
                    <Trash2 strokeWidth={2} />
                </button>
                {/* revert */}
                <button
                    className={`ml-auto px-3 py-1.5 border-2 rounded-full transition-colors duration-200 ease-in-out ${hasChanged ? "bg-amber-700 text-[#f3f4f6] border-amber-600" : "bg-gray-700 border-gray-600"}`}
                    onClick={hasChanged ? handleRevert : undefined}
                >
                    <UndoDot strokeWidth={2} />
                </button>
                {/* save */}
                <button
                    className={`px-3 py-1.5 border-2 rounded-full transition-colors duration-200 ease-in-out ${hasChanged ? "bg-green-600 text-[#f3f4f6] border-green-500" : "bg-gray-700 border-gray-600"}`}
                    onClick={hasChanged ? handleSubmit : undefined}
                >
                    <Save strokeWidth={2} />
                </button>
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