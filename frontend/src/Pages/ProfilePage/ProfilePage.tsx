import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpotify, FaUserAlt, FaSearch, FaHeart, FaCartPlus } from "react-icons/fa";
import Dock from "../../Components/Dock/Dock";
import styles from "./ProfilePage.module.css";
import logo from "../../Assets/Images/Logo.png";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

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

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetch("http://localhost:5001/spotify-auth/callback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error("Error:", data.error);
                    } else {
                        fetchUserProfile(token);
                    }
                })
                .catch((error) => console.error("Error:", error));
        } else {
            fetchUserProfile(token);
        }
    }, [navigate]);

    const fetchUserProfile = (token: string) => {
        setLoading(true);
        fetch("http://localhost:5001/spotify-auth/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                return response.json();
            })
            .then((data) => {
                if (data?.spotifyProfile) {
                    setUserProfile(data.spotifyProfile);
                    setSpotifyConnected(true);
                }
            })
            .catch((error) => console.error("Error:", error))
            .finally(() => setLoading(false));
    };

    const handleConnectSpotify = () => {
        window.location.href = "http://localhost:5001/spotify-auth/auth";
    };

    const handleDockChange = (id: string) => {
        const routes: { [key: string]: string } = {
            browse: "/",
            favourites: "/favorites",
            cart: "/cart",
            profile: "/profile",
        };
        navigate(routes[id] || "/");
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.logoContainer}>
                    <img className={styles.logo} src={logo} alt="Logo" />
                    <h1 className={styles.title}>SPS - Shop</h1>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : spotifyConnected && userProfile ? (
                <div className={styles.profileContainer}>
                    <h2>Welcome, {userProfile.name}!</h2>
                    <img src={userProfile.image_url} alt="Profile" className={styles.profileImage} />
                    <p>Your Spotify account is connected.</p>
                </div>
            ) : (
                <div className={styles.buttonContainer}>
                    <button className={styles.connectButton} onClick={handleConnectSpotify}>
                        <FaSpotify style={{ marginRight: "10px" }} />
                        Connect with Spotify
                    </button>
                </div>
            )}

            <Dock
                onChange={handleDockChange}
                activeElementId="profile"
                elements={[
                    { id: "", icon: FaSearch },
                    { id: "favourites", icon: FaHeart },
                    { id: "cart", icon: FaCartPlus },
                    { id: "profile", icon: FaUserAlt },
                ]}
            />
        </div>
    );
};

export default ProfilePage;
