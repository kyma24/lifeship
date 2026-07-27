import { MenuItemInfo } from "@/types";

const MenuItem = ({ item }: {
    item: MenuItemInfo
}) => {
    return (
        <div
            className="flex flex-row gap-2 items-center"
            onClick={item.onClick}
        >
            <div>{item.icon && <item.icon className="size-5" /> }</div>
            <p>{item.label}</p>
        </div>
    );
};

export default MenuItem;