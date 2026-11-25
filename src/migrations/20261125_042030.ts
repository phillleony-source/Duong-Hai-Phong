import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_social_links_platform" ADD VALUE 'threads';
  ALTER TYPE "public"."enum_social_links_platform" ADD VALUE 'flickr';
  ALTER TYPE "public"."enum_social_links_icon" ADD VALUE 'threads';
  ALTER TYPE "public"."enum_social_links_icon" ADD VALUE 'flickr';
  ALTER TABLE "contact_submissions" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "message" DROP NOT NULL;
  ALTER TABLE "contact_submissions" ADD COLUMN "facebook_url" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "consent" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "established_year" varchar DEFAULT '2016';
  ALTER TABLE "site_settings_locales" ADD COLUMN "short_name" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "google_maps_url" varchar;
  ALTER TABLE "contact_settings_locales" ADD COLUMN "studio_address" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_social_links_platform";
  CREATE TYPE "public"."enum_social_links_platform" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external', 'tiktok');
  ALTER TABLE "social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_social_links_platform" USING "platform"::"public"."enum_social_links_platform";
  ALTER TABLE "social_links" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_social_links_icon";
  CREATE TYPE "public"."enum_social_links_icon" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external', 'tiktok');
  ALTER TABLE "social_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_social_links_icon" USING "icon"::"public"."enum_social_links_icon";
  ALTER TABLE "contact_submissions" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "contact_submissions" ALTER COLUMN "message" SET NOT NULL;
  ALTER TABLE "contact_submissions" DROP COLUMN "facebook_url";
  ALTER TABLE "contact_submissions" DROP COLUMN "consent";
  ALTER TABLE "site_settings" DROP COLUMN "established_year";
  ALTER TABLE "site_settings_locales" DROP COLUMN "short_name";
  ALTER TABLE "contact_settings" DROP COLUMN "google_maps_url";
  ALTER TABLE "contact_settings_locales" DROP COLUMN "studio_address";`)
}
