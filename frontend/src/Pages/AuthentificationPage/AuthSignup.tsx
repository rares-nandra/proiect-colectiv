import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthSignup.module.css";

const AuthSignup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleSignup = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Registration failed");
            }

            const data = await response.json();
            setSuccess(data.msg);
            setError("");
            alert("Registration successful!");
            navigate("/"); // Redirect to the home page
        } catch (err: any) {
            setError(err.message);
            setSuccess("");
        }
    };

    return (
        <div className={styles.form}>
            <h2>Register</h2>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default AuthSignup;
