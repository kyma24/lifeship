import { useState } from "react";
import MenuItem from "./MenuItem";
import { autoUpdate, flip, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { EllipsisVertical } from "lucide-react";
import { MenuItemInfo } from "@/types";

const Menu = ({ items }: {
    items: MenuItemInfo[],
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-end",
        middleware: [offset(10), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "menu" });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    return (
        <>
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
                <FloatingPortal>
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
        </>
    );
};

export default Menu;