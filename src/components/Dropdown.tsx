import { DropdownOption } from "@/types"
import { autoUpdate, flip, FloatingNode, offset, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Dropdown({ currentOption, options, onOptionClick, closeOnClick=false, className="", listClassName="" }: {
    currentOption: number,
    options: DropdownOption[],
    onOptionClick: (ind: number) => void,
    closeOnClick?: boolean,
    className?: string,
    listClassName?: string
}) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const toggleDropdownOpen = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (ind: number) => {
        onOptionClick(ind);
        if(closeOnClick) toggleDropdownOpen();
    }

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
        open: dropdownOpen,
        onOpenChange: toggleDropdownOpen,
        placement: "bottom-start",
        middleware: [
            offset(5),
            flip({
                fallbackPlacements: [
                    "bottom-end",
                    "top-start",
                    "top-end"
                ],
                padding: 5
            })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context, {
        bubbles: false,
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context);

    const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

    return (
        <FloatingNode id={nodeId}>
            <button
                ref={refs.setReference} {...getReferenceProps}
                onClick={toggleDropdownOpen}
                className={`flex flex-row w-full items-center justify-between p-1
                            border border-gray-600 rounded-md
                            ${className}`}
            >
                <p>{options[currentOption]?.label ?? ""}</p>
                <ChevronDown
                    strokeWidth={2}
                    className="size-6"
                />
            </button>

            {dropdownOpen && (
                <DropdownList
                    currentOption={currentOption}
                    options={options}
                    onOptionClick={handleOptionClick}
                    floatingRef={refs.setFloating}
                    floatingStyles={floatingStyles}
                    getFloatingProps={getFloatingProps}
                    className={listClassName}
                />
            )}
        </FloatingNode>
    )
}

export function DropdownList({ currentOption, options, onOptionClick, floatingRef, floatingStyles, getFloatingProps, className }: {
    currentOption: number,
    options: DropdownOption[],
    onOptionClick: (ind: number) => void,
    floatingRef: React.Ref<HTMLUListElement>,
    floatingStyles: React.CSSProperties,
    getFloatingProps: ()=>Record<string,unknown>,
    className?: string
}) {
    return (
        <ul
            ref={floatingRef} {...getFloatingProps}
            style={floatingStyles}
            className={`flex flex-col w-50 p-2 gap-2
                        bg-gray-800 border border-gray-700 rounded-lg
                        ${className ?? ""}`}
        >
            {options.map((option, ind) => (
                <DropdownItem
                    key={ind}
                    info={option}
                    onClick={() => onOptionClick(ind)}
                    isCurrent={ind===currentOption}
                />
            ))}
        </ul>
    );
}

function DropdownItem({ info, onClick, isCurrent }: {
    info: DropdownOption,
    onClick: ()=>void,
    isCurrent: boolean
}) {
    return (
        <li>
            <button
                onClick={onClick}
                className={`flex flex-col w-full rounded-md p-2
                    ${isCurrent ? "bg-gray-700" : ""} text-left`}
            >
                <p className="font-bold">{info.label}</p>
                <p className="leading-5">{info.description}</p>
            </button>
        </li>
    );
}