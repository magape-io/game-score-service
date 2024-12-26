CREATE TABLE "account" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	CONSTRAINT "account_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "score" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "special_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "special_item_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"score" integer NOT NULL,
	"account_id" integer NOT NULL,
	"special_item_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "score" ADD CONSTRAINT "score_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score" ADD CONSTRAINT "score_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "special_item_score" ADD CONSTRAINT "special_item_score_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "special_item_score" ADD CONSTRAINT "special_item_score_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "special_item_score" ADD CONSTRAINT "special_item_score_special_item_id_special_item_id_fk" FOREIGN KEY ("special_item_id") REFERENCES "public"."special_item"("id") ON DELETE no action ON UPDATE no action;