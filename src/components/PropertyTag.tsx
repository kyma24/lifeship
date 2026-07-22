
const PropertyTag = ({ name, onClick }: {
    name: string,
    onClick: () => void
}) => {
    return (
        <div
            className="py-1 p-2 text-gray-500 border border-gray-800 rounded-md"
            onClick={onClick}
        >
            {name}
        </div>
    );
};

export default PropertyTag;