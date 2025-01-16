import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AuthLogin.module.css";

import TextInput from "../ui/TextInput/TextInput";
import Button from "../ui/Button/Button";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const validateFields = (): boolean => {
        // Clear previous errors
        setError("");

        // Check if email is valid
        if (!email.trim()) {
            setError("Email is required.");
            return false;
        } else if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        // Check password not empty
        if (!password.trim()) {
            setError("Password is required.");
            return false;
        }

        return true;
    };

    const onClickLogin = async () => {
        if (!validateFields()) return; // stop if frontend validation fails

        try {
            const response = await fetch("http://localhost:5001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Show a user-friendly error message
                setError(errorData.msg || "The user or password is incorrect.");
                return;
            }

            const data = await response.json();
            localStorage.setItem("jwt_token", data.access_token);
            localStorage.setItem("user_email", email);
            setError(""); // Clear error messages
            navigate("/"); // Redirect to the home page
        } catch (err: any) {
            setError("An error occurred. Please try again.");
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
