import { useTasks } from '@/context/TaskContext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { formatTimePeriod, addDurationTPFormatted } from '@/utils/dateUtils';
import TaskDatePicker from '@/components/TaskDatePicker.tsx';

import { Trash2, UndoDot, Save } from 'lucide-react';
import CheckButton from '@/components/CheckButton';
import { DoDate, PartialTask, Task } from '@/types';
import { createTaskFromDraft } from '@/utils/taskUtils';
import TaskList from '@/components/tasks/TaskList';
import useSubtasks from '@/hooks/useSubtasks';
import CreateTaskBlock from '@/components/tasks/CreateTaskBlock';

const defaultTask: PartialTask = {
  name: "",
  description: "",
  tags: [],
  doDate: null,
  checked: false
}

const TaskView = () => {
    const [task, setTask] = useState<Task>(null!);
    const [modTask, setModTask] = useState<PartialTask>(null!);
    const [loading, setLoading] = useState<boolean>(true);

    const params = useParams();
    const id = params.id;
    
    const navigate = useNavigate();

    const { createTask, editTask, deleteTask, toggleChecked, getTaskById } = useTasks();

    const { subtasks } = useSubtasks(id!);

    useEffect(() => {
        getTaskById(id!).then(task => {
            setTask(task!);
            setModTask({id, ...task});
            setLoading(false);
        });
    }, [id]);

    const handleRevert = () => {
        setModTask(task);
    }
    
    const handleSubmit = () => {
        if(modTask.name?.trim() === "") return;
        editTask(id!, modTask);
        const newTask: Task = createTaskFromDraft(id!, modTask);
        setTask(newTask);
    }

    const handleCheckedChange = () => {
        setModTask({...modTask, checked: !modTask.checked});
    }

    const handleDoDateChange = (doDate: DoDate) => {
        setModTask({...modTask, doDate: {...modTask.doDate!, 
            date: doDate.date,
            timePeriod: doDate.timePeriod
        }});
    }

    const handleDurationChange = (duration: number) => {
        setModTask({...modTask, doDate: {...modTask.doDate!, duration}});
    }

    const handleCreateSubtask = (draftTask: PartialTask) => {
        console.log(id);
        createTask({...draftTask, parentId: id});
    }

    /*const handleEndTimeChange = (date) => {
    const duration = (toMs(date) - toMs(modTask.startTime))/60000;
    handleDurationChange = (Math.max(0,duration));
    }

    const handleDeadlineChange = (deadline) => {
        setModTask({...modTask, deadline: toMs(deadline)});
    }*/

    const handleTaskDelete = async () => {
        if(window.confirm('Delete this task?')) {
            deleteTask(id!);
            navigate(-1);
        }
    }

    const hasChanged = JSON.stringify(task) !== JSON.stringify(modTask);

    if(loading) return <div>loading...</div>
    if(!task) return <div>not found task</div>
    
    return (
        <div className="w-full flex flex-col items-center p-3">
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
                    <div className="flex flex-row items-center gap-1">
                        <TaskDatePicker
                            doDate={modTask.doDate!}
                            onChange={handleDoDateChange}
                        />
                        <p>for</p>
                        <div className="flex flex-row items-center gap-0.5">
                            <input
                                type="number"
                                value={modTask.doDate?.duration ?? 0}
                                onChange={(e) => handleDurationChange(Number(e.target.value))}
                                className="relative h-fit w-fit field-sizing-content border border-gray-700 px-1"
                            />
                            <p>m</p>
                        </div>
                    </div>
                    <p>{ modTask.doDate ? (
                            `${formatTimePeriod(modTask.doDate?.timePeriod)} ${(modTask.doDate.timePeriod?.type === "exact") ? (
                                (modTask.doDate.duration) && `→ ${addDurationTPFormatted(modTask.doDate.timePeriod, modTask.doDate.duration)}`
                            ) : (
                                <p>{modTask.doDate.timePeriod?.timeOfDay}: {modTask.doDate.duration}m</p>
                            )}`
                        ) : (
                            `--:--`
                        )
                    }</p>
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
            <div className="w-full gap-3">
                <TaskList
                    tasks={subtasks ?? []}
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