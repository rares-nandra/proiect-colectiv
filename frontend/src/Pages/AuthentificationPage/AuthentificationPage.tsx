import React, { useEffect, useState } from "react";

import styles from "./AuthentificationPage.module.css";

import logo from "../../Assets/Images/Logo.png";

import BackgroundAnimated from "../../Components/BackgroundAnimated/BackgroundAnimated";
import SegmentedControl from "../../Components/ui/SegmentedControl/SegmentedControl";

import AuthLogin from "../../Components/AuthLogin/AuthLogin";
import AuthSignup from "../../Components/AuthSignup/AuthSingup";

const AuthentificationPage: React.FC = () => {
    const [authMode, setAuthMode] = useState("login");
    
    const handleAuthChange = (id: string) => {
        setAuthMode(id);
    }

    return (
        <div className = {styles.container}>
            <BackgroundAnimated />

            <div className = {styles.containerForm}>
                {authMode === "login" ? <AuthLogin /> : <AuthSignup />}
            </div>

            <div className = {styles.containerSelection}>
                <SegmentedControl onChange = {handleAuthChange} selections = {[{id: "login", name: "Log in"}, {id: "singup", name: "Create account"}]} customizations = {{backgroundColor: "var(--background-tertiary)", foregroundColor: "var(--text-primary)", backgroundColorActive: "var(--background-accent)", foregroundColorActive: "var(--text-accent)", fontSize: "17px", padding: "10px 20px", widthBehaviour: "scrollIndividualFillParent"}}/>
            </div>
        </div>
    );
};

export default AuthentificationPage;