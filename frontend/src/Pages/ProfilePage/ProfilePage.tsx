import React, { useEffect, useState } from "react";

import styles from "./ProfilePage.module.css";

import logo from "../../Assets/Images/Logo.png";

import Dock from "../../Components/Dock/Dock";

import { FaSearch, FaHeart, FaUserAlt } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import BackgroundAnimated from "../../Components/BackgroundAnimated/BackgroundAnimated";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/ui/Button/Button";

import { FaSpotify, FaSignOutAlt } from "react-icons/fa";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [hasSpotifyToken, setHasSpotifyToken] = useState<boolean | null>(null);
    const [redirectReady, setRedirectReady] = useState<boolean>(false);
    const [canRefresh, setCanRefresh] = useState<boolean>(false);

    const handleDockChange = (id: string) => {
        const routes: { [key: string]: string } = {
            browse: "/",
            favourites: "/favorites",
            cart: "/cart",
            profile: "/profile",
        };
        navigate(routes[id] || "/");
    };

    const redirectToSpotify = () => {
        setRedirectReady(true);
    };

    useEffect(() => {
        if(redirectReady)
        {
            const authUrl = "http://localhost:5001/spotify-auth/auth";
            window.open(authUrl, "_blank");
        }
    }, [redirectReady]);

    useEffect(() => {
        if(redirectReady && canRefresh) 
        {
            window.location.reload();
            setRedirectReady(false);
            setCanRefresh(false);
        }
    }, [redirectReady, canRefresh]);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

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

        if (!token) {
            navigate("/auth");
        }

        const userEmail = localStorage.getItem("user_email");
        if (userEmail) {
            fetch(`http://localhost:5001/spotify-auth/has-token?email=${userEmail}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.has_token !== undefined) {
                        setHasSpotifyToken(data.has_token);
                    } else {
                        setHasSpotifyToken(false);
                    }
                })
                .catch(() => {
                    setHasSpotifyToken(false);
                });
        } else {
            setHasSpotifyToken(false);
        }

        // Handle tab visibility change
        const handleVisibilityChange = () => {
            setCanRefresh(true);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_email");
        navigate("/auth");
    };

    const handleSpotifyLogout = () => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            return; // No user email found
        }
    
        fetch("http://localhost:5001/spotify-auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setHasSpotifyToken(false);
                } else {
                    console.error("Failed to logout of Spotify:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error during Spotify logout:", error);
            });
    };    

    const handleMusicTasteUpdate = () => {
        const userEmail = localStorage.getItem("user_email");
    
        if (!userEmail) {
            console.error("User email not found");
            return;
        }
    
        fetch(`http://localhost:5001/spotify/get-music-taste?email=${userEmail}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.music_taste) {
                    console.log("Music taste updated:", data.music_taste);
                } else {
                    console.error("Failed to retrieve music taste:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error fetching music taste:", error);
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    <img className={styles.logo} src={logo} />
                    <h1 className={styles.title}>SPS - shop</h1>
                </div>
            </div>

            <div className={styles.spotifyAuthContainer}>
                {hasSpotifyToken === null ? (
                    <div className={styles.loadingContainer}>
                        <p className={styles.tokenText}>Loading...</p>
                    </div>
                ) : hasSpotifyToken ? (
                    <div className={styles.hasTokenContainer}>
                        <p className={styles.tokenText}>You are logged into Spotify, Happy shopping!</p>

                        <div className={styles.spotifyLogoutContainer}>
                            <Button
                                onClick={handleMusicTasteUpdate}
                                text={"update music taste"}
                                customizations={{
                                    backgroundColor: "var(--background-accent)",
                                    foregroundColor: "var(--text-accent)",
                                    padding: "6px 10px",
                                    fontSize: "20px",
                                }}
                                icon={FaSpotify}
                            />
                        </div>

                        <div className={styles.spotifyLogoutContainer}>
                            <Button
                                onClick={handleSpotifyLogout}
                                text={"Disconnect from Spotify"}
                                customizations={{
                                    backgroundColor: "var(--text-alert)",
                                    foregroundColor: "var(--text-primary)",
                                    padding: "6px 20px",
                                    fontSize: "15px",
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.noTokenContainer}>
                        <Button
                            onClick={redirectToSpotify}
                            text={"connect with Spotify"}
                            customizations={{
                                backgroundColor: "var(--background-accent)",
                                foregroundColor: "var(--text-accent)",
                                padding: "12px 30px",
                                fontSize: "26px",
                            }}
                            icon={FaSpotify}
                        />
                    </div>
                )}
            </div>

            <div className={styles.logoutContainer}>
                <Button
                    onClick={handleLogout}
                    text={"Logout"}
                    customizations={{
                        backgroundColor: "var(--text-alert)",
                        foregroundColor: "var(--text-primary)",
                        padding: "10px 30px",
                        fontSize: "20px",
                    }}
                    icon={FaSignOutAlt}
                />
            </div>

            <BackgroundAnimated />

            <Dock
                onChange={handleDockChange}
                activeElementId={"profile"}
                elements={[
                    { id: "home", icon: FaSearch },
                    { id: "favourites", icon: FaHeart },
                    { id: "cart", icon: FaCartPlus },
                    { id: "profile", icon: FaUserAlt },
                ]}
            />
        </div>
    );
};

export default ProfilePage;