ALTER TABLE "game" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "bannerImages" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "status" integer;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "platforms" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "networkId" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "briefDescription" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "developers" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "createBy" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP;