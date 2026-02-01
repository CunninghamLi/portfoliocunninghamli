-- Make email column nullable since we no longer collect it
ALTER TABLE public.contact_messages ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.contact_messages ALTER COLUMN email SET DEFAULT '';
