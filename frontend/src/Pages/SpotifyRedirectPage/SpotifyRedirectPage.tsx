import React, { useEffect, useState } from "react";

import styles from "./SpotifyRedirectPage.module.css";

import logo from "../../Assets/Images/Logo.png";

import BackgroundAnimated from "../../Components/BackgroundAnimated/BackgroundAnimated";
import { useNavigate, useLocation} from "react-router-dom";

const SpotifyRedirectPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        const userEmail = localStorage.getItem("user_email");

        if (!token) {
            navigate("/auth");
            return;
        }

        fetch("http://localhost:5001/auth/validate-token", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Invalid token");
                }
            })
            .catch(() => {
                navigate("/auth");
            });

        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");

        if (code) {
            fetch("http://localhost:5001/spotify-auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code, email: userEmail }),
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("Spotify token saved successfully!");
                    } else {
                        throw new Error("Failed to save Spotify token");
                    }
                })
                .catch((error) => {
                    console.error("Error saving Spotify token:", error);
                });
        } else {
            console.error("No Spotify authorization code found in the URL");
        }
    }, [location.search, navigate]);

    return (
        <div className = {styles.container}>
            <div className = {styles.headerContainer}>
                <div className = {styles.logoContainer}>
                    <img className = {styles.logo} src = {logo} />
                    <h1 className = {styles.title}>SPS - shop</h1>
                </div>
            </div>

            <div className = {styles.contentContainer}>
                <p className = {styles.content}>
                    Successfully connected with Spotify! 
                    <br></br>
                    You can now close this tab
                </p>
            </div>

            <BackgroundAnimated />        
        </div>
    );
};

export default SpotifyRedirectPage;