import { RecurrenceRule } from "@/types";
import { formatRecurrence } from "@/utils/dateUtils";
import { flip, offset, shift } from "@floating-ui/dom";
import { autoUpdate, FloatingPortal, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { Repeat, X } from "lucide-react";
import { useState } from "react";

const RecurrenceSelector = ({ recurrence }: {
    recurrence: RecurrenceRule | null
}) => {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    const { refs, floatingStyles, context } = useFloating({
        open: popupOpen,
        onOpenChange: setPopupOpen,
        placement: "bottom",
        middleware: [
            offset(8), 
            flip({ 
                fallbackPlacements: [ "top" ],
                padding: 5 
            }), 
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
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
                <div
                    ref={refs.setFloating} {...getFloatingProps}
                    style={floatingStyles}
                    className="flex flex-col w-max p-3
                                bg-gray-800 border border-gray-700 rounded-lg"
                >
                    ...
                </div>
            )}
        </>
    );
};

export default RecurrenceSelector;