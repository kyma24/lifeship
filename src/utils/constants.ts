import { Block, BlockActions, MenuItemInfo, PartialTask, PartialBlock, DropdownOption } from "@/types";
import { SquarePen, Trash2 } from "lucide-react";
import { getTimezone } from "./dateUtils";

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

export const timezoneDropdown: DropdownOption[] = [
  { label: "Floating time", description: "Time stays the same across time zones", meta: null },
  { label: `${getTimezone()}`, description: "Your current time zone", meta: getTimezone() }
];

export const recurrenceDropdown: DropdownOption[] = [
  { label: "Every day", meta: "FREQ=DAILY" },
  { label: "Custom" },
];

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const rruleWeekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];