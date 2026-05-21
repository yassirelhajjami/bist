-- ============================================================
-- BADRANE INTERNATIONAL SCHOOL — Supabase Database Setup
-- Run this entire file in the Supabase SQL Editor (once only)
-- ============================================================

-- UUID support (already enabled on Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  email        TEXT        UNIQUE NOT NULL,
  password     TEXT        NOT NULL,
  role         TEXT        NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor')),
  avatar       TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── POSTS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  slug         TEXT,
  content      TEXT,
  excerpt      TEXT,
  cover_image  TEXT,
  category     TEXT        DEFAULT 'Actualité',
  status       TEXT        NOT NULL DEFAULT 'draft',
  publish_date TIMESTAMPTZ,
  author_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── EVENTS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  description  TEXT,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  location     TEXT,
  banner_image TEXT,
  status       TEXT        NOT NULL DEFAULT 'upcoming',
  created_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STAFF ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  position      TEXT        NOT NULL,
  department    TEXT        DEFAULT 'Administration',
  bio           TEXT,
  photo         TEXT,
  email         TEXT,
  phone         TEXT,
  display_order INTEGER     NOT NULL DEFAULT 0,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GALLERY IMAGES ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      TEXT,
  original_name TEXT,
  url           TEXT        NOT NULL,
  thumbnail_url TEXT,
  caption       TEXT,
  category      TEXT        DEFAULT 'Vie scolaire',
  size          INTEGER,
  uploaded_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PAGE CONTENT ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_content (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page       TEXT        NOT NULL,
  key        TEXT        NOT NULL,
  value      TEXT,
  label      TEXT,
  type       TEXT        DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT page_content_page_key UNIQUE (page, key)
);

-- ─── SETTINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name       TEXT        DEFAULT 'Badrane International School',
  school_name_full  TEXT        DEFAULT 'Badrane International School',
  primary_color     TEXT        DEFAULT '#132d79',
  secondary_color   TEXT        DEFAULT '#C1273A',
  logo              TEXT,
  contact           JSONB       NOT NULL DEFAULT '{}',
  social_media      JSONB       NOT NULL DEFAULT '{}',
  seo               JSONB       NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DISABLE ROW LEVEL SECURITY ───────────────────────────────────────────────
-- We use our own JWT auth in the Express server with the service_role key.
ALTER TABLE users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts          DISABLE ROW LEVEL SECURITY;
ALTER TABLE events         DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff          DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content   DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings       DISABLE ROW LEVEL SECURITY;

-- ─── DEFAULT SETTINGS ROW ─────────────────────────────────────────────────────
INSERT INTO settings (school_name, school_name_full)
VALUES ('Badrane International School', 'Badrane International School')
ON CONFLICT DO NOTHING;

-- ─── DEFAULT PAGE CONTENT — HOMEPAGE ──────────────────────────────────────────
INSERT INTO page_content (page, key, value, label, type) VALUES
  ('homepage', 'hero_title',         'L''Excellence Internationale à Tanger',              'Titre Hero',            'text'),
  ('homepage', 'hero_subtitle',      'De la maternelle au lycée, une éducation complète.', 'Sous-titre Hero',       'text'),
  ('homepage', 'hero_cta_primary',   'S''inscrire maintenant',                             'Bouton CTA Principal',  'text'),
  ('homepage', 'hero_cta_secondary', 'Découvrir l''école',                                 'Bouton CTA Secondaire', 'text'),
  ('homepage', 'about_title',        'Une école qui place l''élève au centre',             'Titre À Propos',        'text'),
  ('homepage', 'about_text',         'Fondée avec la vision d''offrir une éducation internationale de qualité au Maroc.', 'Texte À Propos', 'richtext'),
  ('homepage', 'stat_levels',        '4',    'Stat: Niveaux',  'text'),
  ('homepage', 'stat_years',         '20+',  'Stat: Années',   'text'),
  ('homepage', 'stat_students',      '500+', 'Stat: Élèves',   'text')
ON CONFLICT (page, key) DO NOTHING;

-- ─── DEFAULT PAGE CONTENT — ADMISSIONS ────────────────────────────────────────
INSERT INTO page_content (page, key, value, label, type) VALUES
  ('admissions', 'title',               'Rejoignez la famille Badrane',                   'Titre Admissions', 'text'),
  ('admissions', 'subtitle',            'Les inscriptions sont ouvertes pour l''année scolaire.', 'Sous-titre', 'text'),
  ('admissions', 'process_text',        '',  'Texte processus d''inscription', 'richtext'),
  ('admissions', 'tuition_text',        '',  'Informations frais scolaires',   'richtext'),
  ('admissions', 'brochure_url',        '',  'Lien brochure PDF',              'url'),
  ('admissions', 'enrollment_form_url', '',  'Lien formulaire d''inscription', 'url')
ON CONFLICT (page, key) DO NOTHING;

-- ─── FORM SUBMISSIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS form_submissions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT        NOT NULL CHECK (type IN ('contact', 'registration')),
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  level      TEXT,
  message    TEXT,
  data       JSONB       NOT NULL DEFAULT '{}',
  is_read    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;

-- ─── DONE ─────────────────────────────────────────────────────────────────────
-- After running this SQL, run: node src/utils/seed.js
-- to create the default admin user (admin@badraneschool.ma / Admin@2024!)
