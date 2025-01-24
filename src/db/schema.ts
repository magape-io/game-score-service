import { pgTable, serial, text, timestamp, foreignKey, integer, unique, boolean } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"

export const game = pgTable("game", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	url: text(),
	icon: text(),
	bannerImages: text(),
	status: integer(),
	type: text(),
	platforms: text(),
	address: text(),
	networkId: text(),
	briefDescription: text(),
	description: text(),
	developers: text(),
	createBy: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const score = pgTable("score", {
	id: serial().primaryKey().notNull(),
	gameId: integer("game_id").notNull(),
	accountId: integer("account_id").notNull(),
	score: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "score_game_id_game_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [account.id],
			name: "score_account_id_account_id_fk"
		}),
]);

export const scoreRelations = relations(score, ({ one }) => ({
	account: one(account, {
	  fields: [score.accountId],
	  references: [account.id],
	}),
	scoreName: one(scoreName, {
	  fields: [score.gameId],
	  references: [scoreName.gameId],
	})
  }));

export const scoreName = pgTable("score_name", {
  id: serial().primaryKey().notNull(),
  gameId: integer("game_id").notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({
      columns: [table.gameId],
      foreignColumns: [game.id],
      name: "score_name_game_id_game_id_fk"
    }),
]);

export const account = pgTable("account", {
	id: serial().primaryKey().notNull(),
	address: text().notNull(),
}, (table) => [
	unique("account_address_unique").on(table.address),
]);

export const specialItemScore = pgTable("special_item_score", {
	id: serial().primaryKey().notNull(),
	gameId: integer("game_id").notNull(),
	score: integer().notNull(),
	accountId: integer("account_id").notNull(),
	specialItemId: integer("special_item_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "special_item_score_game_id_game_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [account.id],
			name: "special_item_score_account_id_account_id_fk"
		}),
	foreignKey({
			columns: [table.specialItemId],
			foreignColumns: [specialItem.id],
			name: "special_item_score_special_item_id_special_item_id_fk"
		}),
]);

export const specialItem = pgTable("special_item", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
});

// 成就类型表
export const achievementType = pgTable("achievement_type", {
  id: serial().primaryKey().notNull(),
  gameId: integer().references(() => game.id).notNull(),
  name: text().notNull(),
});

// 成就记录表（用户完成的成就）
export const achievement = pgTable("achievement", {
  id: serial().primaryKey().notNull(),
  achievementId: integer().references(() => achievementType.id).notNull(),  // 关联到achievement_type
  accountId: integer().references(() => account.id).notNull(),             // 关联到account
  complete: boolean().default(false),
  completeTime: timestamp("complete_time", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.achievementId],
		foreignColumns: [achievementType.id],
		name: "achievement_achievement_id_achievement_type_id_fk"
	}),
	foreignKey({
		columns: [table.accountId],
		foreignColumns: [account.id],
		name: "achievement_account_id_account_id_fk"
	}),
  unique("achievement_account_achievement_unique").on(table.accountId, table.achievementId)
]);

// 表关系定义
export const achievementTypeRelations = relations(achievementType, ({ one }) => ({
  game: one(game, {
    fields: [achievementType.gameId],
    references: [game.id],
  }),
}));

export const achievementRelations = relations(achievement, ({ one }) => ({
  achievementType: one(achievementType, {
    fields: [achievement.achievementId],
    references: [achievementType.id],
  }),
  account: one(account, {
    fields: [achievement.accountId],
    references: [account.id],
  }),
}));
