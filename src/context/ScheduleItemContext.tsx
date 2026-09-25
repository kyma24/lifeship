import { createContext, useContext, useState } from "react";
import { createBlockAPI, createTaskAPI, deleteItemAPI, getItemByIdAPI, getItemsToDisplayAPI, getTasksByDateRangeAPI, getTasksByDayAPI, toggleCheckedAPI, updateItem, updateTask, useExceptionsQueryAll } from "@/db";
import { DateString, PartialBlock, PartialTask, RecurrenceException, ScheduleItem } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuth } from "./AuthContext";
import { todoComparator } from "@/utils/sorting";

interface ItemContextProps {
    error: string | null,
    //tasks: Task[],
    rootItems: ScheduleItem[],
    rootExceptions: RecurrenceException[],
    createTask: (task: PartialTask) => void,
    createBlock: (block: PartialBlock) => void,
    editTaskAll: (id: string, modTask: PartialTask) => void,
    editTaskOne: (id: string, modTask: PartialTask, effectDate: DateString) => void,
    editBlock: (id: string, modBlock: PartialBlock) => void,
    deleteItem: (id: string) => void,
    toggleChecked: (id: string, date?: DateString) => void,
    getItemById: (id: string) => Promise<ScheduleItem | undefined>,
    getTasksByDay: (day: DateString) => Promise<ScheduleItem[]>,
    getTasksByDateRange: (startDate: DateString, endDate: DateString) => Promise<ScheduleItem[]>,
}

const ItemContext = createContext<ItemContextProps>(null!);

export const ScheduleItemProvider = ({ children }: React.PropsWithChildren) => {
    const [error, setError] = useState<string | null>(null);

    const { userId } = useAuth();

    const rootItems = useLiveQuery(() => (
        getItemsToDisplayAPI()
    ), [])?.sort(todoComparator) ?? [];

    const rootExceptions = useExceptionsQueryAll() ?? [];

    const itemsAPI = {
        deleteItem: (id: string): void => {
            try {
                deleteItemAPI(id);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        getItemById: (id: string) => getItemByIdAPI(id)
    }

    const tasksAPI = {
        createTask: (task: PartialTask): void => {
            try {
                if(!userId) throw new Error("User not found");
                createTaskAPI(task, userId);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editTaskAll: (id: string, modTask: PartialTask): void => {
            try {
                updateTask(id, modTask);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editTaskOne: (id: string, taskUpdates: PartialTask, effectDate: DateString): void => {
            try {
                updateTask(id, taskUpdates, effectDate);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        toggleChecked: (id: string, date?: DateString): void => {
            try {
                toggleCheckedAPI(id, date);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        getTasksByDay: (day: DateString): Promise<ScheduleItem[]> => getTasksByDayAPI(day),

        getTasksByDateRange: (startDate: DateString, endDate: DateString): Promise<ScheduleItem[]> => getTasksByDateRangeAPI(startDate, endDate),
    }

    const blocksAPI = {
        createBlock: (block: PartialBlock): void => {
            try {
                if(!userId) throw new Error("User not found");
                createBlockAPI(block, userId);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editBlock: (id: string, modBlock: PartialBlock): void => {
            try {
                updateItem(id, modBlock);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },
    }

    return (
        <ItemContext.Provider value={{error, rootItems, rootExceptions, ...itemsAPI, ...tasksAPI, ...blocksAPI}}>
            {children}
        </ItemContext.Provider>
    );
}

export const useScheduleItems = () => {
    const context = useContext(ItemContext);
    return context;
}