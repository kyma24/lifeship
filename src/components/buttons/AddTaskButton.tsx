import { MouseEventHandler } from "react"

const AddTaskButton = ({ onClick }: {
    onClick: MouseEventHandler<HTMLButtonElement>
}) => {
    return (
        <button
            className="h-12 aspect-square rounded-full flex justify-center items-center p-1 bg-amber-100"
            onClick={onClick}
        >
            <p className="font-dongle text-[3rem] h-4 text-amber-900">+</p>
        </button>
    );
}

export default AddTaskButton;