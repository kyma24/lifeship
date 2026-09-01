import { Save } from "lucide-react";

const SaveButton = ({ onSubmit, isActive }: {
    onSubmit: ()=>void,
    isActive: boolean
}) => {
    return (
        <button
            className={`px-3 py-1.5 border-2 rounded-full transition-colors duration-200 ease-in-out
                    ${isActive ? "bg-green-600 text-[#f3f4f6] border-green-500" : "bg-gray-700 border-gray-600"}`}
            onClick={isActive ? onSubmit : undefined}
        >
            <Save strokeWidth={2} />
        </button>
    );
};

export default SaveButton;