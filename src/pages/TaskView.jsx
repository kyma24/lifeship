import { useTasks } from '@/features/tasks/context/TaskContext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { toMs, toDate, getTime, addDuration } from '@/utils/dateUtils';
import TaskDatePicker from '@/components/TaskDatePicker.tsx';

import { Trash2, UndoDot, Save } from 'lucide-react';
import CheckButton from '@/components/CheckButton';

const TaskView = () => {
    const [task, setTask] = useState(null);
    const [modTask, setModTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const id = params.id;
    
    const navigate = useNavigate();

    const { editTask, deleteTask, getTaskById } = useTasks();

    useEffect(() => {
        getTaskById(id).then(task => {
            setTask(task);
            setModTask(task);
            setLoading(false);
        });
    }, [id]);

    const handleRevert = () => {
        setModTask(task);
    }
    
    const handleSubmit = () => {
        if(modTask.name.trim() === "") return;
        editTask(modTask);
        setTask(modTask);
    }

    const handleCompleteChange = () => {
        setModTask({...modTask, completed: !modTask.completed});
    }

    const handleStartTimeChange = (date) => {
        setModTask({...modTask, startTime: toMs(date)});
    }

    const handleDurationChange = (duration) => {
        setModTask({...modTask, duration: duration});
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
            await deleteTask(id);
            navigate(-1);
        }
    }

    const hasChanged = JSON.stringify(task) !== JSON.stringify(modTask);

    if(loading) return <div>loading...</div>
    if(!task) return <div>not found task</div>
    
    return (
        <div className="w-full flex flex-col items-center p-3">
            <CheckButton
                checked={modTask.completed}
                onChange={(e) => {
                    e.stopPropagation();
                    handleCompleteChange();
                }}
                styles={`h-15 aspect-square rounded-full transition duration-300 ${modTask.completed ? "bg-gray-500" : "bg-gray-300"}`}
            />             
            <h1>
                <input
                    value={modTask.name}
                    onChange={e => setModTask({...modTask, name: e.target.value})}
                    placeholder="task name"
                    className={`outline-none field-sizing-content transition-color duration-300
                        ${modTask.completed ? "text-[#9ca3af] line-through" : `no-underline
                            ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}
                        `}
                    `}
                />
            </h1>
            <div className="w-full flex flex-col items-center gap-3">
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                        <TaskDatePicker
                            timeValue={modTask.startTime}
                            onChange={handleStartTimeChange}
                        />
                        <p>for</p>
                        <div className="flex flex-row items-center gap-0.5">
                            <input
                            type="number"
                            value={modTask.duration}
                            onChange={(e) => handleDurationChange(e.target.value)}
                            className="relative h-fit w-fit field-sizing-content border border-gray-700 px-1"
                            />
                            <p>m</p>
                        </div>
                    </div>
                    <p>{ modTask.startTime ? (
                            `${getTime(toDate(modTask.startTime))} ${(modTask.duration > 0)
                            ? `→ ${getTime(addDuration(toDate(modTask.startTime), modTask.duration))}`
                            : ""}`
                        ) : (
                            `--:--`
                        )
                    }</p>
                </div>
                <textarea
                    value={modTask.description}
                    onChange={e => setModTask({...modTask, description: e.target.value})}
                    placeholder="description"
                    className={`w-full min-h-50 p-3 border border-gray-700 rounded-2xl outline-none field-sizing-content ${(modTask.name !== "") ? "text-[#f3f4f6]" : ""}`}
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
                    onClick={hasChanged ? handleRevert : null}
                >
                    <UndoDot strokeWidth={2} />
                </button>
                <button
                    className={`px-3 py-1.5 border-2 rounded-full transition-colors duration-200 ease-in-out ${hasChanged ? "bg-green-600 text-[#f3f4f6] border-green-500" : "bg-gray-700 border-gray-600"}`}
                    onClick={hasChanged ? handleSubmit : null}
                >
                    <Save strokeWidth={2} />
                </button>
            </div>
        </div>
    )
}

export default TaskView