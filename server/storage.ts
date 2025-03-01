import { users, referrals, transactions, news, userNewsInteractions, userNewsPreferences } from "@shared/schema";
import { type User, type InsertUser, type Referral, type InsertReferral, type Transaction, type InsertTransaction, type News, type InsertNews, type UserNewsInteraction, type InsertUserNewsInteraction, type UserNewsPreferences, type InsertUserNewsPreferences } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: string): Promise<User>;
  updateUserTelegramId(id: number, telegramId: string): Promise<User>;

  // Referral operations
  getReferrals(referrerId: number): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;

  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // New operations for news
  getNews(id: number): Promise<News | undefined>;
  listNews(limit?: number): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  getUserNewsPreferences(userId: number): Promise<UserNewsPreferences | undefined>;
  updateUserNewsPreferences(userId: number, preferences: InsertUserNewsPreferences): Promise<UserNewsPreferences>;
  createUserNewsInteraction(interaction: InsertUserNewsInteraction): Promise<UserNewsInteraction>;
  getRecommendedNews(userId: number, limit?: number): Promise<News[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const referralCode = nanoid(8);
    const [user] = await db.insert(users).values({
      ...insertUser,
      points: "0.00",
      telegramId: null,
      referralCode,
    }).returning();
    return user;
  }

  async updateUserPoints(id: number, points: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ points })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserTelegramId(id: number, telegramId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ telegramId })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getReferrals(referrerId: number): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, referrerId));
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values(insertReferral)
      .returning();
    return referral;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getNews(id: number): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article;
  }

  async listNews(limit: number = 20): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }

  async createNews(article: InsertNews): Promise<News> {
    const [created] = await db
      .insert(news)
      .values(article)
      .returning();
    return created;
  }

  async getUserNewsPreferences(userId: number): Promise<UserNewsPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userNewsPreferences)
      .where(eq(userNewsPreferences.userId, userId));
    return preferences;
  }

  async updateUserNewsPreferences(
    userId: number,
    preferences: InsertUserNewsPreferences
  ): Promise<UserNewsPreferences> {
    const [updated] = await db
      .insert(userNewsPreferences)
      .values({ ...preferences, userId })
      .onConflict(and(eq(userNewsPreferences.userId, userId)))
      .merge()
      .returning();
    return updated;
  }

  async createUserNewsInteraction(
    interaction: InsertUserNewsInteraction
  ): Promise<UserNewsInteraction> {
    const [created] = await db
      .insert(userNewsInteractions)
      .values(interaction)
      .returning();
    return created;
  }

  async getRecommendedNews(userId: number, limit: number = 10): Promise<News[]> {
    const preferences = await this.getUserNewsPreferences(userId);

    if (!preferences) {
      // If no preferences, return latest news
      return this.listNews(limit);
    }

    // Use sql template for safe query construction
    return await db
      .select()
      .from(news)
      .where(
        preferences.categories.length > 0
          ? sql`${news.category} = ANY(${preferences.categories}::text[])`
          : sql`1=1`
      )
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();