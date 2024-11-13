export interface ProductCardProps {
    onClick: () => void;
    onClickCart: () => void;
    onClickHeart: () => void;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    additional: any;
    matchPercentage: number;
    keywords: Array<{ name: string; match: boolean }>;
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
