CREATE TABLE "achievement" (
	"id" serial PRIMARY KEY NOT NULL,
	"achievementId" integer NOT NULL,
	"accountId" integer NOT NULL,
	"complete" boolean DEFAULT false,
	"complete_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "achievement_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"gameId" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_achievementId_achievement_type_id_fk" FOREIGN KEY ("achievementId") REFERENCES "public"."achievement_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_achievement_id_achievement_type_id_fk" FOREIGN KEY ("achievementId") REFERENCES "public"."achievement_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_account_id_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_type" ADD CONSTRAINT "achievement_type_gameId_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;