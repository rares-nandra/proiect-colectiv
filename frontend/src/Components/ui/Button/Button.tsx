import React from "react";

import {ButtonProps} from "./Button.props";
import styles from "./Button.module.css";

const Button: React.FC<ButtonProps> = ({ onClick, text, icon: Icon, disabled, customizations }) => {
    return (
        <button onClick = {onClick} className = {styles.button} style = {{cursor: disabled ? "default" : "pointer", backgroundColor: disabled ? customizations?.disabledBackgroundColor : customizations?.backgroundColor, color: disabled ? customizations?.disabledForegroundColor : customizations?.foregroundColor, padding: customizations?.padding, fontSize: customizations?.fontSize}}>
            {text && <p className = {styles.text}>{text}</p>}
            {Icon && <Icon className = {styles.icon} />}
        </button>
    );
};

export default Button;