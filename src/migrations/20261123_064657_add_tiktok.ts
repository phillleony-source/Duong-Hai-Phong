import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_social_links_platform" ADD VALUE 'tiktok';
  ALTER TYPE "public"."enum_social_links_icon" ADD VALUE 'tiktok';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_social_links_platform";
  CREATE TYPE "public"."enum_social_links_platform" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external');
  ALTER TABLE "social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_social_links_platform" USING "platform"::"public"."enum_social_links_platform";
  ALTER TABLE "social_links" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_social_links_icon";
  CREATE TYPE "public"."enum_social_links_icon" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external');
  ALTER TABLE "social_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_social_links_icon" USING "icon"::"public"."enum_social_links_icon";`)
}
