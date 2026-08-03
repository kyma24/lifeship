import { BaseItem } from ".";

export interface Block extends BaseItem {
    fixed: boolean;
    variant: "block";
}

export interface BlockActions {
    edit: () => void,
    delete: () => void,
}

export type PartialBlock = Partial<Omit<Block,"id">>;