import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpotify, FaUserAlt, FaSearch, FaHeart, FaCartPlus } from "react-icons/fa";
import Dock from "../../Components/Dock/Dock";
import styles from "./ProfilePage.module.css";
import logo from "../../Assets/Images/Logo.png";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const spotifyAccessToken = localStorage.getItem("spotify_access_token");

        console.log("Checking Spotify connection..." + spotifyAccessToken);
        if (spotifyAccessToken) {
            console.log("Spotify access token found, user is connected.");
            setSpotifyConnected(true);
        } else {
            console.log("No Spotify access token found, user is not connected.");
        }

        setLoading(false);
    }, []);

    const handleConnectSpotify = () => {
        console.log("Redirecting user to Spotify authentication...");
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
            ) : spotifyConnected ? (
                <div className={styles.profileContainer}>
                    <h2>Your Spotify account is connected!</h2>
                    <p>You are successfully connected to Spotify.</p>
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
