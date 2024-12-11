import React, { useEffect, useState } from "react";

import styles from "./BrowsePage.module.css";

import logo from "../../Assets/Images/Logo.png";

import { Product } from "../../Types/Product.type";

import ProductCard from "../../Components/ProductCard/ProductCards";
import ProductViewer from "../../Components/ProductViewer/ProductViewer";
import Dock from "../../Components/Dock/Dock";

import { FaSearch, FaHeart, FaUserAlt } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";

const BrowsePage: React.FC = () => {
    const [products, setProducts] = useState<{ [key: string]: Product }>({});
    const [viewedProduct, setViewedProduct] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/products")
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

    return (
        <div className = {styles.container}>
            <div className = {styles.headerContainer}>
                <img className = {styles.logo} src = {logo} />
            </div>

            <div className = {styles.productsContainer}>
                {Object.values(products).map((product) => (
                    <ProductCard key = {product._id} onClick = {() => {setViewedProduct(product._id)}} onClickCart = {() => {}} onClickHeart = {() => {}} product = {product} customizations = {{ width: "280px", height: "400px", background: "linear-gradient(to bottom right, var(--background-tertiary) 0%, var(--background-secondary) 70%)", foregroundColor: "var(--text-primary)", backgroundAccent: "var(--background-accent)", foregroundAccent: "var(--text-accent)", shadow: "var(--shadow)", backgroundColorTags: "var(--background-tertiary)", }} />
                ))}
            </div>

            <ProductViewer onClose = {() => {setViewedProduct(null)}} onClickCart = {() => {}} onClickHeart = {() => {}} product = { viewedProduct ? products[viewedProduct] : null} customizations = {{ foregroundColor: "var(--text-primary)", backgroundAccent: "var(--background-accent)", foregroundAccent: "var(--text-accent)", backgroundColorTags: "var(--background-tertiary)", }} />
        
            <Dock onChange = {(id: string) => {}} activeElementId = {"browse"} elements = {[{id: "browse", icon: FaSearch}, {id: "favourites", icon: FaHeart}, {id: "cart", icon: FaCartPlus}, {id: "profile", icon: FaUserAlt}]} />
        </div>
    );
};

export default BrowsePage;