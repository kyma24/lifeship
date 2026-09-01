import { createContext, useContext, useMemo } from "react";
import { createItemAPI, deleteItemAPI, getItemByIdAPI, getItemsToDisplayAPI, getTasksByDateRangeAPI, getTasksByDayAPI, toggleCheckedAPI, toggleCheckedEXAPI, updateItemAPI, updateTaskAPI, useExceptionsQueryAll } from "@/db";
import { Block, DateString, PartialBlock, PartialTask, RecurrenceException, ScheduleItem, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { createBlockFromDraft } from "@/utils/blockUtils";
import { useAuth } from "./AuthContext";
import { todoComparator } from "@/utils/sorting";

interface ItemContextProps {
    //tasks: Task[],
    rootItems: ScheduleItem[],
    rootExceptions: RecurrenceException[],
    createTask: (task: PartialTask) => void,
    createBlock: (block: PartialBlock) => void,
    editTaskAll: (id: string, modTask: PartialTask) => void,
    editTaskOne: (id: string, exceptionId: string, effectDate: DateString, modTask: PartialTask) => void,
    editBlock: (id: string, modBlock: PartialBlock) => void,
    deleteItem: (id: string) => void,
    toggleChecked: (id: string) => void,
    toggleCheckedEX: (id: string, date: DateString) => void,
    getItemById: (id: string) => Promise<ScheduleItem | undefined>,
    getTasksByDay: (day: DateString) => Promise<ScheduleItem[]>,
    getTasksByDateRange: (startDate: DateString, endDate: DateString) => Promise<ScheduleItem[]>,
}

const ItemContext = createContext<ItemContextProps>(null!);

export const ScheduleItemProvider = ({ children }: React.PropsWithChildren) => {

    const { userId } = useAuth();

    const rootItems = useLiveQuery(() => (
        getItemsToDisplayAPI()
    ), [])?.sort(todoComparator) ?? [];

    const rootExceptions = useExceptionsQueryAll() ?? [];

    const itemsAPI = {
        deleteItem: (id: string): void => {
            deleteItemAPI(id);
        },

        getItemById: (id: string) => getItemByIdAPI(id),
    }

    const tasksAPI = {
        createTask: (task: PartialTask): void => {
            if(!userId) return;
            const id: string = nanoid();
            const validTask: Task = createTaskFromDraft(id,{...task, userId});
            createItemAPI(validTask);
        },

        editTaskAll: (id: string, modTask: PartialTask): void => {
            updateTaskAPI(id, modTask);
        },

        editTaskOne: (id: string, exceptionId: string, effectDate: DateString, modTask: PartialTask): void => {
            // no exception on display task?
            if(!exceptionId) {
                const newExId: string = nanoid();
                updateTaskAPI(id, modTask, newExId, effectDate);
            } else {
                updateTaskAPI(id, modTask, exceptionId, effectDate);
            }
        },

        toggleChecked: (id: string): void => {
            toggleCheckedAPI(id);
        },

        toggleCheckedEX: (id: string, date: DateString): void => {
            toggleCheckedEXAPI(id, date);
        },

        getTasksByDay: (day: DateString): Promise<ScheduleItem[]> => getTasksByDayAPI(day),

        getTasksByDateRange: (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => getTasksByDateRangeAPI(startDate, endDate),
    }

    const blocksAPI = {
        createBlock: (block: PartialBlock): void => {
            if(!userId) return;
            const id: string = nanoid();
            const validBlock: Block = createBlockFromDraft(id,{...block, userId});
            createItemAPI(validBlock);
        },

        editBlock: (id: string, modBlock: PartialBlock): void => {
            updateItemAPI(id, modBlock);
        },
    }

    return (
        <ItemContext.Provider value={{rootItems, rootExceptions, ...itemsAPI, ...tasksAPI, ...blocksAPI}}>
            {children}
        </ItemContext.Provider>
    );
}

export const useScheduleItems = () => {
    const context = useContext(ItemContext);
    return context;
}