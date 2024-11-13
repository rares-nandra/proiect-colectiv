import React, { useEffect, useState } from "react";

import styles from "./BrowsePage.module.css";

import logo from "../../Assets/Images/Logo.png";

import ProductCard from "../../Components/ProductCard/ProductCards";

interface Product {
    _id: string;
    additional: Record<string, any>;
    category: string;
    description: string;
    image: string;
    keywords: Array<{ name: string; match: boolean }>;
    matchPercentage: number;
    name: string;
    price: number;
}

const BrowsePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <div className={styles.container}>
            <div className = {styles.headerContainer}>
                <img className = {styles.logo} src = {logo} />
            </div>

            <div className={styles.productsContainer}>
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        onClick={() => {}}
                        onClickCart = {() => {}}
                        onClickHeart = {() => {}}
                        additional={product.additional}
                        keywords={product.keywords}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        imageUrl={product.image}
                        category={product.category}
                        matchPercentage={product.matchPercentage}
                        customizations={{
                            width: "280px",
                            height: "400px",
                            background: "linear-gradient(to bottom right, var(--background-tertiary) 0%, var(--background-secondary) 70%)",
                            foregroundColor: "var(--text-primary)",
                            backgroundAccent: "var(--background-accent)",
                            foregroundAccent: "var(--text-accent)",
                            shadow: "var(--shadow)",
                            backgroundColorTags: "var(--background-tertiary)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default BrowsePage;