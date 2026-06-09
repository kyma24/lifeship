import { toMs, getStartOfDay, getEndOfDay } from "@/utils/dateUtils";
import { Dexie } from "dexie"
import { useLiveQuery } from "dexie-react-hooks";
import { RRule } from "rrule";

const db = new Dexie("tasksDatabase")
db.version(1).stores({
    tasks: 'id, parentId, name, description, completed, startTime, duration, deadline, recurrence, timezone, tags',
})

const getNextOccurrence = (task) => {
    if(!task.recurrence) return null;

    const rule = RRule.fromString(task.recurrence.rrule);
    const next = rule.after(new Date());
    return next ? next.getTime() : null;
}

const getPreviousOccurrence = (task) => {
    if(!task.recurrence) return null;

    const rule = RRule.fromString(task.recurrence.rrule);
    const prev = rule.before(new Date());
    return prev ? prev.getTime() : null;
}

export const createTaskAPI = (task) => db.tasks.add(task);
export const updateTaskAPI = (modTask) => db.tasks.update(modTask.id,modTask);
export const deleteTaskAPI = (id) => db.tasks.delete(id);
export const toggleCompleteAPI = async (id) => {
    const task = await db.tasks.get(id);

    if(!task.recurrence) {
        await db.tasks.update(id, { completed: !task.completed });
        return;
    }

    if(!task.completed) {
        const next = getNextOccurrence(task);
        await db.tasks.update(id, {
            startTime: next || task.startTime,
            completed: false
        });
    } else {
        const prev = getPreviousOccurrence(task);
        await db.tasks.update(id, {
            startTime: prev || task.startTime,
            completed: false
        })
    }
}

export const useTasksQueryAll = () =>
    useLiveQuery(() => db.tasks.orderBy("startTime").toArray()) ?? [];

export const getTaskByIdAPI = (id) => db.tasks.get(id);

export const getStrayTasksAPI = () => (
    db.tasks.where({
        startTime: "",
        duration: 0
    }).toArray() ?? []
);

export const getTasksByDayAPI = (today) => (
    db.tasks.where("startTime")
            .between(toMs(getStartOfDay(today)), toMs(getEndOfDay(today)))
            .sortBy("startTime")
);

export const getTasksForDateRange = async (startDate, endDate) => (
    await db.tasks
        .where("startTime")
        .between(toMs(startDate), toMs(endDate))
        .sortBy("startTime")
);