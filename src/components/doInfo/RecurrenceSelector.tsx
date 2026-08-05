import { RecurrenceRule } from "@/types";
import { recurrenceDropdown } from "@/utils/constants";
import { createWeeklyRRule, formatRRule } from "@/utils/dateUtils";
import { flip, offset, shift } from "@floating-ui/dom";
import { autoUpdate, FloatingNode, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";
import { Repeat, X } from "lucide-react";
import { useState } from "react";
import { DropdownList } from "../Dropdown";
import { useBottomSheet } from "@/context/BottomSheetContext";
import CustomRecurSheet from "./CustomRecurSheet";

export default function RecurrenceSelector({ recurrence, onChange }: {
    recurrence: RecurrenceRule | null,
    onChange: (rrule: string | null) => void
}) {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const [recurDisplay, setRecurDisplay] = useState<string>(recurrence ? formatRRule(recurrence.rrule) : "repeat");
    const [curRRule, setCurRRule] = useState<string | null>(recurrence?.rrule ?? null);

    const { openSheet, closeSheet } = useBottomSheet();

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    const handleCustomSubmit = (byDayArr: boolean[], everyXWeeks: number) => {
        const newRRule = createWeeklyRRule(byDayArr, everyXWeeks);
        setCurRRule(newRRule);
        onChange(newRRule);
        
        setRecurDisplay(formatRRule(newRRule));
        togglePopupOpen();
    }

    const handleRecurChange = (ind: number) => {
        if(!recurrenceDropdown[ind]) return;
        if(recurrenceDropdown[ind].label==="Custom") {
            openSheet(
                CustomRecurSheet,
                { 
                    curRRule: recurrence?.rrule ?? null,
                    onSubmit: handleCustomSubmit, 
                    onClose: closeSheet 
                }
            );
        } else {
            setCurRRule(recurrenceDropdown[ind].meta ?? null);
            togglePopupOpen();
        }
    };

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
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
        bubbles: false,
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
    
    return (
        <FloatingNode id={nodeId}>
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
                    
                    { recurDisplay }
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
        </FloatingNode>
    );
}