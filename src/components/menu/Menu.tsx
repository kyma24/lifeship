import { useState } from "react";
import MenuItem from "./MenuItem";
import { autoUpdate, flip, FloatingNode, FloatingPortal, FloatingTree, offset, shift, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";
import { EllipsisVertical } from "lucide-react";
import { MenuItemInfo } from "@/types";

const Menu = ({ items }: {
    items: MenuItemInfo[],
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-end",
        middleware: [offset(10), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        bubbles: false,
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context, { role: "menu" });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const floatingRoot = document.getElementById("floating-root");

    return (
        <FloatingTree>
            <FloatingNode id={nodeId}>
            <button 
                className="flex bg-gray-800 py-1 rounded-full"
                ref={refs.setReference} {...getReferenceProps()}
                onClick={() => setIsOpen(!isOpen)}
            >
                <EllipsisVertical
                    className="size-4"
                    strokeWidth={2}
                />
            </button>

            {isOpen && (
                <FloatingPortal root={floatingRoot}>
                    <div 
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="flex flex-col w-max p-3 gap-3
                                bg-gray-800 border border-gray-700 rounded-lg"
                    >
                        {items.map(item => (
                            <MenuItem 
                                key={item.id}
                                item={item} 
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(!isOpen);
                                }}
                            />
                        ))}
                    </div>
                </FloatingPortal>
            )}
            </FloatingNode>
        </FloatingTree>
    );
};

export default Menu;