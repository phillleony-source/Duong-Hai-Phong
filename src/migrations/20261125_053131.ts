import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_locales" ADD COLUMN "slogan_quote" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "slogan_author" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_locales" DROP COLUMN "slogan_quote";
  ALTER TABLE "site_settings_locales" DROP COLUMN "slogan_author";`)
}
