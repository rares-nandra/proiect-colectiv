import React, { useState } from "react";

import styles from "./AuthSignup.module.css";

import TextInput from "../ui/TextInput/TextInput";
import Button from "../ui/Button/Button";

const AuthSignup: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const onClickSignup = async () => {
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
                setError(errorData.msg);
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
                            onChange={(value) => setEmail(value)} // Primește doar valoarea
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
                            onChange={(value) => setPassword(value)} // Primește doar valoarea
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
