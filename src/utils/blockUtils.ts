import { Block, PartialBlock } from "@/types";
import { nowISO } from "./dateUtils";
import { getDeviceId } from "./backend/device";

export const createBlockFromDraft = (id: string, draftBlock: PartialBlock): Block => (
    {
        id: id,
        name: draftBlock.name ?? "",
        description: draftBlock.description ?? "",
        parentId: draftBlock.parentId ?? "",
        childOrder: draftBlock.childOrder ?? 0,
        tags: draftBlock.tags ?? [],
        doInfo: draftBlock.doInfo ?? null,
        variant: draftBlock.variant ?? "block",
        fixed: draftBlock.fixed ?? false,
                
        deletedAt: draftBlock.deletedAt ?? "",
        updatedAt: nowISO(),
        createdAt: draftBlock.createdAt ?? nowISO(),
        deviceId: getDeviceId(),
        userId: draftBlock.userId,
        dirty: true,
    } as Block
);

export const getPartialBlock = (block: Block): PartialBlock => {
    const {id, ...noIdBlock} = block;
    return noIdBlock;
}