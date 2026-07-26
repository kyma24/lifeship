import { BaseItem } from ".";

export interface Block extends BaseItem {
    variant: "block";
}

export type PartialBlock = Partial<Omit<Block,"id">>;