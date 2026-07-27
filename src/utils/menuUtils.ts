import { Block, BlockActions, MenuItemInfo } from "@/types";
import { SquarePen, Trash2 } from "lucide-react";

export const blockMenu = (block: Block, actions: BlockActions): MenuItemInfo[] => ([
    { id: "edit", label: "edit", icon: SquarePen, onClick: actions.edit},
    { id: "delete", label: "delete", icon: Trash2, onClick: actions.delete, danger: true},
]);