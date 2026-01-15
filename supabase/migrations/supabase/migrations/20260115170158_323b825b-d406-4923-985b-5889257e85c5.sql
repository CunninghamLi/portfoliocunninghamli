-- Fix RLS policies: Only admin can modify portfolio data, public can only read

-- Drop existing overly permissive policies for portfolio table
DROP POLICY IF EXISTS "Anyone can delete portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Anyone can update portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Anyone can insert portfolio" ON public.portfolio;

-- Create admin-only policies for portfolio
CREATE POLICY "Admins can insert portfolio" 
ON public.portfolio 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio" 
ON public.portfolio 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio" 
ON public.portfolio 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies for projects table
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;

-- Create admin-only policies for projects
CREATE POLICY "Admins can insert projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" 
ON public.projects 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies for experiences table
DROP POLICY IF EXISTS "Anyone can delete experiences" ON public.experiences;
DROP POLICY IF EXISTS "Anyone can update experiences" ON public.experiences;
DROP POLICY IF EXISTS "Anyone can insert experiences" ON public.experiences;

-- Create admin-only policies for experiences
CREATE POLICY "Admins can insert experiences" 
ON public.experiences 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update experiences" 
ON public.experiences 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete experiences" 
ON public.experiences 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies for skills table
DROP POLICY IF EXISTS "Anyone can delete skills" ON public.skills;
DROP POLICY IF EXISTS "Anyone can update skills" ON public.skills;
DROP POLICY IF EXISTS "Anyone can insert skills" ON public.skills;

-- Create admin-only policies for skills
CREATE POLICY "Admins can insert skills" 
ON public.skills 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skills" 
ON public.skills 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skills" 
ON public.skills 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies for education table
DROP POLICY IF EXISTS "Anyone can delete education" ON public.education;
DROP POLICY IF EXISTS "Anyone can update education" ON public.education;
DROP POLICY IF EXISTS "Anyone can insert education" ON public.education;

-- Create admin-only policies for education
CREATE POLICY "Admins can insert education" 
ON public.education 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update education" 
ON public.education 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete education" 
ON public.education 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies for hobbies table
DROP POLICY IF EXISTS "Anyone can delete hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Anyone can update hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Anyone can insert hobbies" ON public.hobbies;

-- Create admin-only policies for hobbies
CREATE POLICY "Admins can insert hobbies" 
ON public.hobbies 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hobbies" 
ON public.hobbies 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hobbies" 
ON public.hobbies 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));
