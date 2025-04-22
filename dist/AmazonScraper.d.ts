export type SortBy = "relevance" | "review" | "priceLowToHigh" | "priceHighToLow";
export interface AmazonProduct {
    title: string;
    price: string;
    rating: string;
    image: string;
    url: string;
    asin: string;
}
export declare class AmazonScraper {
    private browser;
    private page;
    init(): Promise<void>;
    search(term: string, sortBy?: SortBy, affiliateTag?: string): Promise<AmazonProduct[]>;
    close(): Promise<void>;
}
