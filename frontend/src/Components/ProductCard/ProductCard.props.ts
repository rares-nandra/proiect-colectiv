import { Product } from "../../Types/Product.type";

export interface ProductCardProps {
    onClick: () => void;
    onClickCart: () => void;
    onClickHeart: () => void;
    product: Product,
    customizations?: {
        width?: string;
        height?: string;
        background?: string;
        backgroundColorTags?: string;
        foregroundColor?: string;
        backgroundAccent?: string;
        foregroundAccent?: string;
        shadow?: string;
    };
}
