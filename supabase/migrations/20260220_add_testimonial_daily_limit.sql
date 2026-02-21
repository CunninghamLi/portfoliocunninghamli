-- Add function to check daily testimonial limit
CREATE OR REPLACE FUNCTION public.check_testimonial_daily_limit()
RETURNS TRIGGER AS $$
DECLARE
  today_count INTEGER;
  today_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the start of today (midnight UTC)
  today_start := DATE_TRUNC('day', NOW());
  
  -- Count testimonials from this user created today
  SELECT COUNT(*)
  INTO today_count
  FROM public.testimonials
  WHERE user_id = NEW.user_id
  AND created_at >= today_start;
  
  -- If user already has 2 testimonials today, reject the insertion
  IF today_count >= 2 THEN
    RAISE EXCEPTION 'Daily testimonial limit of 2 has been reached. Try again tomorrow.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce the limit on insert
DROP TRIGGER IF EXISTS enforce_testimonial_daily_limit ON public.testimonials;

CREATE TRIGGER enforce_testimonial_daily_limit
BEFORE INSERT ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.check_testimonial_daily_limit();
