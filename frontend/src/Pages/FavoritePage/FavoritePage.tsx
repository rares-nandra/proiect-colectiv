import React, { useEffect, useState } from "react";

import styles from "./FavoritePage.module.css";

import logo from "../../Assets/Images/Logo.png";

import { Product } from "../../Types/Product.type";

import ProductCard from "../../Components/ProductCard/ProductCards";
import ProductViewer from "../../Components/ProductViewer/ProductViewer";
import Dock from "../../Components/Dock/Dock";

import { FaSearch, FaHeart, FaUserAlt } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import BackgroundAnimated from "../../Components/BackgroundAnimated/BackgroundAnimated";
import { useNavigate, useLocation} from "react-router-dom";

const FavoritePage: React.FC = () => {
    const [products, setProducts] = useState<{ [key: string]: Product }>({});
    const [viewedProduct, setViewedProduct] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDockChange = (id: string) => {
        const routes: { [key: string]: string } = {
            browse: "/",
            favourites: "/favorites",
            cart: "/cart", // Placeholder: Ensure this route exists
            profile: "/profile", // Placeholder: Ensure this route exists
        };
        navigate(routes[id] || "/");
    };
    
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
    
        fetch("http://localhost:5001/favorites", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data: Product[]) => {
                const productDict = data.reduce((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {} as { [key: string]: Product });
                setProducts(productDict);
            })
            .catch((error) => console.error("Error:", error));
    }, []);
    

    useEffect(() => {
        const productId = window.location.hash.slice(1).replace("product-", "");

        if(Object.values(products).length === 0 || productId === "")
        {
            return;
        }

        const checkHashForProductId = () => {
            if(!products[productId])
            {
                alert("The product is no longer available " + productId);
                return;
            }

            if(viewedProduct !== productId) 
            {
                setViewedProduct(productId);
            }
        };

        checkHashForProductId();

        window.addEventListener("hashchange", checkHashForProductId);

        return () => {
            window.removeEventListener("hashchange", checkHashForProductId);
        };
    }, [products, viewedProduct]);

    const toggleFavorite = (productId: string | null) => {
        if (!productId) return;
    
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            console.error("No JWT token found. Please log in.");
            return;
        }
    
        const product = { ...products[productId], is_favorite: true }; // Ensure is_favorite is included
        const url = product.is_favorite 
            ? "http://localhost:5000/deleteFavorites" 
            : "http://localhost:5000/addFavorites";
    
        fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                product: { 
                    ...product, 
                    is_favorite: true 
                } 
            }), 
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to toggle favorite: ${response.status}`);
                return response.json();
            })
            .then(() => {
                setProducts((prevProducts) => ({
                    ...prevProducts,
                    [productId]: { ...products[productId], is_favorite: !products[productId].is_favorite },
                }));
            })
            .catch((error) => console.error("Error toggling favorite:", error));
    };
    
    

    return (
        <div className = {styles.container}>
            <div className = {styles.headerContainer}>
                <div className = {styles.logoContainer}>
                    <img className = {styles.logo} src = {logo} />
                    <h1 className = {styles.title}>SPS - shop</h1>
                </div>
            </div>

            <div className = {styles.productsContainer}>
                {Object.values(products).map((product) => (
                    <ProductCard key = {product._id} onClick = {() => {setViewedProduct(product._id)}} onClickCart = {() => {}} onClickHeart={() => toggleFavorite(product._id)}  product = {product} customizations = {{ width: "280px", height: "400px", background: "linear-gradient(to bottom right, var(--background-tertiary) 0%, var(--background-secondary) 70%)", foregroundColor: "var(--text-primary)", backgroundAccent: "var(--background-accent)", foregroundAccent: "var(--text-accent)", shadow: "var(--shadow)", backgroundColorTags: "var(--background-tertiary)", }} />
                ))}
            </div>

            <ProductViewer onClose = {() => {setViewedProduct(null)}} onClickCart = {() => {}} onClickHeart={() => viewedProduct && toggleFavorite(viewedProduct)}   product = { viewedProduct ? products[viewedProduct] : null} customizations = {{ foregroundColor: "var(--text-primary)", backgroundAccent: "var(--background-accent)", foregroundAccent: "var(--text-accent)", backgroundColorTags: "var(--background-tertiary)", }} />
        
            <Dock
                onChange={handleDockChange}
                activeElementId={location.pathname.includes("favorites") ? "favourites" : ""}
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

export default FavoritePage;