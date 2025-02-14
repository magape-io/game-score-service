CREATE TABLE "game_rate_v2" (
	"id" serial PRIMARY KEY NOT NULL,
	"gameId" integer NOT NULL,
	"like" integer NOT NULL,
	"dislike" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "game_rate_v2" ADD CONSTRAINT "game_rate_v2_gameId_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;