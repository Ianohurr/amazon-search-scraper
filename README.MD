📦 amazon-search-scraper

# amazon-search-scraper

[![npm version](https://img.shields.io/npm/v/amazon-search-scraper.svg)](https://www.npmjs.com/package/amazon-search-scraper)

A simple Puppeteer-based CLI and library for scraping Amazon product listings and generating affiliate-ready product links.

✨ Features

    Scrapes live Amazon search results

    Extracts product title, price, rating, image, and ASIN

    Appends your Amazon affiliate tag to each URL

    Supports sorting by relevance, reviews, or price

    Includes a full CLI (amazon-search-scraper scrape)

    Typed and tested for use in other TypeScript projects

🚀 Installation

npm install -g amazon-search-scraper

    Or use it without installing globally:

npx amazon-search-scraper scrape --term="dog food"

🔧 CLI Usage

amazon-search-scraper scrape --term="dog chew toy" --sort=review --tag=mytag-20

CLI Options:
Option Alias Description Required Example
--term -t Search term ✅ "cat food"
--sort -s Sort method (review, etc.) ❌ priceLowToHigh
--tag -a Your Amazon affiliate tag ❌ mytag-20
🧱 Programmatic Usage

import { AmazonScraper } from "amazon-search-scraper";

const scraper = new AmazonScraper();
await scraper.init();

const products = await scraper.search("dog vitamins", "review", "yourtag-20");

console.log(products);

await scraper.close();

🗃️ Sample Output

[
{
"title": "KONG Classic Dog Toy",
"price": "$12.99",
"rating": "4.8 out of 5 stars",
"image": "https://m.media-amazon.com/images/I/71ZJZDLjx6L._AC_SY355_.jpg",
"url": "https://www.amazon.com/dp/B0002AR0II?tag=yourtag-20",
"asin": "B0002AR0II"
}
]

🛠 Tech Stack

    Puppeteer Extra

    TypeScript

    yargs for CLI

    Headless browser scraping with stealth mode

📄 License

MIT © Ian O'Heir
Contributions welcome!
