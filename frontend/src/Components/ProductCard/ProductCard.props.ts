export interface ProductCardProps {
    onClick: () => void;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    additional: any;
    matchPercentage: number;
    keywords: Array<string>;
    customizations?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        backgroundColorTags?: string;
        foregroundColor?: string;
        accentColor?: string;
        shadow?: string;
    };
}