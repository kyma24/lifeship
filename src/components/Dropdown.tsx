import { DropdownOption } from "@/types"
import { autoUpdate, flip, offset, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { useState } from "react";

export default function Dropdown({ currentOption, options }: {
    currentOption: number,
    options: DropdownOption[]
}) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const toggleDropdownOpen = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const { refs, floatingStyles, context } = useFloating({
        open: dropdownOpen,
        onOpenChange: toggleDropdownOpen,
        placement: "bottom",
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ["top"],
                padding: 5
            })
        ],
        whileElementsMounted: autoUpdate
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
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
                <ul
                    ref={refs.setFloating} {...getFloatingProps}
                    style={floatingStyles}
                    className="flex flex-col w-50 p-2 gap-2
                                bg-gray-800 border border-gray-700 rounded-lg"
                >
                    {options.map((option, ind) => (
                        <DropdownItem
                            key={ind}
                            info={option}
                            isCurrent={ind===currentOption}
                        />
                    ))}
                </ul>
            )}
        </>
    )
}

function DropdownItem({ info, isCurrent }: {
    info: DropdownOption
    isCurrent: boolean
}) {
    return (
        <li>
            <button
                onClick={info.onClick}
                className={`flex flex-col w-full rounded-md p-2
                    ${isCurrent ? "bg-gray-700" : ""} text-left`}
            >
                <p className="font-bold">{info.label}</p>
                <p className="leading-5">{info.description}</p>
            </button>
        </li>
    );
}