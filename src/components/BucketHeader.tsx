import { ChevronDown, ChevronUp } from "lucide-react";

const BucketHeader = ({ name, isExpanded, onExpandClick }: {
    name: string,
    isExpanded: boolean,
    onExpandClick: () => void
}) => {

    return (
        <div className="flex flex-row w-full items-center justify-between px-3">
            <p className="text-lg font-semibold text-left">{name}</p>

            <button onClick={onExpandClick}>
                { (isExpanded)
                    ? (
                        <ChevronUp
                            strokeWidth={2}
                            className="size-6"
                        />
                    ) : (
                        <ChevronDown
                            strokeWidth={2}
                            className="size-6"
                        />
                    )
                }
            </button>
        </div>
    );
};

export default BucketHeader;