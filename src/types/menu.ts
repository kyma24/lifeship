
export interface MenuItemInfo {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string; }>;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
}