CREATE TYPE "public"."session_type" AS ENUM('email_verification', 'password_reset', 'two_factor', 'login_verification');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" varchar(6) NOT NULL,
	"type" "session_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"data" varchar(1000)
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;