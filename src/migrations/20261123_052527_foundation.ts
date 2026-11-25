import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_case_studies_blocks_spacer_size" AS ENUM('small', 'large');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_blocks_spacer_size" AS ENUM('small', 'large');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_social_links_platform" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external');
  CREATE TYPE "public"."enum_social_links_icon" AS ENUM('instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external');
  CREATE TYPE "public"."enum_contact_submissions_delivery" AS ENUM('pending', 'sent', 'failed', 'disabled');
  CREATE TYPE "public"."enum_hero_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_hero_alignment" AS ENUM('left', 'center');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"duration_seconds" numeric,
  	"poster_id" integer,
  	"delivery_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_w640_url" varchar,
  	"sizes_w640_width" numeric,
  	"sizes_w640_height" numeric,
  	"sizes_w640_mime_type" varchar,
  	"sizes_w640_filesize" numeric,
  	"sizes_w640_filename" varchar,
  	"sizes_w1120_url" varchar,
  	"sizes_w1120_width" numeric,
  	"sizes_w1120_height" numeric,
  	"sizes_w1120_mime_type" varchar,
  	"sizes_w1120_filesize" numeric,
  	"sizes_w1120_filename" varchar,
  	"sizes_w1920_url" varchar,
  	"sizes_w1920_width" numeric,
  	"sizes_w1920_height" numeric,
  	"sizes_w1920_mime_type" varchar,
  	"sizes_w1920_filesize" numeric,
  	"sizes_w1920_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "service_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category_id" integer,
  	"cover_id" integer,
  	"featured" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"seo_image_id" integer,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"cta_label" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_cover_id" integer,
  	"version_featured" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_visible" boolean DEFAULT true,
  	"version_seo_image_id" integer,
  	"version_cta_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_cta_label" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "case_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_single_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_full_width_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_case_studies_blocks_spacer_size" DEFAULT 'small',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category_id" integer,
  	"cover_id" integer,
  	"featured" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"seo_image_id" integer,
  	"cta_href" varchar,
  	"cover_video_id" integer,
  	"project_date" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"cta_label" varchar,
  	"client" varchar,
  	"photographer" varchar,
  	"model" varchar,
  	"stylist" varchar,
  	"makeup" varchar,
  	"collaborators" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "_case_studies_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_single_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_full_width_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_id" integer,
  	"right_id" integer,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__case_studies_v_blocks_spacer_size" DEFAULT 'small',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_cover_id" integer,
  	"version_featured" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_visible" boolean DEFAULT true,
  	"version_seo_image_id" integer,
  	"version_cta_href" varchar,
  	"version_cover_video_id" integer,
  	"version_project_date" timestamp(3) with time zone,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__case_studies_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_cta_label" varchar,
  	"version_client" varchar,
  	"version_photographer" varchar,
  	"version_model" varchar,
  	"version_stylist" varchar,
  	"version_makeup" varchar,
  	"version_collaborators" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_social_links_platform" NOT NULL,
  	"href" varchar NOT NULL,
  	"icon" "enum_social_links_icon",
  	"sort_order" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_links_locales" (
  	"label" varchar NOT NULL,
  	"tooltip" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"service_id" integer,
  	"message" varchar NOT NULL,
  	"delivery" "enum_contact_submissions_delivery" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"service_categories_id" integer,
  	"services_id" integer,
  	"case_categories_id" integer,
  	"case_studies_id" integer,
  	"social_links_id" integer,
  	"contact_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"name" varchar,
  	"descriptor" varchar,
  	"tagline" varchar,
  	"copyright" varchar,
  	"services_heading" varchar,
  	"services_description" varchar,
  	"work_heading" varchar,
  	"work_description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"media_type" "enum_hero_media_type" DEFAULT 'image',
  	"desktop_image_id" integer,
  	"mobile_image_id" integer,
  	"desktop_video_id" integer,
  	"mobile_video_id" integer,
  	"poster_id" integer,
  	"fallback_id" integer,
  	"primary_href" varchar,
  	"secondary_href" varchar,
  	"overlay" numeric DEFAULT 42,
  	"alignment" "enum_hero_alignment" DEFAULT 'left',
  	"loop" boolean DEFAULT true,
  	"sound" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero_locales" (
  	"eyebrow" varchar,
  	"headline" varchar,
  	"accent" varchar,
  	"description" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "about_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"portrait_id" integer,
  	"video_id" integer,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"heading" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"biography" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"email" varchar,
  	"phone" varchar,
  	"recipient" varchar,
  	"form_visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_settings_locales" (
  	"heading" varchar,
  	"description" varchar,
  	"location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_categories_locales" ADD CONSTRAINT "service_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_category_id_service_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_categories_locales" ADD CONSTRAINT "case_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_rich_text" ADD CONSTRAINT "case_studies_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_single_image" ADD CONSTRAINT "case_studies_blocks_single_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_single_image" ADD CONSTRAINT "case_studies_blocks_single_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_full_width_image" ADD CONSTRAINT "case_studies_blocks_full_width_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_full_width_image" ADD CONSTRAINT "case_studies_blocks_full_width_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_two_column_images" ADD CONSTRAINT "case_studies_blocks_two_column_images_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_two_column_images" ADD CONSTRAINT "case_studies_blocks_two_column_images_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_two_column_images" ADD CONSTRAINT "case_studies_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_image_gallery" ADD CONSTRAINT "case_studies_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_quote" ADD CONSTRAINT "case_studies_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_video_embed" ADD CONSTRAINT "case_studies_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_divider" ADD CONSTRAINT "case_studies_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks_spacer" ADD CONSTRAINT "case_studies_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_category_id_case_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."case_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_video_id_media_id_fk" FOREIGN KEY ("cover_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_rich_text" ADD CONSTRAINT "_case_studies_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_single_image" ADD CONSTRAINT "_case_studies_v_blocks_single_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_single_image" ADD CONSTRAINT "_case_studies_v_blocks_single_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_full_width_image" ADD CONSTRAINT "_case_studies_v_blocks_full_width_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_full_width_image" ADD CONSTRAINT "_case_studies_v_blocks_full_width_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_two_column_images" ADD CONSTRAINT "_case_studies_v_blocks_two_column_images_left_id_media_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_two_column_images" ADD CONSTRAINT "_case_studies_v_blocks_two_column_images_right_id_media_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_two_column_images" ADD CONSTRAINT "_case_studies_v_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_image_gallery" ADD CONSTRAINT "_case_studies_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_quote" ADD CONSTRAINT "_case_studies_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_video_embed" ADD CONSTRAINT "_case_studies_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_divider" ADD CONSTRAINT "_case_studies_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_blocks_spacer" ADD CONSTRAINT "_case_studies_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_category_id_case_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."case_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_video_id_media_id_fk" FOREIGN KEY ("version_cover_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_links_locales" ADD CONSTRAINT "social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_categories_fk" FOREIGN KEY ("service_categories_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_categories_fk" FOREIGN KEY ("case_categories_id") REFERENCES "public"."case_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_links_fk" FOREIGN KEY ("social_links_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_desktop_image_id_media_id_fk" FOREIGN KEY ("desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_desktop_video_id_media_id_fk" FOREIGN KEY ("desktop_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_mobile_video_id_media_id_fk" FOREIGN KEY ("mobile_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_fallback_id_media_id_fk" FOREIGN KEY ("fallback_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_locales" ADD CONSTRAINT "hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_links" ADD CONSTRAINT "about_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_links_locales" ADD CONSTRAINT "about_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_settings_locales" ADD CONSTRAINT "contact_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_w640_sizes_w640_filename_idx" ON "media" USING btree ("sizes_w640_filename");
  CREATE INDEX "media_sizes_w1120_sizes_w1120_filename_idx" ON "media" USING btree ("sizes_w1120_filename");
  CREATE INDEX "media_sizes_w1920_sizes_w1920_filename_idx" ON "media" USING btree ("sizes_w1920_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_categories_slug_idx" ON "service_categories" USING btree ("slug");
  CREATE INDEX "service_categories_sort_order_idx" ON "service_categories" USING btree ("sort_order");
  CREATE INDEX "service_categories_visible_idx" ON "service_categories" USING btree ("visible");
  CREATE INDEX "service_categories_updated_at_idx" ON "service_categories" USING btree ("updated_at");
  CREATE INDEX "service_categories_created_at_idx" ON "service_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "service_categories_locales_locale_parent_id_unique" ON "service_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_categories_locales_parent_id_idx" ON "service_categories_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");
  CREATE INDEX "services_cover_idx" ON "services" USING btree ("cover_id");
  CREATE INDEX "services_sort_order_idx" ON "services" USING btree ("sort_order");
  CREATE INDEX "services_visible_idx" ON "services" USING btree ("visible");
  CREATE INDEX "services_seo_seo_image_idx" ON "services" USING btree ("seo_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "services_locales" USING btree ("_parent_id");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_media_id_idx" ON "services_rels" USING btree ("media_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_category_idx" ON "_services_v" USING btree ("version_category_id");
  CREATE INDEX "_services_v_version_version_cover_idx" ON "_services_v" USING btree ("version_cover_id");
  CREATE INDEX "_services_v_version_version_sort_order_idx" ON "_services_v" USING btree ("version_sort_order");
  CREATE INDEX "_services_v_version_version_visible_idx" ON "_services_v" USING btree ("version_visible");
  CREATE INDEX "_services_v_version_seo_version_seo_image_idx" ON "_services_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_locales_parent_id_idx" ON "_services_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_media_id_idx" ON "_services_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "case_categories_slug_idx" ON "case_categories" USING btree ("slug");
  CREATE INDEX "case_categories_sort_order_idx" ON "case_categories" USING btree ("sort_order");
  CREATE INDEX "case_categories_visible_idx" ON "case_categories" USING btree ("visible");
  CREATE INDEX "case_categories_updated_at_idx" ON "case_categories" USING btree ("updated_at");
  CREATE INDEX "case_categories_created_at_idx" ON "case_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "case_categories_locales_locale_parent_id_unique" ON "case_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_categories_locales_parent_id_idx" ON "case_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_rich_text_order_idx" ON "case_studies_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_rich_text_parent_id_idx" ON "case_studies_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_rich_text_path_idx" ON "case_studies_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_rich_text_locale_idx" ON "case_studies_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_single_image_order_idx" ON "case_studies_blocks_single_image" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_single_image_parent_id_idx" ON "case_studies_blocks_single_image" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_single_image_path_idx" ON "case_studies_blocks_single_image" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_single_image_locale_idx" ON "case_studies_blocks_single_image" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_single_image_image_idx" ON "case_studies_blocks_single_image" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_full_width_image_order_idx" ON "case_studies_blocks_full_width_image" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_full_width_image_parent_id_idx" ON "case_studies_blocks_full_width_image" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_full_width_image_path_idx" ON "case_studies_blocks_full_width_image" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_full_width_image_locale_idx" ON "case_studies_blocks_full_width_image" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_full_width_image_image_idx" ON "case_studies_blocks_full_width_image" USING btree ("image_id");
  CREATE INDEX "case_studies_blocks_two_column_images_order_idx" ON "case_studies_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_two_column_images_parent_id_idx" ON "case_studies_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_two_column_images_path_idx" ON "case_studies_blocks_two_column_images" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_two_column_images_locale_idx" ON "case_studies_blocks_two_column_images" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_two_column_images_left_idx" ON "case_studies_blocks_two_column_images" USING btree ("left_id");
  CREATE INDEX "case_studies_blocks_two_column_images_right_idx" ON "case_studies_blocks_two_column_images" USING btree ("right_id");
  CREATE INDEX "case_studies_blocks_image_gallery_order_idx" ON "case_studies_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_image_gallery_parent_id_idx" ON "case_studies_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_image_gallery_path_idx" ON "case_studies_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_image_gallery_locale_idx" ON "case_studies_blocks_image_gallery" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_quote_order_idx" ON "case_studies_blocks_quote" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_quote_parent_id_idx" ON "case_studies_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_quote_path_idx" ON "case_studies_blocks_quote" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_quote_locale_idx" ON "case_studies_blocks_quote" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_video_embed_order_idx" ON "case_studies_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_video_embed_parent_id_idx" ON "case_studies_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_video_embed_path_idx" ON "case_studies_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_video_embed_locale_idx" ON "case_studies_blocks_video_embed" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_divider_order_idx" ON "case_studies_blocks_divider" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_divider_parent_id_idx" ON "case_studies_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_divider_path_idx" ON "case_studies_blocks_divider" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_divider_locale_idx" ON "case_studies_blocks_divider" USING btree ("_locale");
  CREATE INDEX "case_studies_blocks_spacer_order_idx" ON "case_studies_blocks_spacer" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_spacer_parent_id_idx" ON "case_studies_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "case_studies_blocks_spacer_path_idx" ON "case_studies_blocks_spacer" USING btree ("_path");
  CREATE INDEX "case_studies_blocks_spacer_locale_idx" ON "case_studies_blocks_spacer" USING btree ("_locale");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_category_idx" ON "case_studies" USING btree ("category_id");
  CREATE INDEX "case_studies_cover_idx" ON "case_studies" USING btree ("cover_id");
  CREATE INDEX "case_studies_sort_order_idx" ON "case_studies" USING btree ("sort_order");
  CREATE INDEX "case_studies_visible_idx" ON "case_studies" USING btree ("visible");
  CREATE INDEX "case_studies_seo_seo_image_idx" ON "case_studies" USING btree ("seo_image_id");
  CREATE INDEX "case_studies_cover_video_idx" ON "case_studies" USING btree ("cover_video_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_locales_parent_id_idx" ON "case_studies_locales" USING btree ("_parent_id");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_locale_idx" ON "case_studies_rels" USING btree ("locale");
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id","locale");
  CREATE INDEX "case_studies_rels_case_studies_id_idx" ON "case_studies_rels" USING btree ("case_studies_id","locale");
  CREATE INDEX "_case_studies_v_blocks_rich_text_order_idx" ON "_case_studies_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_rich_text_parent_id_idx" ON "_case_studies_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_rich_text_path_idx" ON "_case_studies_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_rich_text_locale_idx" ON "_case_studies_v_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_single_image_order_idx" ON "_case_studies_v_blocks_single_image" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_single_image_parent_id_idx" ON "_case_studies_v_blocks_single_image" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_single_image_path_idx" ON "_case_studies_v_blocks_single_image" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_single_image_locale_idx" ON "_case_studies_v_blocks_single_image" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_single_image_image_idx" ON "_case_studies_v_blocks_single_image" USING btree ("image_id");
  CREATE INDEX "_case_studies_v_blocks_full_width_image_order_idx" ON "_case_studies_v_blocks_full_width_image" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_full_width_image_parent_id_idx" ON "_case_studies_v_blocks_full_width_image" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_full_width_image_path_idx" ON "_case_studies_v_blocks_full_width_image" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_full_width_image_locale_idx" ON "_case_studies_v_blocks_full_width_image" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_full_width_image_image_idx" ON "_case_studies_v_blocks_full_width_image" USING btree ("image_id");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_order_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_parent_id_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_path_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_locale_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_left_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("left_id");
  CREATE INDEX "_case_studies_v_blocks_two_column_images_right_idx" ON "_case_studies_v_blocks_two_column_images" USING btree ("right_id");
  CREATE INDEX "_case_studies_v_blocks_image_gallery_order_idx" ON "_case_studies_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_image_gallery_parent_id_idx" ON "_case_studies_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_image_gallery_path_idx" ON "_case_studies_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_image_gallery_locale_idx" ON "_case_studies_v_blocks_image_gallery" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_quote_order_idx" ON "_case_studies_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_quote_parent_id_idx" ON "_case_studies_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_quote_path_idx" ON "_case_studies_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_quote_locale_idx" ON "_case_studies_v_blocks_quote" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_video_embed_order_idx" ON "_case_studies_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_video_embed_parent_id_idx" ON "_case_studies_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_video_embed_path_idx" ON "_case_studies_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_video_embed_locale_idx" ON "_case_studies_v_blocks_video_embed" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_divider_order_idx" ON "_case_studies_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_divider_parent_id_idx" ON "_case_studies_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_divider_path_idx" ON "_case_studies_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_divider_locale_idx" ON "_case_studies_v_blocks_divider" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_blocks_spacer_order_idx" ON "_case_studies_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_case_studies_v_blocks_spacer_parent_id_idx" ON "_case_studies_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_blocks_spacer_path_idx" ON "_case_studies_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_case_studies_v_blocks_spacer_locale_idx" ON "_case_studies_v_blocks_spacer" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_category_idx" ON "_case_studies_v" USING btree ("version_category_id");
  CREATE INDEX "_case_studies_v_version_version_cover_idx" ON "_case_studies_v" USING btree ("version_cover_id");
  CREATE INDEX "_case_studies_v_version_version_sort_order_idx" ON "_case_studies_v" USING btree ("version_sort_order");
  CREATE INDEX "_case_studies_v_version_version_visible_idx" ON "_case_studies_v" USING btree ("version_visible");
  CREATE INDEX "_case_studies_v_version_seo_version_seo_image_idx" ON "_case_studies_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_case_studies_v_version_version_cover_video_idx" ON "_case_studies_v" USING btree ("version_cover_video_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_snapshot_idx" ON "_case_studies_v" USING btree ("snapshot");
  CREATE INDEX "_case_studies_v_published_locale_idx" ON "_case_studies_v" USING btree ("published_locale");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_case_studies_v_locales_locale_parent_id_unique" ON "_case_studies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_case_studies_v_locales_parent_id_idx" ON "_case_studies_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_locale_idx" ON "_case_studies_v_rels" USING btree ("locale");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_case_studies_v_rels_case_studies_id_idx" ON "_case_studies_v_rels" USING btree ("case_studies_id","locale");
  CREATE INDEX "social_links_sort_order_idx" ON "social_links" USING btree ("sort_order");
  CREATE INDEX "social_links_visible_idx" ON "social_links" USING btree ("visible");
  CREATE INDEX "social_links_updated_at_idx" ON "social_links" USING btree ("updated_at");
  CREATE INDEX "social_links_created_at_idx" ON "social_links" USING btree ("created_at");
  CREATE UNIQUE INDEX "social_links_locales_locale_parent_id_unique" ON "social_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_links_locales_parent_id_idx" ON "social_links_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_submissions_service_idx" ON "contact_submissions" USING btree ("service_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_service_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("service_categories_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_case_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("case_categories_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_social_links_id_idx" ON "payload_locked_documents_rels" USING btree ("social_links_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_seo_seo_image_idx" ON "site_settings" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "hero_visible_idx" ON "hero" USING btree ("visible");
  CREATE INDEX "hero_desktop_image_idx" ON "hero" USING btree ("desktop_image_id");
  CREATE INDEX "hero_mobile_image_idx" ON "hero" USING btree ("mobile_image_id");
  CREATE INDEX "hero_desktop_video_idx" ON "hero" USING btree ("desktop_video_id");
  CREATE INDEX "hero_mobile_video_idx" ON "hero" USING btree ("mobile_video_id");
  CREATE INDEX "hero_poster_idx" ON "hero" USING btree ("poster_id");
  CREATE INDEX "hero_fallback_idx" ON "hero" USING btree ("fallback_id");
  CREATE UNIQUE INDEX "hero_locales_locale_parent_id_unique" ON "hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_locales_parent_id_idx" ON "hero_locales" USING btree ("_parent_id");
  CREATE INDEX "about_links_order_idx" ON "about_links" USING btree ("_order");
  CREATE INDEX "about_links_parent_id_idx" ON "about_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_links_locales_locale_parent_id_unique" ON "about_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_links_locales_parent_id_idx" ON "about_links_locales" USING btree ("_parent_id");
  CREATE INDEX "about_visible_idx" ON "about" USING btree ("visible");
  CREATE INDEX "about_portrait_idx" ON "about" USING btree ("portrait_id");
  CREATE INDEX "about_video_idx" ON "about" USING btree ("video_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_locales_parent_id_idx" ON "about_locales" USING btree ("_parent_id");
  CREATE INDEX "about_rels_order_idx" ON "about_rels" USING btree ("order");
  CREATE INDEX "about_rels_parent_idx" ON "about_rels" USING btree ("parent_id");
  CREATE INDEX "about_rels_path_idx" ON "about_rels" USING btree ("path");
  CREATE INDEX "about_rels_media_id_idx" ON "about_rels" USING btree ("media_id");
  CREATE INDEX "contact_settings_visible_idx" ON "contact_settings" USING btree ("visible");
  CREATE UNIQUE INDEX "contact_settings_locales_locale_parent_id_unique" ON "contact_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_settings_locales_parent_id_idx" ON "contact_settings_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "service_categories" CASCADE;
  DROP TABLE "service_categories_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "case_categories" CASCADE;
  DROP TABLE "case_categories_locales" CASCADE;
  DROP TABLE "case_studies_blocks_rich_text" CASCADE;
  DROP TABLE "case_studies_blocks_single_image" CASCADE;
  DROP TABLE "case_studies_blocks_full_width_image" CASCADE;
  DROP TABLE "case_studies_blocks_two_column_images" CASCADE;
  DROP TABLE "case_studies_blocks_image_gallery" CASCADE;
  DROP TABLE "case_studies_blocks_quote" CASCADE;
  DROP TABLE "case_studies_blocks_video_embed" CASCADE;
  DROP TABLE "case_studies_blocks_divider" CASCADE;
  DROP TABLE "case_studies_blocks_spacer" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_blocks_rich_text" CASCADE;
  DROP TABLE "_case_studies_v_blocks_single_image" CASCADE;
  DROP TABLE "_case_studies_v_blocks_full_width_image" CASCADE;
  DROP TABLE "_case_studies_v_blocks_two_column_images" CASCADE;
  DROP TABLE "_case_studies_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_case_studies_v_blocks_quote" CASCADE;
  DROP TABLE "_case_studies_v_blocks_video_embed" CASCADE;
  DROP TABLE "_case_studies_v_blocks_divider" CASCADE;
  DROP TABLE "_case_studies_v_blocks_spacer" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_locales" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "social_links" CASCADE;
  DROP TABLE "social_links_locales" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "hero" CASCADE;
  DROP TABLE "hero_locales" CASCADE;
  DROP TABLE "about_links" CASCADE;
  DROP TABLE "about_links_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "about_rels" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TABLE "contact_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_case_studies_blocks_spacer_size";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_blocks_spacer_size";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum__case_studies_v_published_locale";
  DROP TYPE "public"."enum_social_links_platform";
  DROP TYPE "public"."enum_social_links_icon";
  DROP TYPE "public"."enum_contact_submissions_delivery";
  DROP TYPE "public"."enum_hero_media_type";
  DROP TYPE "public"."enum_hero_alignment";`)
}
