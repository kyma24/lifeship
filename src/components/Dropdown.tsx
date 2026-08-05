import { DropdownOption } from "@/types"
import { autoUpdate, flip, offset, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { useState } from "react";

export default function Dropdown({ currentOption, options, onOptionClick }: {
    currentOption: number,
    options: DropdownOption[],
    onOptionClick: (ind: number) => void
}) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const toggleDropdownOpen = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const { refs, floatingStyles, context } = useFloating({
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
        outsidePress: (event) => !(event.target as HTMLElement).closest("#bottom-sheet-root"),
    });
    const role = useRole(context);

    const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

    return (
        <>
            <button
                ref={refs.setReference} {...getReferenceProps}
                onClick={toggleDropdownOpen}
                className="flex flex-row w-full items-center justify-between p-1
                            border border-gray-600 rounded-md"
            >
                <p>{options[currentOption]?.label ?? ""}</p>
            </button>

            {dropdownOpen && (
                <DropdownList
                    currentOption={currentOption}
                    options={options}
                    onOptionClick={onOptionClick}
                    floatingRef={refs.setFloating}
                    floatingStyles={floatingStyles}
                    getFloatingProps={getFloatingProps}
                />
            )}
        </>
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