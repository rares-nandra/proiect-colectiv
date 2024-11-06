export interface ButtonProps {
    onClick: () => void;
    text: string;
    customizations?: {
        backgroundColor?: string;
        foregroundColor?: string;
        padding?: string;
        fontSize?: string;
    };
}