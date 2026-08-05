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
    
    const handleSubmit = () => {
        if(modTask.name?.trim() === "") return;
        editTask(id!, modTask);
    }

    const handleCheckedChange = () => {
        setModTask({...modTask, checked: !modTask.checked});
    }

    const handleDoInfoChange = (doInfo: DoInfo | null) => {
        setModTask({...modTask, doInfo});
    }

    const handleCreateSubtask = (draftTask: PartialTask) => {
        createTask({...draftTask, parentId: id});
    }

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
        <div className="w-full flex flex-col items-center p-3 overflow-x-hidden overflow-y-scroll">
            <div className="sticky flex flex-row justify-between w-dvw mb-5 px-3 h-8 border-b border-gray-700">
                {/* path/task name on scroll */}
                <p>
                    path stuff
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
            <CheckButton
                checked={modTask.checked ?? false}
                onChange={(e) => {
                    e.stopPropagation();
                    handleCheckedChange();
                }}
                styles={`h-15 aspect-square rounded-full transition duration-300 ${modTask.checked ? "bg-gray-500" : "bg-gray-300"}`}
            />             
            <h1>
                <input
                    value={modTask.name}
                    onChange={e => setModTask({...modTask, name: e.target.value})}
                    placeholder="task name"
                    className={`outline-none field-sizing-content transition-color duration-300
                        ${modTask.checked ? "text-[#9ca3af] line-through" : `no-underline
                            ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}
                        `}
                    `}
                />
            </h1>
            <div className="w-full flex flex-col items-center gap-3">
                <div className="flex flex-col">
                    <DatePicker
                        doInfo={modTask.doInfo ?? null}
                        onChange={handleDoInfoChange}
                    />
                </div>
                <textarea
                    value={modTask.description}
                    onChange={e => setModTask({...modTask, description: e.target.value})}
                    placeholder="description"
                    className={`w-full min-h-25 p-3 border border-gray-700 rounded-2xl outline-none field-sizing-content ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
                />
            </div>
            <div className="w-full flex flex-row p-3 gap-3">
                <button
                    className={`p-2 border-2 border-red-700 bg-red-900 rounded-full`}
                    onClick={handleTaskDelete}
                >
                    <Trash2 strokeWidth={2} />
                </button>
                <button
                    className={`ml-auto px-3 py-1.5 border-2 rounded-full transition-colors duration-200 ease-in-out ${hasChanged ? "bg-amber-700 text-[#f3f4f6] border-amber-600" : "bg-gray-700 border-gray-600"}`}
                    onClick={hasChanged ? handleRevert : undefined}
                >
                    <UndoDot strokeWidth={2} />
                </button>
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