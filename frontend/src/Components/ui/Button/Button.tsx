import React from "react";

import {ButtonProps} from "./Button.props";
import styles from "./Button.module.css";

const Button: React.FC<ButtonProps> = ({ onClick, text, customizations }) => {
    return (
        <button className = {styles.button} onClick = {onClick} style = {{backgroundColor: customizations?.backgroundColor, padding: customizations?.fontSize}}>
            <p className = {styles.text} style = {{color: customizations?.foregroundColor, fontSize: customizations?.fontSize}}>{text}</p>
        </button>
    );
};

export default Button;