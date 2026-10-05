import { autoUpdate, FloatingNode, FloatingPortal, FloatingTree, offset, shift, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";
import { CircleCheckBig, Ellipsis, Trash } from "lucide-react";
import { useState } from "react";
import Divider from "../Divider";

const MenuButton = ({ onCheck, onCheckAll, onDelete }: {
    onCheck: () => void,
    onCheckAll: () => void,
    onDelete: () => void
}) => {
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const togglePopupOpen = () => {
        setPopupOpen(!popupOpen);
    };

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
        open: popupOpen,
        onOpenChange: setPopupOpen,
        placement: "bottom-end",
        middleware: [
            offset(3),
            shift({ padding: 8 })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        bubbles: false,
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context, { role: "combobox" });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const floatingRoot = document.getElementById("floating-root");

    return (
        <FloatingTree>
            <FloatingNode id={nodeId}>
                <button 
                    onClick={togglePopupOpen}
                    ref={refs.setReference} {...getReferenceProps}
                    className="w-fit h-fit"
                >
                    <Ellipsis strokeWidth={2} />
                </button>

                { popupOpen && (
                    <FloatingPortal root={floatingRoot}>
                        <div
                            ref={refs.setFloating} {...getFloatingProps}
                            style={floatingStyles}
                            className="flex flex-col w-max min-w-50
                                        bg-gray-800 border border-gray-700 rounded-lg
                                        p-3 gap-2"
                        >
                            {/* checking (todo: only render for recurring tasks) */}
                            <button
                                className="flex flex-row items-center gap-2"
                                onClick={onCheck}
                            >
                                <CircleCheckBig
                                    strokeWidth={2}
                                    className="size-4"
                                />
                                Check
                            </button>
                            <button
                                className="flex flex-row items-center gap-2"
                                onClick={onCheckAll}
                            >
                                <CircleCheckBig
                                    strokeWidth={2}
                                    className="size-4"
                                />
                                Check All
                            </button>

                            <Divider color="gray-700" />

                            {/* deletion */}
                            <button
                                className="flex flex-row items-center gap-2 text-red-500"
                                onClick={onDelete}
                            >
                                <Trash
                                    strokeWidth={2}
                                    className="size-4"
                                />
                                Delete
                            </button>
                        </div>
                    </FloatingPortal>
                )}
            </FloatingNode>
        </FloatingTree>
    );
};

export default MenuButton;