CREATE TABLE "score_name" (
	"id" serial PRIMARY KEY NOT NULL,
	"score_id" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "score_name" ADD CONSTRAINT "score_name_score_id_score_id_fk" FOREIGN KEY ("score_id") REFERENCES "public"."score"("id") ON DELETE no action ON UPDATE no action;