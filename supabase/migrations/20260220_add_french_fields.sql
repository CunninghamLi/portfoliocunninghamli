-- Add French language support for all portfolio content
-- This allows separate English and French content instead of automatic translation

-- Portfolio table (About Me section)
ALTER TABLE public.portfolio 
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS bio_fr TEXT;

-- Projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT;

-- Experiences table
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS company_fr TEXT,
  ADD COLUMN IF NOT EXISTS period_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT;

-- Skills table
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS category_fr TEXT;

-- Education table
ALTER TABLE public.education
  ADD COLUMN IF NOT EXISTS degree_fr TEXT,
  ADD COLUMN IF NOT EXISTS school_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT;

-- Hobbies table (if exists, check first)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hobbies') THEN
    ALTER TABLE public.hobbies
      ADD COLUMN IF NOT EXISTS name_fr TEXT,
      ADD COLUMN IF NOT EXISTS category_fr TEXT;
  END IF;
END $$;

-- Contact info (portfolio table already has these fields, but adding location_fr)
ALTER TABLE public.portfolio
  ADD COLUMN IF NOT EXISTS location_fr TEXT;
