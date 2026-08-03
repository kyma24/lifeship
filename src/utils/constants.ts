import { Block, BlockActions, MenuItemInfo, PartialTask, PartialBlock } from "@/types";
import { SquarePen, Trash2 } from "lucide-react";

export const defaultTask: PartialTask = {
  name: "",
  parentId: "",
  description: "",
  tags: [],
  doInfo: null,
  checked: false,
  variant: "task"
}

export const defaultBlock: PartialBlock = {
  name: "",
  parentId: "",
  description: "",
  tags: [],
  doInfo: null,
  variant: "block"
}

export const blockMenu = (block: Block, actions: BlockActions): MenuItemInfo[] => ([
    { id: "edit", label: "edit", icon: SquarePen, onClick: actions.edit},
    { id: "delete", label: "delete", icon: Trash2, onClick: actions.delete, danger: true},
]);