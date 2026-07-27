import { Block, PartialBlock } from "@/types";

export const defaultBlock: PartialBlock = {
  name: "",
  parentId: "",
  description: "",
  tags: [],
  doDate: null,
  variant: "block"
}

export const createBlockFromDraft = (id: string, draftBlock: PartialBlock): Block => (
    {
        id: id,
        name: draftBlock.name ?? "",
        description: draftBlock.description ?? "",
        parentId: draftBlock.parentId ?? undefined,
        childOrder: draftBlock.childOrder ?? undefined,
        tags: draftBlock.tags ?? [],
        doDate: draftBlock.doDate ?? null,
        isDeleted: draftBlock.isDeleted ?? false,
        variant: draftBlock.variant ?? "block",
    } as Block
);

export const getPartialBlock = (block: Block): PartialBlock => {
    const {id, ...noIdBlock} = block;
    return noIdBlock;
}