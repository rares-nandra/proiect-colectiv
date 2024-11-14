import React, {useState} from "react";

import {SegmentedControlProps} from "./SegmentedControl.props";
import styles from "./SegmentedControl.module.css";

const SegmentedControl: React.FC<SegmentedControlProps> = ({ onChange, selections, customizations }) => {
    const [selectedSelection, setSelectedSelection] = useState<number>(0);

    const handleSelectionSelected = (index: number, id: string) => {
        setSelectedSelection(index);
        onChange(id);
    };

    return (
        <div className = {`${styles.container} ${customizations?.widthBehaviour === "scrollAll" ? styles.containerScrollAll : customizations?.widthBehaviour === "scrollIndividual" ? styles.containerScrollIndividual : customizations?.widthBehaviour === "scrollIndividualFillParent" ? styles.containerScrollIndividualFillParent : customizations?.widthBehaviour === "overflow" ? styles.containerOverflow : ""}`}>
            {selections.map((selection, index) => (
                <div key = {index} className = {`${styles.containerSelection} ${index === selectedSelection ? styles.containerSelectionActive : ""}`} style = {{backgroundColor: index === selectedSelection ? customizations?.backgroundColorActive : customizations?.backgroundColor, padding: customizations?.padding}} title = {selection.description || undefined} onClick = {() => handleSelectionSelected(index, selection.id)}>
                    <p className = {styles.selectionText} style = {{color: index === selectedSelection ? customizations?.foregroundColorActive : customizations?.foregroundColor, fontSize: customizations?.fontSize}}>
                        {selection.name}
                        {selection.highlightText && (
                            <span style = {{color: customizations?.highlightColor, fontSize: customizations?.fontSize}}>{selection.highlightText}</span>
                        )}
                    </p>
                    {selection.icon && (
                        <selection.icon className = {styles.selectionIcon} style = {{color: index === selectedSelection ? customizations?.foregroundColorActive : customizations?.foregroundColor, fontSize: customizations?.fontSize}}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SegmentedControl;