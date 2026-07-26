import { createContext, useContext } from "react";
import { createBlockAPI, createTaskAPI, deleteItemAPI, getItemByIdAPI, getTasksByDateRangeAPI, getTasksByDayAPI, getTasksByParentIdAPI, toggleCheckedAPI, updateTaskAPI } from "@/db";
import { Block, DateString, PartialBlock, PartialTask, ScheduleItem, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { createBlockFromDraft } from "@/utils/blockUtils";

interface ItemContextProps {
    //tasks: Task[],
    rootTasks: ScheduleItem[],
    createTask: (task: PartialTask) => void,
    createBlock: (block: PartialBlock) => void,
    editTask: (id: string, modTask: PartialTask) => void,
    deleteItem: (id: string) => void,
    toggleChecked: (id: string) => void,
    getItemById: (id: string) => Promise<ScheduleItem | undefined>,
    getTasksByDay: (day: DateString) => Promise<ScheduleItem[]>,
    getTasksByDateRange: (startDate: DateString, endDate: DateString) => Promise<ScheduleItem[]>,
}

const ItemContext = createContext<ItemContextProps>(null!);

export const ScheduleItemProvider = ({ children }: React.PropsWithChildren) => {
    //const tasks = useTasksQueryAll() ?? [];

    const rootTasks = useLiveQuery(
        () => getTasksByParentIdAPI(""),
        []
    ) ?? [];

    const itemsAPI = {
        deleteItem: (id: string): void => {
            deleteItemAPI(id);
        },

        getItemById: (id: string) => getItemByIdAPI(id),
    }

    const tasksAPI = {
        createTask: (task: PartialTask): void => {
            const id: string = nanoid();
            const validTask: Task = createTaskFromDraft(id,task);
            createTaskAPI(validTask);
        },

        editTask: (id: string, modTask: PartialTask): void => {
            updateTaskAPI(id, modTask);
        },

        toggleChecked: (id: string): void => {
            toggleCheckedAPI(id);
        },

        getTasksByDay: (day: DateString): Promise<ScheduleItem[]> => getTasksByDayAPI(day),

        getTasksByDateRange: (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => getTasksByDateRangeAPI(startDate, endDate),
    }

    const blocksAPI = {
        createBlock: (block: PartialBlock): void => {
            const id: string = nanoid();
            const validBlock: Block = createBlockFromDraft(id,block);
            createBlockAPI(validBlock);
        },
    }

    return (
        <ItemContext.Provider value={{rootTasks, ...itemsAPI, ...tasksAPI, ...blocksAPI}}>
            {children}
        </ItemContext.Provider>
    );
}

export const useScheduleItems = () => {
    const context = useContext(ItemContext);
    return context;
}