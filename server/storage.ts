import { type User, type InsertUser, type Referral, type InsertReferral, type Transaction, type InsertTransaction } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: string): Promise<User>;

  // Referral operations
  getReferrals(referrerId: number): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;

  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private referrals: Map<number, Referral>;
  private transactions: Map<number, Transaction>;
  private currentIds: { users: number; referrals: number; transactions: number };

  constructor() {
    this.users = new Map();
    this.referrals = new Map();
    this.transactions = new Map();
    this.currentIds = { users: 1, referrals: 1, transactions: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.telegramId === telegramId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = {
      ...insertUser,
      id,
      points: "0.00",
      telegramId: null,
      referralCode: nanoid(8), // Generate a unique 8-character referral code
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: number, points: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, points };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getReferrals(referrerId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      referral => referral.referrerId === referrerId
    );
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentIds.referrals++;
    const referral: Referral = {
      ...insertReferral,
      id,
      points: "0.00",
      createdAt: new Date(),
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.userId === userId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transactions++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();