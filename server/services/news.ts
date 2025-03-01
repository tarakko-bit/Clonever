import { storage } from "../storage";
import type { InsertNews } from "@shared/schema";

const CRYPTO_COMPARE_API = "https://min-api.cryptocompare.com/data/v2";

export class NewsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CRYPTO_NEWS_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("CRYPTO_NEWS_API_KEY is required");
    }
  }

  async fetchLatestNews(): Promise<InsertNews[]> {
    const response = await fetch(
      `${CRYPTO_COMPARE_API}/news/?lang=EN`,
      {
        headers: {
          "Authorization": `Apikey ${this.apiKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    return data.Data.map((article: any) => ({
      title: article.title,
      content: article.body,
      source: article.source,
      url: article.url,
      imageUrl: article.imageurl,
      category: article.categories,
      publishedAt: new Date(article.published_on * 1000),
    }));
  }

  async syncNewsToDatabase(): Promise<void> {
    try {
      const articles = await this.fetchLatestNews();
      for (const article of articles) {
        await storage.createNews(article);
      }
    } catch (error) {
      console.error("Error syncing news:", error);
    }
  }
}

export const newsService = new NewsService();
