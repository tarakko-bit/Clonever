import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import TelegramBot from "node-telegram-bot-api";
import { insertUserSchema, insertReferralSchema, insertTransactionSchema } from "@shared/schema";
import { setupAdminUsers } from "./adminSetup";
import { setupAuth } from "./auth";

// Mock conversion rate
const POINTS_TO_USD_RATE = 0.01;

function isAdmin(req: any) {
  return req.isAuthenticated() && (req.user?.role === "ADMIN" || req.user?.role === "SUPERADMIN");
}

function isSuperAdmin(req: any) {
  return req.isAuthenticated() && req.user?.role === "SUPERADMIN";
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup admin users on startup
  await setupAdminUsers();

  // Setup authentication
  setupAuth(app);

  // Initialize Telegram bot
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "mock_token", { polling: true });

  // Bot commands
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from?.username;
    const user = await storage.getUserByTelegramId(chatId.toString());

    if (!user) {
      bot.sendMessage(chatId, 
        "Welcome! Please provide your referral code to link your account.\n" +
        "Use the command: /link YOUR_REFERRAL_CODE"
      );
      return;
    }

    bot.sendMessage(chatId, `Welcome back ${user.username}! Use /balance to check your points.`);
  });

  bot.onText(/\/link (.+)/, async (msg, match) => {
    if (!match) return;

    const chatId = msg.chat.id;
    const referralCode = match[1];

    // Find user by referral code
    const users = Array.from((await storage.getAllUsers()).values());
    const user = users.find(u => u.referralCode === referralCode);

    if (!user) {
      bot.sendMessage(chatId, "Invalid referral code. Please try again.");
      return;
    }

    if (user.telegramId) {
      bot.sendMessage(chatId, "This account is already linked to Telegram.");
      return;
    }

    // Update user's telegram ID
    await storage.updateUserTelegramId(user.id, chatId.toString());
    bot.sendMessage(chatId, 
      "Successfully linked your account!\n" +
      "You can now use the following commands:\n" +
      "/balance - Check your points balance\n" +
      "/referrals - View your referral statistics"
    );
  });

  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await storage.getUserByTelegramId(chatId.toString());

    if (!user) {
      bot.sendMessage(chatId, "Please link your account first using /link YOUR_REFERRAL_CODE");
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

  // Admin Routes
  app.get("/api/admin/users", async (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized" });
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/admin/referrals", async (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized" });
    const referrals = await storage.getAllReferrals();
    res.json(referrals);
  });

  // SuperAdmin only routes
  app.post("/api/admin/bulk-send", async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json({ message: "Unauthorized" });
    const { transactions } = req.body;
    // Implementation for bulk send will go here
    res.json({ status: "Processing bulk transactions" });
  });

  return httpServer;
}