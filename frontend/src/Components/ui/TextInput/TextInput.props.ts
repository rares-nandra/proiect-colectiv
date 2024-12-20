import { StringLiteralType } from "typescript";

export interface TextInputProps {
    onChange: (value: any) => void;
    initialValue?: string;
    isValidInput?: (value: string) => boolean;
    customizations?: {
        backgroundColor?: string;
        foregroundColor?: string;
        fontSize?: string;
        height?: number;
        width?: string;
    };
    type ?: string
}