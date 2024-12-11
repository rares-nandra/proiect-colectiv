import React, {useState, useEffect} from "react";

import {TextInputProps} from "./TextInput.props";
import styles from "./TextInput.module.css";

const TextInput: React.FC<TextInputProps> = ({ onChange, initialValue, isValidInput, customizations }) => {
    const [lastValidInput, setLastValidInput] = useState<string>(initialValue ? initialValue : "");
    const [value, setValue] = useState<string>(initialValue ? initialValue : "");

    useEffect(() => {
        if(initialValue)
        {
            setLastValidInput(initialValue);
            setValue(initialValue);  
        }
    }, [initialValue]);

    const handleChange = (newValue: string) => {
        setValue(newValue);

        if(!isValidInput)
        {
            onChange(newValue);
        }
    };

    const handleBlur = () => {
        if(!isValidInput)
        {
            return;
        }

        if(isValidInput(value))
        {
            setLastValidInput(value);
            onChange(value);
            return;
        }

        setValue(lastValidInput);
    };

    return (
        <input type = "text" value = {value} onChange = {(event) => {handleChange(event.target.value)}} onBlur = {handleBlur} className = {styles.textInput} style = {{width: customizations?.width, height: customizations?.height, backgroundColor: customizations?.backgroundColor, color: customizations?.foregroundColor, fontSize: customizations?.fontSize}} />
    );
};

export default TextInput;