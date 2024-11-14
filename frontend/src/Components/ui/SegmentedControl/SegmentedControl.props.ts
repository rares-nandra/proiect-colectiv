import { IconType } from "react-icons";

export interface SegmentedControlProps {
    onChange: (selectedNameId: string) => void;

    selections: Array<{
        id: string;
        name: string;
        icon?: IconType;
        description?: string;
        highlightText?: string;
    }>    

    customizations?: {
        backgroundColor?: string;
        foregroundColor?: string;
        backgroundColorActive?: string;
        foregroundColorActive?: string;
        highlightColor?: string;
        fontSize?: string;
        padding?: string;
        widthBehaviour?: "default" | "scrollAll" | "scrollIndividual" | "scrollIndividualFillParent" | "overflow";
    }
}