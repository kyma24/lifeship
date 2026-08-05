import { RecurrenceRule } from "@/types";
import { recurrenceDropdown } from "@/utils/constants";
import { formatRecurrence } from "@/utils/dateUtils";
import { flip, offset, shift } from "@floating-ui/dom";
import { autoUpdate, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { Repeat, X } from "lucide-react";
import { useState } from "react";
import { DropdownList } from "../Dropdown";
import { useBottomSheet } from "@/context/BottomSheetContext";
import CustomRecurSheet from "./CustomRecurSheet";

export default function RecurrenceSelector({ recurrence }: {
    recurrence: RecurrenceRule | null
}) {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const [curRRule, setCurRRule] = useState<string | null>(recurrence?.rrule ?? null);

    const { openSheet, closeSheet } = useBottomSheet();

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    const tempOnSubmit = (byDayArr: boolean[]) => {
        return null;
    }

    const handleRecurChange = (ind: number) => {
        if(!recurrenceDropdown[ind]) return;
        if(recurrenceDropdown[ind].label==="Custom") {
            openSheet(
                CustomRecurSheet,
                { onSubmit: tempOnSubmit, onClose: closeSheet }
            );
        } else {
            setCurRRule(recurrenceDropdown[ind].meta ?? null); 
        }
    };

    const { refs, floatingStyles, context } = useFloating({
        open: popupOpen,
        onOpenChange: setPopupOpen,
        placement: "bottom",
        middleware: [
            offset(8), 
            flip({ 
                fallbackPlacements: [ 
                    "bottom-end",
                    "bottom-start",
                    "top",
                    "top-end",
                    "top-start"
                ],
                padding: 5 
            }), 
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
    
    return (
        <>
            <div
                onClick={togglePopupOpen}
                ref={refs.setReference} {...getReferenceProps}
                className="flex flex-row items-center justify-between w-full 
                    border border-gray-700 p-1"
            >
                <div className="flex flex-row w-full items-center justify-center gap-2">
                    <Repeat 
                        strokeWidth={2} 
                        className="size-4"
                    />
                    { (!recurrence?.rrule)
                        ? "repeat"
                        : formatRecurrence(recurrence)
                    }
                </div>

                { recurrence?.rrule && (
                    <button className="p-1">
                        <X
                            strokeWidth={2}
                            className="size-4"
                        />
                    </button>
                )}
            </div>

            {popupOpen && (
                <DropdownList
                    currentOption={-1}
                    options={recurrenceDropdown}
                    onOptionClick={handleRecurChange}
                    floatingRef={refs.setFloating}
                    floatingStyles={floatingStyles}
                    getFloatingProps={getFloatingProps}
                    className="w-60"
                />
            )}
        </>
    );
}