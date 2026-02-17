-- Add name column to testimonials table
ALTER TABLE public.testimonials ADD COLUMN name TEXT NOT NULL DEFAULT 'Anonymous';

-- Make future name submissions required (not null)
ALTER TABLE public.testimonials ALTER COLUMN name DROP DEFAULT;
