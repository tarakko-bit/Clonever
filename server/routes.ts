import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import TelegramBot from "node-telegram-bot-api";
import { insertUserSchema, insertReferralSchema, insertTransactionSchema } from "@shared/schema";

// Mock conversion rate
const POINTS_TO_USD_RATE = 0.01;

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize Telegram bot
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "mock_token", { polling: true });

  // Bot commands
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await storage.getUserByTelegramId(chatId.toString());

    if (!user) {
      bot.sendMessage(chatId, "Welcome! Please register on our website first.");
      return;
    }

    bot.sendMessage(chatId, `Welcome back ${user.username}! Use /balance to check your points.`);
  });

  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await storage.getUserByTelegramId(chatId.toString());

    if (!user) {
      bot.sendMessage(chatId, "Please register on our website first.");
      return;
    }

    bot.sendMessage(chatId, `Your current balance: ${user.points} points`);
  });

  // API Routes
  app.get("/api/user/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  // Create a test user for development
  app.post("/api/test-user", async (_req, res) => {
    const testUser = await storage.createUser({
      username: "testuser",
      password: "password123",
      telegramId: null,
      points: "1000.00",
      referralCode: null,
    });
    res.json(testUser);
  });

  app.post("/api/users", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const user = await storage.createUser(parsed.data);
    res.json(user);
  });

  app.get("/api/referrals/:userId", async (req, res) => {
    const referrals = await storage.getReferrals(parseInt(req.params.userId));
    res.json(referrals);
  });

  app.post("/api/referrals", async (req, res) => {
    const parsed = insertReferralSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const referral = await storage.createReferral(parsed.data);
    res.json(referral);
  });

  app.get("/api/transactions/:userId", async (req, res) => {
    const transactions = await storage.getTransactions(parseInt(req.params.userId));
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    const parsed = insertTransactionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const transaction = await storage.createTransaction(parsed.data);
    res.json(transaction);
  });

  app.get("/api/convert/rate", (_req, res) => {
    res.json({ rate: POINTS_TO_USD_RATE });
  });

  return httpServer;
}