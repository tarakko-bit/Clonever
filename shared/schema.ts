import { pgTable, text, serial, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  telegramId: text("telegram_id").unique(),
  points: decimal("points", { precision: 10, scale: 2 }).default("0").notNull(),
  referralCode: text("referral_code").unique(),
  preferences: jsonb("preferences").default({}).notNull(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userNewsInteractions = pgTable("user_news_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  newsId: integer("news_id").notNull().references(() => news.id),
  interaction: text("interaction", { enum: ["READ", "LIKE", "SHARE", "SAVE"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userNewsPreferences = pgTable("user_news_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  categories: jsonb("categories").default([]).notNull(),
  keywords: jsonb("keywords").default([]).notNull(),
  sources: jsonb("sources").default([]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").notNull().references(() => users.id),
  points: decimal("points", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["DEPOSIT", "WITHDRAWAL", "CONVERT"] }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, createdAt: true });
export const insertUserNewsInteractionSchema = createInsertSchema(userNewsInteractions).omit({ id: true, createdAt: true });
export const insertUserNewsPreferencesSchema = createInsertSchema(userNewsPreferences).omit({ id: true, updatedAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type UserNewsInteraction = typeof userNewsInteractions.$inferSelect;
export type InsertUserNewsInteraction = z.infer<typeof insertUserNewsInteractionSchema>;
export type UserNewsPreferences = typeof userNewsPreferences.$inferSelect;
export type InsertUserNewsPreferences = z.infer<typeof insertUserNewsPreferencesSchema>;