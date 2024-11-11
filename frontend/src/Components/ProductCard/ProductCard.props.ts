export interface ProductCardProps {
    onClick: () => void;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    matchPercentage: number;
    customizations?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        foregroundColor?: string;
        accentColor?: string;
    };
}