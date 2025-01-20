ALTER TABLE "score_name" DROP CONSTRAINT "score_name_score_id_score_id_fk";
--> statement-breakpoint
ALTER TABLE "score_name" ADD COLUMN "game_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "score_name" ADD CONSTRAINT "score_name_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_name" DROP COLUMN "score_id";