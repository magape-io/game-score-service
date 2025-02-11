ALTER TABLE "game_rating" DROP CONSTRAINT "game_rating_account_game_unique";--> statement-breakpoint
ALTER TABLE "game_rating" DROP CONSTRAINT "game_rating_accountId_account_id_fk";
--> statement-breakpoint
ALTER TABLE "game_rating" DROP CONSTRAINT "game_rating_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "game_rating" DROP COLUMN "accountId";--> statement-breakpoint
ALTER TABLE "game_rating" DROP COLUMN "updated_at";