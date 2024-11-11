import React from "react";

import { ProductCardProps } from "./ProductCard.props";
import styles from "./ProductCard.module.css";

const ProductCard: React.FC<ProductCardProps> = ({ onClick, name, description, matchPercentage, keywords, imageUrl, price, customizations }) => {
    return (
        <div className = {styles.container} style = {{backgroundColor: customizations?.backgroundColor, width: customizations?.width ? customizations?.width : "280px", height: customizations?.height ? customizations?.height : "375px", boxShadow: customizations?.shadow }}>
            <div title = {"You have a " + String(matchPercentage) + "% match with this product based on your Spotify music taste"} className = {styles.percentage}>
                <p className = {styles.percentageText} style = {{color: customizations?.foregroundColor}}>{matchPercentage}%</p>
            </div>
            
            <div className = {styles.image} style = {{backgroundImage: `url(${imageUrl})`}}></div>
        
            <div className = {styles.infoContainer}>
                <h2 className = {styles.name} style = {{color: customizations?.foregroundColor}}>{name}</h2>
                <div className = {styles.descriptionContainer}>
                    <p className = {styles.description} style = {{color: customizations?.foregroundColor}}>{description}</p>
                </div>

                <div className = {styles.tagsContainer}>
                    {keywords.map((keyword, index) => (
                        <div key = {index} className = {styles.tagContainer} style = {{backgroundColor: customizations?.backgroundColorTags}}>
                            <p className = {styles.tag} style = {{color: customizations?.foregroundColor}}>{keyword}</p>
                        </div>
                    ))}
                </div>

                <p className = {styles.price} style = {{color: customizations?.accentColor}}>{price} ron</p>
            </div>
        </div>
    );
};

export default ProductCard;