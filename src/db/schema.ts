import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const account = pgTable("account", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
});

export const game = pgTable("game", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const score = pgTable("score", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .references(() => game.id)
    .notNull(),
  accountId: integer("account_id")
    .references(() => account.id)
    .notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const specialItem = pgTable("special_item", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const specialItemScore = pgTable("special_item_score", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .references(() => game.id)
    .notNull(),
  score: integer("score").notNull(),
  accountId: integer("account_id")
    .references(() => account.id)
    .notNull(),
  specialItemId: integer("special_item_id")
    .references(() => specialItem.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
