ALTER TABLE "achievement_type" ADD COLUMN "reward" text;--> statement-breakpoint
ALTER TABLE "achievement_type" ADD COLUMN "created_at" timestamp DEFAULT now();