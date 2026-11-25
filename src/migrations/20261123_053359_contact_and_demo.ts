import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "is_demo" boolean DEFAULT false;
   CREATE TABLE portfolio_contact_limits (
     bucket bigint NOT NULL,
     key text NOT NULL,
     attempts integer NOT NULL,
     PRIMARY KEY (bucket, key)
   );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE portfolio_contact_limits;
   ALTER TABLE "site_settings" DROP COLUMN "is_demo";`)
}
