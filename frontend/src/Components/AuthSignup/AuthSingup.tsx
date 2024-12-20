import React, { useState } from "react";

import styles from "./AuthSignup.module.css";

import TextInput from "../ui/TextInput/TextInput";
import Button from "../ui/Button/Button";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simple password complexity: at least 8 chars, 1 letter, 1 number, 1 special char
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const AuthSignup: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const validateFields = (): boolean => {
        setError(null);

        // Validate email
        if (!email.trim()) {
            setError("Email is required.");
            return false;
        } else if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        // Validate password complexity
        if (!password.trim()) {
            setError("Password is required.");
            return false;
        } else if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters, contain one letter, one number, and one special character.");
            return false;
        }

        return true;
    };

    const onClickSignup = async () => {
        if (!validateFields()) return; // Stop if frontend validation fails

        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.msg); // Log success message
                window.location.href = "http://localhost:3000/"; // Redirect to home page
            } else {
                const errorData = await response.json();
                // Show user-friendly error message on failure
                setError(errorData.msg || "The user or password is incorrect.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>
                <h1 className={styles.title}>Create account</h1>
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
                            type="email"
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

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actionContainer}>
                <Button
                    onClick={onClickSignup}
                    text={"sign up"}
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

export default AuthSignup;
