#!/usr/bin/env node

import { Supa } from "./supabase/client.js";

import fetch from "node-fetch";
import { Article } from "./types.js";
import { TablesInsert } from "./supabase/types.gen.js";
import { upsertStories } from "./supabase/api.js";

const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/archive/v1/";

async function fetchArchive(year: number, month: number): Promise<Article[]> {
  const url = `${BASE_URL}${year}/${month}.json?api-key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.response.docs as Article[];
}

async function main() {
  if (!(await Supa.getInstance().checkSession())) return;
  try {
    const sourceId = process.argv[2];
    const fromDateStr = process.argv[3];

    const [fromYear, fromMonth] = fromDateStr.split("-").map(Number);
    if (
      isNaN(fromYear) ||
      isNaN(fromMonth) ||
      fromMonth < 1 ||
      fromMonth > 12
    ) {
      console.log("Invalid date format. Please use YYYY-MM.");
      return;
    }

    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-11

    let ok = true;
    for (let year = fromYear; year <= currentYear; year++) {
      let startMonth = year === fromYear ? fromMonth : 1;
      let endMonth = year === currentYear ? currentMonth : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        console.log(
          `Fetching articles for ${year}-${String(month).padStart(2, "0")}`
        );
        const articles = await fetchArchive(year, month);
        //console.log(articles);

        const formattedArticles: TablesInsert<"stories">[] = articles.map(
          (article) => ({
            foreign_id: article._id,
            title: article.headline.main,
            summary: article.abstract,
            pub_date: article.pub_date,
            url: article.web_url,
            source_id: sourceId,
          })
        );

        ok = ok && (await upsertStories(formattedArticles));
        if (!ok) break;
        await new Promise((resolve) => setTimeout(resolve, 12500)); //due to NYT API rate limit: https://developer.nytimes.com/faq#a11
      }
    }

    if (ok) {
      console.log("import completed successfully.");
    } else {
      console.log("import failed - see errors above.");
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

await main();
