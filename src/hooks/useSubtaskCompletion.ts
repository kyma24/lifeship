import { getSubtaskCheckedCountAPI } from "@/db"
import { useLiveQuery } from "dexie-react-hooks"

const useSubtaskCompletion = (parentId: string) => {
    return useLiveQuery(
        () => getSubtaskCheckedCountAPI(parentId),
        [parentId]
    );
}

export default useSubtaskCompletion;