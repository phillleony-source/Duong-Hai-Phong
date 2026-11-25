import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_budget_range" AS ENUM('under-5m', '5m-to-under-15m', '15m-to-under-30m', '30m-plus', 'to-discuss');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'contacted', 'in-progress', 'closed');
  ALTER TABLE "contact_submissions" ADD COLUMN "project_date" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "budget_range" "enum_contact_submissions_budget_range";
  ALTER TABLE "contact_submissions" ADD COLUMN "status" "enum_contact_submissions_status" DEFAULT 'new';
  ALTER TABLE "contact_submissions" ADD COLUMN "internal_notes" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "work_eyebrow" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "work_action" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_lead" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_heading" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_action" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_tagline" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "footer_description" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "featured_statement" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "editorial_body" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "closing_statement" varchar;
  ALTER TABLE "contact_settings_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "contact_settings_locales" ADD COLUMN "submit_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DROP COLUMN "project_date";
  ALTER TABLE "contact_submissions" DROP COLUMN "budget_range";
  ALTER TABLE "contact_submissions" DROP COLUMN "status";
  ALTER TABLE "contact_submissions" DROP COLUMN "internal_notes";
  ALTER TABLE "site_settings_locales" DROP COLUMN "work_eyebrow";
  ALTER TABLE "site_settings_locales" DROP COLUMN "work_action";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_lead";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_heading";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_action";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_tagline";
  ALTER TABLE "site_settings_locales" DROP COLUMN "footer_description";
  ALTER TABLE "about_locales" DROP COLUMN "featured_statement";
  ALTER TABLE "about_locales" DROP COLUMN "editorial_body";
  ALTER TABLE "about_locales" DROP COLUMN "closing_statement";
  ALTER TABLE "contact_settings_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "contact_settings_locales" DROP COLUMN "submit_label";
  DROP TYPE "public"."enum_contact_submissions_budget_range";
  DROP TYPE "public"."enum_contact_submissions_status";`)
}
