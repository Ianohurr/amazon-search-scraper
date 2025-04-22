import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser, Page } from "puppeteer";

puppeteer.use(StealthPlugin());

export type SortBy =
  | "relevance"
  | "review"
  | "priceLowToHigh"
  | "priceHighToLow";

const sortOptions: Record<SortBy, string> = {
  relevance: "",
  review: "review-rank",
  priceLowToHigh: "price-asc-rank",
  priceHighToLow: "price-desc-rank",
};

export interface AmazonProduct {
  title: string;
  price: string;
  rating: string;
  image: string;
  url: string;
  asin: string;
}

export class AmazonScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  public async init(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();

    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );
    await this.page.setViewport({ width: 1280, height: 800 });

    await this.page.setRequestInterception(true);
    this.page.on("request", (req) => {
      const type = req.resourceType();
      if (["stylesheet", "image", "font", "media"].includes(type)) {
        req.abort().catch(() => {});
      } else {
        req.continue().catch(() => {});
      }
    });
  }

  public async search(
    term: string,
    sortBy: SortBy = "relevance",
    affiliateTag = ""
  ): Promise<AmazonProduct[]> {
    if (!this.page)
      throw new Error("Scraper not initialized. Call init() first.");

    const query = encodeURIComponent(term);
    const sortParam = sortOptions[sortBy] ? `&s=${sortOptions[sortBy]}` : "";
    const url = `https://www.amazon.com/s?k=${query}${sortParam}`;

    await this.page.goto(url, { waitUntil: "networkidle2" });
    await this.page.waitForSelector("div.s-main-slot");

    const products: AmazonProduct[] = await this.page.$$eval(
      "div.s-main-slot > div[data-asin]",
      (items, tag: string): AmazonProduct[] =>
        items
          .filter((el) => el.getAttribute("data-asin"))
          .slice(0, 10)
          .map((el) => {
            const asin = el.getAttribute("data-asin") ?? "";
            const title =
              el.querySelector("h2 span")?.textContent?.trim() ?? "";
            const price =
              el.querySelector(".a-price .a-offscreen")?.textContent ?? "";
            const rating =
              el.querySelector("i span")?.textContent?.trim() ?? "";
            const image = el.querySelector("img")?.getAttribute("src") ?? "";

            return {
              title,
              price,
              rating,
              image,
              url: `https://www.amazon.com/dp/${asin}?tag=${tag}`,
              asin,
            };
          }),
      affiliateTag
    );

    return products;
  }

  public async close(): Promise<void> {
    await this.browser?.close();
  }
}
