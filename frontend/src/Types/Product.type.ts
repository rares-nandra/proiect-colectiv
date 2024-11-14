export interface Product {
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