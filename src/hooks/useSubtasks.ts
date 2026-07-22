import { getTasksByParentIdAPI } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"

const useSubtasks = (parentId: string) => {
    const subtasks = useLiveQuery(
        () => getTasksByParentIdAPI(parentId),
        [parentId]
    );

    return { subtasks };
}

export default useSubtasks;