import { db } from "./db";
import { users } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

const adminUsers = [
  { username: "superadmin", password: "SA_" + randomBytes(8).toString("hex"), role: "SUPERADMIN" },
  { username: "tarak", password: "Admin_" + randomBytes(8).toString("hex"), role: "ADMIN" },
  { username: "hamza", password: "Admin_" + randomBytes(8).toString("hex"), role: "ADMIN" },
  { username: "dokho", password: "Admin_" + randomBytes(8).toString("hex"), role: "ADMIN" },
  { username: "asmaa", password: "Admin_" + randomBytes(8).toString("hex"), role: "ADMIN" },
];

export async function setupAdminUsers() {
  console.log("Setting up admin users...");
  console.log("IMPORTANT: Save these credentials securely!");
  console.log("----------------------------------------");

  for (const admin of adminUsers) {
    const hashedPassword = await hashPassword(admin.password);
    
    try {
      const [user] = await db
        .insert(users)
        .values({
          username: admin.username,
          password: hashedPassword,
          role: admin.role as "ADMIN" | "SUPERADMIN",
          points: "0",
        })
        .onConflictDoNothing()
        .returning();

      if (user) {
        console.log(`Created ${admin.role}:`);
        console.log(`Username: ${admin.username}`);
        console.log(`Password: ${admin.password}`);
        console.log("----------------------------------------");
      }
    } catch (error) {
      console.error(`Failed to create admin user ${admin.username}:`, error);
    }
  }
}
