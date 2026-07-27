import { Block, MenuItemInfo } from "@/types";
import { SquarePen, Trash2 } from "lucide-react";

export const blockMenu = (block: Block, handleDelete: ()=>void): MenuItemInfo[] => ([
    { id: "delete", label: "delete", icon: Trash2, onClick: handleDelete, danger: true},
    { id: "edit", label: "edit", icon: SquarePen, onClick: ()=>""},
]);