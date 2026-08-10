import BucketHeader from "./BucketHeader";

const Bucket = ({ name, isExpanded, onExpandToggle, children, className="" }: {
    name: string,
    isExpanded: boolean,
    onExpandToggle: () => void,
    children: React.ReactNode,
    className?: string
}) => {
    return (
        <div className="flex flex-col gap-2">
            <BucketHeader
                name={name}
                isExpanded={isExpanded}
                onExpandClick={onExpandToggle}
            />
            { isExpanded &&
                <div className={className}>
                    {children}
                </div>
            }
        </div>
    );
};

export default Bucket;