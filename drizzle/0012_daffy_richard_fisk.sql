CREATE TABLE "game_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"gameId" integer NOT NULL,
	"accountId" integer NOT NULL,
	"isLike" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "game_rating_account_game_unique" UNIQUE("accountId","gameId")
);
--> statement-breakpoint
ALTER TABLE "game_rating" ADD CONSTRAINT "game_rating_gameId_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rating" ADD CONSTRAINT "game_rating_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rating" ADD CONSTRAINT "game_rating_game_id_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rating" ADD CONSTRAINT "game_rating_account_id_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;