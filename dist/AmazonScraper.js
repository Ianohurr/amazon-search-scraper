"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonScraper = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const sortOptions = {
    relevance: "",
    review: "review-rank",
    priceLowToHigh: "price-asc-rank",
    priceHighToLow: "price-desc-rank",
};
class AmazonScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async init() {
        this.browser = await puppeteer_extra_1.default.launch({ headless: true });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");
        await this.page.setViewport({ width: 1280, height: 800 });
        await this.page.setRequestInterception(true);
        this.page.on("request", (req) => {
            const type = req.resourceType();
            if (["stylesheet", "image", "font", "media"].includes(type)) {
                req.abort().catch(() => { });
            }
            else {
                req.continue().catch(() => { });
            }
        });
    }
    async search(term, sortBy = "relevance", affiliateTag = "") {
        if (!this.page)
            throw new Error("Scraper not initialized. Call init() first.");
        const query = encodeURIComponent(term);
        const sortParam = sortOptions[sortBy] ? `&s=${sortOptions[sortBy]}` : "";
        const url = `https://www.amazon.com/s?k=${query}${sortParam}`;
        await this.page.goto(url, { waitUntil: "networkidle2" });
        await this.page.waitForSelector("div.s-main-slot");
        const products = await this.page.$$eval("div.s-main-slot > div[data-asin]", (items, tag) => items
            .filter((el) => el.getAttribute("data-asin"))
            .slice(0, 10)
            .map((el) => {
            const asin = el.getAttribute("data-asin") ?? "";
            const title = el.querySelector("h2 span")?.textContent?.trim() ?? "";
            const price = el.querySelector(".a-price .a-offscreen")?.textContent ?? "";
            const rating = el.querySelector("i span")?.textContent?.trim() ?? "";
            const image = el.querySelector("img")?.getAttribute("src") ?? "";
            return {
                title,
                price,
                rating,
                image,
                url: `https://www.amazon.com/dp/${asin}?tag=${tag}`,
                asin,
            };
        }), affiliateTag);
        return products;
    }
    async close() {
        await this.browser?.close();
    }
}
exports.AmazonScraper = AmazonScraper;
