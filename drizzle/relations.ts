import { relations } from "drizzle-orm/relations";
import { game, score, account, specialItemScore, specialItem } from "./schema";

export const scoreRelations = relations(score, ({one}) => ({
	game: one(game, {
		fields: [score.gameId],
		references: [game.id]
	}),
	account: one(account, {
		fields: [score.accountId],
		references: [account.id]
	}),
}));

export const gameRelations = relations(game, ({many}) => ({
	scores: many(score),
	specialItemScores: many(specialItemScore),
}));

export const accountRelations = relations(account, ({many}) => ({
	scores: many(score),
	specialItemScores: many(specialItemScore),
}));

export const specialItemScoreRelations = relations(specialItemScore, ({one}) => ({
	game: one(game, {
		fields: [specialItemScore.gameId],
		references: [game.id]
	}),
	account: one(account, {
		fields: [specialItemScore.accountId],
		references: [account.id]
	}),
	specialItem: one(specialItem, {
		fields: [specialItemScore.specialItemId],
		references: [specialItem.id]
	}),
}));

export const specialItemRelations = relations(specialItem, ({many}) => ({
	specialItemScores: many(specialItemScore),
}));