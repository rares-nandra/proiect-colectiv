import React, { useState, useEffect } from "react";
import { CartItem } from "../../Types/CartItem.type";
import { useNavigate, Link } from "react-router-dom";
import styles from "./CartPage.module.css";
import Button from "../../Components/ui/Button/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import Dock from "../../Components/Dock/Dock";

import { FaSearch, FaHeart, FaUserAlt } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    const handleDockChange = (id: string) => {
        const routes: { [key: string]: string } = {
            browse: "/",
            favourites: "/favorites",
            cart: "/cart", 
            profile: "/profile",
        };
        navigate(routes[id] || "/");
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:5001/cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setCartItems(data);
            }
        })
        .catch(err => console.error(err));
    }, []);

    return (
        <div className = {styles.container}>
            <div className={styles.cartWrapper}>
                <div className={styles.header}>
                    <Link to="/" className={styles.homeLink}>
                        <IoMdArrowRoundBack size={24} style={{marginRight:"8px"}}/> Home
                    </Link>
                </div>
                <h1 className={styles.title}>Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Cart is empty</p>
                ) : (
                    <div className={styles.itemsContainer}>
                        {cartItems.map(item => (
                            <div key={item.product_id} className={styles.cartItem}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemDetails}>{item.price} RON x {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className={styles.buttonRow}>
                        <Button 
                            onClick={() => navigate("/checkout")} 
                            text="Complete Order" 
                            customizations={{backgroundColor:"#88c589", foregroundColor:"#000"}}
                        />
                    </div>
                )}
            </div>

            <Dock
                onChange={handleDockChange}
                activeElementId={"cart"}
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

export default CartPage;
