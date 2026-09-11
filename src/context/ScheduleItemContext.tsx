import { createContext, useContext, useMemo, useState } from "react";
import { createItemAPI, deleteItemAPI, getItemByIdAPI, getItemsToDisplayAPI, getTasksByDateRangeAPI, getTasksByDayAPI, toggleCheckedAPI, updateItemAPI, updateTaskAPI, useExceptionsQueryAll } from "@/db";
import { Block, DateString, PartialBlock, PartialTask, RecurrenceException, ScheduleItem, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { createBlockFromDraft } from "@/utils/blockUtils";
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
    editTaskOne: (id: string, exceptionId: string, effectDate: DateString, modTask: PartialTask) => void,
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

                const id: string = nanoid();
                const validTask: Task = createTaskFromDraft(id,{...task, userId});
                createItemAPI(validTask);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editTaskAll: (id: string, modTask: PartialTask): void => {
            try {
                updateTaskAPI(id, modTask);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editTaskOne: (id: string, exceptionId: string, effectDate: DateString, modTask: PartialTask): void => {
            try {
                // no exception on display task?
                if(!exceptionId) {
                    const newExId: string = nanoid();
                    updateTaskAPI(id, modTask, newExId, effectDate);
                } else {
                    updateTaskAPI(id, modTask, exceptionId, effectDate);
                }
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

                const id: string = nanoid();
                const validBlock: Block = createBlockFromDraft(id,{...block, userId});
                createItemAPI(validBlock);
            } catch (err) {
                if(err instanceof Error) setError(err.message);
                else setError(err as string);
            }
        },

        editBlock: (id: string, modBlock: PartialBlock): void => {
            try {
                updateItemAPI(id, modBlock);
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