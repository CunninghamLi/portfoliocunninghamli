-- Add resume_url column to portfolio table
ALTER TABLE public.portfolio ADD COLUMN resume_url TEXT;

-- Create storage bucket for resumes (PDFs and images)
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Storage policies for resumes bucket
CREATE POLICY "Resume files are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can upload resume files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can update resume files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can delete resume files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resumes');