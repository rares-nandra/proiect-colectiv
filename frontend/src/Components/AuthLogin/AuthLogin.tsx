import React from "react";

import styles from "./AuthLogin.module.css";

import TextInput from "../ui/TextInput/TextInput";
import Button from "../ui/Button/Button";

const AuthLogin: React.FC = () => {
    const onClickLogin = () => {

    };

    return (
        <div className = {styles.container}>
            <div className = {styles.containerHeader}>
                <h1 className = {styles.title}>Log in</h1>
            </div>

            <div className = {styles.formContainer}>
                <div className = {styles.formSection}>
                    <p className = {styles.formSectionName}>email</p>
                    
                    <div className = {styles.hackyUnderline}>
                        <TextInput onChange = {() => {}} customizations = {{backgroundColor: "rgba(0, 0, 0, 0)", foregroundColor: "var(--text-primary", fontSize: "20px"}} />
                    </div>
                </div>
            
                <div className = {styles.formSection}>
                    <p className = {styles.formSectionName}>password</p>
                    
                    <div className = {styles.hackyUnderline}>
                        <TextInput onChange = {() => {}} customizations = {{backgroundColor: "rgba(0, 0, 0, 0)", foregroundColor: "var(--text-primary", fontSize: "20px"}} />
                    </div>
                </div>
            </div>

            <div className = {styles.actionContainer}>
                <Button onClick = {onClickLogin} text = {"log in"} customizations = {{backgroundColor: "var(--background-accent)", foregroundColor: "var(--text-accent)", padding: "7px 30px", fontSize: "20px"}} />
            </div>
        </div>
    );
};

export default AuthLogin;