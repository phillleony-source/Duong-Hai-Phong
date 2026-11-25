import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar
  );
  
  CREATE TABLE "process_steps_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "process" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "process_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "process_steps" ADD CONSTRAINT "process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "process_steps_locales" ADD CONSTRAINT "process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "process_locales" ADD CONSTRAINT "process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "process_steps_order_idx" ON "process_steps" USING btree ("_order");
  CREATE INDEX "process_steps_parent_id_idx" ON "process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "process_steps_locales_locale_parent_id_unique" ON "process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "process_steps_locales_parent_id_idx" ON "process_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "process_visible_idx" ON "process" USING btree ("visible");
  CREATE UNIQUE INDEX "process_locales_locale_parent_id_unique" ON "process_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "process_locales_parent_id_idx" ON "process_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "process_steps" CASCADE;
  DROP TABLE "process_steps_locales" CASCADE;
  DROP TABLE "process" CASCADE;
  DROP TABLE "process_locales" CASCADE;`)
}
