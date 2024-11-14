import React, {useState, useEffect} from "react";

import { ProductViewerProps } from "./ProductViewer.props";
import styles from "./ProductViewer.module.css";
import stylesPC from "./ProductViewerPC.module.css"
import stylesMobile from "./ProductViewerMobile.module.css";

import Button from "../ui/Button/Button";
import SegmentedControl from "../ui/SegmentedControl/SegmentedControl";

import { FaCartPlus } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ProductViewer: React.FC<ProductViewerProps> = ({ onClose, onClickHeart, onClickCart, product, customizations }) => {    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    useEffect(() => {
        if(product === null)
        {
            return;
        }

        window.location.hash = `product-${product._id}`;
        document.body.style.overflow = "hidden";

        return () => {
            window.history.replaceState(null, "", " ");
            document.body.style.overflow = "unset";
        };
    }, [product]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if(product === null) 
    {
        return null;
    }

    const activeStyle = isMobile ? stylesMobile : stylesPC;

    const getInfoForProductType = () => {
        if(product.category === "Clothes")
        {
            return (
                <div className = {activeStyle.infoContainer}>
                    <p className = {activeStyle.description} style = {{ color: customizations?.foregroundColor }}>{product.description}</p>
                    
                    <div className = {activeStyle.moreInfoContainer}>
                        <div className = {activeStyle.moreInfoTextContainer}>
                            <p className = {activeStyle.tableInfoTitle} style = {{ color: customizations?.foregroundColor }}>type</p>
                            <p className = {activeStyle.tableInfo} style = {{ color: customizations?.foregroundColor }}>{product.additional.type}</p>
                        </div>

                        <div className = {activeStyle.moreInfoTextContainer}>
                            <p className = {activeStyle.tableInfoTitle} style = {{ color: customizations?.foregroundColor }}>gender</p>
                            <p className = {activeStyle.tableInfo} style = {{ color: customizations?.foregroundColor }}>{product.additional.gender}</p>
                        </div>

                        <div className = {activeStyle.moreInfoTextContainer}>
                            <p className = {activeStyle.tableInfoTitle} style = {{ color: customizations?.foregroundColor }}>brand</p>
                            <p className = {activeStyle.tableInfo} style = {{ color: customizations?.foregroundColor }}>{product.additional.brand}</p>
                        </div>
                    </div>

                    <div className = {activeStyle.clothesSizesContainer}>
                        <SegmentedControl onChange = {() => {}} selections = {product.additional.size?.map((size: string) => ({id: size, name: size})) || []} customizations = {{backgroundColor: "var(--background-tertiary)", foregroundColor: "var(--text-primary)", backgroundColorActive: "var(--background-accent)", foregroundColorActive: "var(--text-accent)", fontSize: "14px", padding: "10px 20px", widthBehaviour: "scrollAll"}}/>
                    </div>
                </div>
            );
        }

        if(product.category === "Music")
        {
            return (
                <div className = {activeStyle.infoContainer}>
                    <p className = {activeStyle.description} style = {{ color: customizations?.foregroundColor }}>{product.description}</p>
                    
                    <p className = {activeStyle.info} style = {{ color: customizations?.foregroundColor }}>Songs: {product.additional.songs?.join(", ")}</p>

                    <div className = {activeStyle.moreInfoContainer}>
                        <div className = {activeStyle.moreInfoTextContainer}>
                            <p className = {activeStyle.tableInfoTitle} style = {{ color: customizations?.foregroundColor }}>type</p>
                            <p className = {activeStyle.tableInfo} style = {{ color: customizations?.foregroundColor }}>{product.additional.type}</p>
                        </div>

                        <div className = {activeStyle.moreInfoTextContainer}>
                            <p className = {activeStyle.tableInfoTitle} style = {{ color: customizations?.foregroundColor }}>year</p>
                            <p className = {activeStyle.tableInfo} style = {{ color: customizations?.foregroundColor }}>{product.additional["release-year"]}</p>
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    return (
        <div className = {styles.overlay}>

        {isMobile ? (
            <div className = {`${styles.container} ${stylesMobile.container}`}>
                <div className = {styles.closeButtonContainer}>
                    <Button onClick = {onClose} icon = {IoMdClose} customizations = {{backgroundColor: "transparent", foregroundColor: customizations?.foregroundColor, fontSize: "40px"}}  />
                </div>

                <div className = {stylesMobile.titleContainer}>
                    <h2 className = {stylesMobile.title} style = {{ color: customizations?.foregroundColor }}>{product.name}</h2>
                </div>

                <div className = {stylesMobile.imageContainer}>
                    <div className = {stylesMobile.image} style = {{backgroundImage: `url(${product.image})`}}></div>
                </div>

                <div className = {stylesMobile.tagsContainer}>
                    {product.keywords.map((keyword, index) => (
                        <div key = {index} className = {stylesMobile.tagContainer} style = {{backgroundColor: keyword.match? customizations?.backgroundAccent : customizations?.backgroundColorTags,}}>
                            <p className = {stylesMobile.tag} style = {{ color: customizations?.foregroundAccent }}>
                                {keyword.name}
                            </p>
                        </div>
                    ))}
                </div>

                {getInfoForProductType()}

                <div className = {stylesMobile.actionContainer}>
                    <div className = {stylesMobile.favouriteContainer}>
                        <Button onClick = {onClickHeart} icon = {FaRegHeart} customizations = {{backgroundColor: "transparent", foregroundColor: customizations?.foregroundColor, padding: "10px", fontSize: "22px"}} />
                    </div>
                    
                    <div className = {stylesMobile.addToCartContainer}>
                        <Button onClick = {onClickCart} icon = {FaCartPlus} text = {"Add to cart"} customizations = {{backgroundColor: customizations?.backgroundAccent, foregroundColor: customizations?.foregroundAccent, padding: "5px 10px", fontSize: "20px"}} />
                    </div>

                    <h3 className = {stylesMobile.price} style = {{ color: customizations?.foregroundColor }}>{product.price} RON</h3>
                </div>
            </div>
        ) : (
            <div className = {`${styles.container} ${stylesPC.container}`}>
                <div className = {styles.closeButtonContainer}>
                    <Button onClick = {onClose} icon = {IoMdClose} customizations = {{backgroundColor: "transparent", foregroundColor: customizations?.foregroundColor, fontSize: "40px"}}  />
                </div>

                <div className = {stylesPC.imageContainer}>
                    <div className = {stylesPC.image} style = {{backgroundImage: `url(${product.image})`}}></div>
                    
                    <div className = {stylesPC.tagsContainer}>
                        {product.keywords.map((keyword, index) => (
                            <div key = {index} className = {stylesPC.tagContainer} style = {{backgroundColor: keyword.match? customizations?.backgroundAccent : customizations?.backgroundColorTags,}}>
                                <p className = {stylesPC.tag} style = {{ color: customizations?.foregroundAccent }}>
                                    {keyword.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className = {stylesPC.contentContainer}>
                    <div className = {stylesPC.headerContainer}>
                        <div className = {stylesPC.favouriteContainer}>
                            <Button onClick = {onClickHeart} icon = {FaRegHeart} customizations = {{backgroundColor: "transparent", foregroundColor: customizations?.foregroundColor, padding: "10px", fontSize: "26px"}} />
                        </div>
                        
                        <div className = {stylesPC.titleContainer}>
                            <h2 className = {stylesPC.title} style = {{ color: customizations?.foregroundColor }}>{product.name}</h2>
                        </div>
                    </div>

                    {getInfoForProductType()}

                    <div className = {stylesPC.actionContainer}>
                        <div className = {stylesPC.addToCartContainer}>
                            <Button onClick = {onClickCart} icon = {FaCartPlus} text = {"Add to cart"} customizations = {{backgroundColor: customizations?.backgroundAccent, foregroundColor: customizations?.foregroundAccent, padding: "8px 18px", fontSize: "20px"}} />
                        </div>

                        <h3 className = {stylesPC.price} style = {{ color: customizations?.foregroundColor }}>{product.price} RON</h3>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default ProductViewer;