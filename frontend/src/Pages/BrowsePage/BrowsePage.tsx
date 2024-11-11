import React from "react";

import styles from "./BrowsePage.module.css";

import ProductCard from "../../Components/ProductCard/ProductCards";

const BrowsePage: React.FC = () => {
    return (
        <div className = {styles.container}>
            <ProductCard onClick = {() => {}} name = "tricou rock cool" description = "something to say about the cool rock t-shirt and some more text for testing" price = {99.99} imageUrl="https://i.ibb.co/Vvbzzjs/pngwing-com.png" category = "t-shirt" matchPercentage={93.5} customizations = {{backgroundColor: "rgb(230, 230, 230)", foregroundColor: "black", accentColor: "rgb(94, 148, 34)"}} />
        </div>
    );
};

export default BrowsePage;