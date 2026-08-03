
const Divider = ({ color }: {
    color: string,
}) => {
    return (
        <hr className={`w-full border-t border-${color}`} />
    );
};

export default Divider;