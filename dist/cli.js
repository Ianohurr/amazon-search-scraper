#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const AmazonScraper_1 = require("./AmazonScraper");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command("scrape", "Scrape Amazon products by search term", (yargs) => yargs
    .option("term", {
    alias: "t",
    type: "string",
    demandOption: true,
    description: "Search term to look up",
})
    .option("sort", {
    alias: "s",
    choices: [
        "relevance",
        "review",
        "priceLowToHigh",
        "priceHighToLow",
    ],
    default: "relevance",
    description: "Sort order",
})
    .option("tag", {
    alias: "a",
    type: "string",
    description: "Amazon affiliate tag",
}), async (argv) => {
    const scraper = new AmazonScraper_1.AmazonScraper();
    try {
        await scraper.init();
        const results = await scraper.search(argv.term, argv.sort, argv.tag ?? "");
        console.log(JSON.stringify(results, null, 2));
    }
    catch (err) {
        console.error("❌ Scraper error:", err);
    }
    finally {
        await scraper.close();
    }
})
    .demandCommand(1, "Please specify a command, like 'scrape'")
    .strict()
    .help()
    .parse();
