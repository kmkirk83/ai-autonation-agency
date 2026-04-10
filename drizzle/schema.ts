import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for capturing business inquiries from the landing page.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  serviceInterest: mysqlEnum("serviceInterest", [
    "AI Voice Receptionist",
    "Lead Reactivation Bot",
    "Customer Support Automation",
  ]).notNull(),
  status: mysqlEnum("status", ["New", "Contacted", "Closed"]).default("New").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Outreach assets table for storing generated cold emails and Loom scripts.
 */
export const outreachAssets = mysqlTable("outreachAssets", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  niche: varchar("niche", { length: 255 }).notNull(),
  coldEmail: text("coldEmail").notNull(),
  loomScript: text("loomScript").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OutreachAsset = typeof outreachAssets.$inferSelect;
export type InsertOutreachAsset = typeof outreachAssets.$inferInsert;