import React from "react";

import { ProductCardProps } from "./ProductCard.props";
import styles from "./ProductCard.module.css";

import Button from "../ui/Button/Button";

import { FaCartPlus } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const ProductCard: React.FC<ProductCardProps> = ({ onClick, onClickHeart, onClickCart, product, customizations }) => {    
    return (
        <div onClick = {onClick} className = {styles.container} style = {{background: customizations?.background, width: customizations?.width ? customizations?.width : "280px", height: customizations?.height ? customizations?.height : "375px", boxShadow: customizations?.shadow }}>
            <div title = {"You have a " + String(product.matchPercentage) + "% match with this product based on your Spotify music taste"} className = {styles.percentage}>
                <p className = {styles.percentageText} style = {{color: customizations?.foregroundColor}}>{product.matchPercentage}%</p>
            </div>

            <div className = {styles.favourite}>
                <Button onClick = {onClickHeart} icon = {FaRegHeart} customizations = {{backgroundColor: "transparent", foregroundColor: "var(--text-primary)", padding: "10px", fontSize: "20px"}} />
            </div>

            <div className = {styles.imageContainer}>
                <div className = {styles.image} style = {{backgroundImage: `url(${product.image})`}}></div>
            </div>
        
            <div className = {styles.contentContainer}>
                <div className = {styles.infoContainer}>
                    <div className = {styles.nameContainer}>
                        <h2 className = {styles.name} style = {{color: customizations?.foregroundColor}}>{product.name}</h2>
                    </div>
                    
                    <div className = {styles.descriptionContainer}>
                        <p className = {styles.description} style = {{color: customizations?.foregroundColor}}>{product.description}</p>
                    </div>

                    <div className = {styles.tagsContainer}>
                        {product.keywords.map((keyword, index) => (
                            <div key = {index} className = {styles.tagContainer} style = {{backgroundColor: keyword.match? customizations?.backgroundAccent : customizations?.backgroundColorTags,}}>
                                <p className = {styles.tag} style = {{ color: customizations?.foregroundAccent }}>
                                    {keyword.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className = {styles.priceContainer}>
                    <p className = {styles.price} style = {{color: customizations?.backgroundAccent}}>{product.price} RON</p>
                
                    <Button onClick = {onClickCart} icon = {FaCartPlus} customizations = {{backgroundColor: "transparent", foregroundColor: "var(--text-primary)", padding: "10px", fontSize: "22px"}} />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;