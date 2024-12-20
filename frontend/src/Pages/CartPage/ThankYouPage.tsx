import React from "react";
import { Link } from "react-router-dom";
import styles from "./ThankYouPage.module.css";

const ThankYouPage: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Link to="/" className={styles.homeLink}>Home</Link>
            </div>
            <h1 className={styles.title}>Thank you for your order!</h1>
            <p className={styles.message}>The order has been successfully placed.</p>
        </div>
    );
};

export default ThankYouPage;
