import { Product } from "../../Types/Product.type";

export interface ProductViewerProps {
    onClose: () => void;
    onClickCart: () => void;
    onClickHeart: () => void;
    product: null | Product;
    customizations?: {
        backgroundColorTags?: string;
        foregroundColor?: string;
        backgroundAccent?: string;
        foregroundAccent?: string;
    };
}
