import React from "react";
import { DockProps } from "./Dock.props";
import styles from "./Dock.module.css";

const Dock: React.FC<DockProps> = ({ onChange, activeElementId, elements }) => {
    return (
        <div className = {styles.outerContainer}>
        <nav className = {styles.container}>
            {elements.map((element, index) => (
                <div key = {index} className = {styles.element} onClick = {() => onChange(element.id)}>
                    <element.icon className = {styles.elementIcon} style = {{color: element.id === activeElementId ? "var(--background-accent)" : "var(--text-primary)"}} />
                </div>
            ))}
        </nav>
        </div>
    );
};

export default Dock;