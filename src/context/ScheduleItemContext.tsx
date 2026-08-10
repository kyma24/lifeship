import { createContext, useContext } from "react";
import { createItemAPI, deleteItemAPI, getItemByIdAPI, getItemsToDisplayAPI, getTasksByDateRangeAPI, getTasksByDayAPI, toggleCheckedAPI, updateItemAPI } from "@/db";
import { Block, DateString, PartialBlock, PartialTask, ScheduleItem, Task } from "@/types";
import { nanoid } from "nanoid";
import { createTaskFromDraft } from "@/utils/taskUtils";
import { useLiveQuery } from "dexie-react-hooks";
import { createBlockFromDraft } from "@/utils/blockUtils";
import { useAuth } from "./AuthContext";
import { todoComparator } from "@/utils/sorting";

interface ItemContextProps {
    //tasks: Task[],
    rootItems: ScheduleItem[],
    createTask: (task: PartialTask) => void,
    createBlock: (block: PartialBlock) => void,
    editTask: (id: string, modTask: PartialTask) => void,
    editBlock: (id: string, modBlock: PartialBlock) => void,
    deleteItem: (id: string) => void,
    toggleChecked: (id: string) => void,
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

        editTask: (id: string, modTask: PartialTask): void => {
            updateItemAPI(id, modTask);
        },

        toggleChecked: (id: string): void => {
            toggleCheckedAPI(id);
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
        <ItemContext.Provider value={{rootItems, ...itemsAPI, ...tasksAPI, ...blocksAPI}}>
            {children}
        </ItemContext.Provider>
    );
}

export const useScheduleItems = () => {
    const context = useContext(ItemContext);
    return context;
}