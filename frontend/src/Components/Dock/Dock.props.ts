import { IconType } from "react-icons";

export interface DockElement {
    id: string;
    icon: IconType;
};

export interface DockProps {
    onChange: (id: string) => void;
    activeElementId: string;
    elements: Array<DockElement>;
}