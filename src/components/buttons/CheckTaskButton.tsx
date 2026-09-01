import { MouseEventHandler } from "react";

const CheckTaskButton = ({checked, onChange, className}: {
    checked: boolean,
    onChange: MouseEventHandler<HTMLButtonElement>,
    className?: string
}) => {
    return (
        <button
            onClick={onChange}
            className={`flex justify-center items-center p-4 ${className ?? ""}`}
        >
            <div
                className={
                    `w-6 h-6 p-3 -m-3 rounded-full border-2 shrink-0
                    flex items-center justify-center
                    transition duration-150
                    ${checked
                        ? "bg-amber-100 border-amber-100"
                        : "border-gray-400 bg-transparent active:border-amber-100"
                    }`}
                aria-label={checked ? "uncheck" : "check"}
            />
        </button>
    );
}

export default CheckTaskButton;