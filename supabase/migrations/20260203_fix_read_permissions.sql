-- Add SELECT policies to allow reading portfolio data
-- Public can read portfolio data, only admins can modify

-- Portfolio table - public read, admin modify
CREATE POLICY "Anyone can read portfolio" 
ON public.portfolio 
FOR SELECT 
USING (true);

-- Projects table - public read, admin modify
CREATE POLICY "Anyone can read projects" 
ON public.projects 
FOR SELECT 
USING (true);

-- Experiences table - public read, admin modify
CREATE POLICY "Anyone can read experiences" 
ON public.experiences 
FOR SELECT 
USING (true);

-- Skills table - public read, admin modify
CREATE POLICY "Anyone can read skills" 
ON public.skills 
FOR SELECT 
USING (true);

-- Education table - public read, admin modify
CREATE POLICY "Anyone can read education" 
ON public.education 
FOR SELECT 
USING (true);

-- Hobbies table - public read, admin modify
CREATE POLICY "Anyone can read hobbies" 
ON public.hobbies 
FOR SELECT 
USING (true);
