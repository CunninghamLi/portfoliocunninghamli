-- Create portfolio table to store all portfolio data
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  image TEXT,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolio(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  link TEXT,
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolio(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolio(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50,
  category TEXT NOT NULL DEFAULT 'Other',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolio(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read, but we'll make them publicly readable for portfolio)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (portfolio is public)
CREATE POLICY "Portfolio is publicly readable" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Experiences are publicly readable" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Skills are publicly readable" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Education is publicly readable" ON public.education FOR SELECT USING (true);

-- Create policies for insert/update/delete (anyone can modify for now - can add auth later)
CREATE POLICY "Anyone can insert portfolio" ON public.portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portfolio" ON public.portfolio FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete portfolio" ON public.portfolio FOR DELETE USING (true);

CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Anyone can insert experiences" ON public.experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update experiences" ON public.experiences FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete experiences" ON public.experiences FOR DELETE USING (true);

CREATE POLICY "Anyone can insert skills" ON public.skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update skills" ON public.skills FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete skills" ON public.skills FOR DELETE USING (true);

CREATE POLICY "Anyone can insert education" ON public.education FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update education" ON public.education FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete education" ON public.education FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for portfolio updated_at
CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();