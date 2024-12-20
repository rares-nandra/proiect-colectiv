import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthLogin.module.css";

const AuthLogin: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("jwt_token", data.access_token); // Save the JWT token
            setError(""); // Reset any error message
            alert("Login successful!");
            navigate("/"); // Redirect to the home page
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.form}>
            <h2>Login</h2>
            {error && <p className={styles.error}>{error}</p>}
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
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default AuthLogin;
