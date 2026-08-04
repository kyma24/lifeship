
export interface MenuItemInfo {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string; }>;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
}

export interface DropdownOption {
    label: string;
    description?: string;
    meta?: string | null;
}