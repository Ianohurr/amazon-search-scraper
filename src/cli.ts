#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AmazonScraper, SortBy } from "./AmazonScraper";

yargs(hideBin(process.argv))
  .command(
    "scrape",
    "Scrape Amazon products by search term",
    (yargs) =>
      yargs
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
          ] as const,
          default: "relevance",
          description: "Sort order",
        })
        .option("tag", {
          alias: "a",
          type: "string",
          description: "Amazon affiliate tag",
        }),
    async (argv) => {
      const scraper = new AmazonScraper();
      try {
        await scraper.init();
        const results = await scraper.search(
          argv.term,
          argv.sort as SortBy,
          argv.tag ?? ""
        );
        console.log(JSON.stringify(results, null, 2));
      } catch (err) {
        console.error("❌ Scraper error:", err);
      } finally {
        await scraper.close();
      }
    }
  )
  .demandCommand(1, "Please specify a command, like 'scrape'")
  .strict()
  .help()
  .parse();
