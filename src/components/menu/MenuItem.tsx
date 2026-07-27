import { MenuItemInfo } from "@/types";

const MenuItem = ({ item, onClick }: {
    item: MenuItemInfo,
    onClick: () => void
}) => {
    return (
        <div
            className={`flex flex-row gap-2 items-center ${item.danger && "text-red-500"}`}
            onClick={onClick}
        >
            <div>{item.icon && <item.icon className="size-5" /> }</div>
            <p>{item.label}</p>
        </div>
    );
};

export default MenuItem;