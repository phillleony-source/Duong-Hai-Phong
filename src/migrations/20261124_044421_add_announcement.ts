import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "announcement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"link" varchar,
  	"speed" numeric DEFAULT 25,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "announcement_locales" (
  	"text" varchar,
  	"highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "announcement_locales" ADD CONSTRAINT "announcement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "announcement_visible_idx" ON "announcement" USING btree ("visible");
  CREATE UNIQUE INDEX "announcement_locales_locale_parent_id_unique" ON "announcement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "announcement_locales_parent_id_idx" ON "announcement_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "announcement" CASCADE;
  DROP TABLE "announcement_locales" CASCADE;`)
}
