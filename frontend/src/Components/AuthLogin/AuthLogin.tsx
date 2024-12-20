import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AuthLogin.module.css";

import TextInput from "../ui/TextInput/TextInput";
import Button from "../ui/Button/Button";

const AuthLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const onClickLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("jwt_token", data.access_token); // Save the JWT token
            setError(""); // Clear error messages
            navigate("/"); // Redirect to the home page
        } catch (err: any) {
            setError(err.message); // Display error message
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>
                <h1 className={styles.title}>Log in</h1>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formSection}>
                    <p className={styles.formSectionName}>email</p>
                    <div className={styles.hackyUnderline}>
                        <TextInput
                            onChange={(value) => setEmail(value)}
                            customizations={{
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                foregroundColor: "var(--text-primary)",
                                fontSize: "20px",
                            }}
                        />
                    </div>
                </div>

                <div className={styles.formSection}>
                    <p className={styles.formSectionName}>password</p>
                    <div className={styles.hackyUnderline}>
                        <TextInput
                            onChange={(value) => setPassword(value)}
                            customizations={{
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                foregroundColor: "var(--text-primary)",
                                fontSize: "20px",
                            }}
                            type="password"
                        />
                    </div>
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actionContainer}>
                <Button
                    onClick={onClickLogin}
                    text={"log in"}
                    customizations={{
                        backgroundColor: "var(--background-accent)",
                        foregroundColor: "var(--text-accent)",
                        padding: "7px 30px",
                        fontSize: "20px",
                    }}
                />
            </div>
        </div>
    );
};

export default AuthLogin;
