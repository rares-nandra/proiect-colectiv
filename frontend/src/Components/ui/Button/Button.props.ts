import { IconType } from "react-icons";

export interface ButtonProps {
    onClick: () => void;
    text?: string;
    icon?: IconType;
    disabled?: boolean;
    customizations?: {
        backgroundColor?: string;
        foregroundColor?: string;
        disabledBackgroundColor?: string;
        disabledForegroundColor?: string;
        padding?: string;
        fontSize?: string;
    };
}