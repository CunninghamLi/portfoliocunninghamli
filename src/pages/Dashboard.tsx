import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio, Project, Experience, Skill, Hobby, Education } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Plus, Pencil, Trash2, Upload, FileText, X, Check, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { isLoggedIn, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const {
    data,
    loading,
    portfolioId,
    updateAboutMe,
    updateContact,
    updateResumeUrl,
    updateResumeUrlFr,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    addHobby,
    updateHobby,
    deleteHobby,
    addEducation,
    updateEducation,
    deleteEducation,
  } = usePortfolio();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">{t.common.loading}</div>
      </div>
    );
  }

  // Only admin can access the dashboard
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t.dashboard.title}</h1>
        
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid grid-cols-5 md:grid-cols-9 w-full">
            <TabsTrigger value="about">{t.dashboard.about}</TabsTrigger>
            <TabsTrigger value="projects">{t.dashboard.projects}</TabsTrigger>
            <TabsTrigger value="experience">{t.dashboard.experience}</TabsTrigger>
            <TabsTrigger value="skills">{t.dashboard.skills}</TabsTrigger>
            <TabsTrigger value="hobbies">{t.dashboard.hobbies}</TabsTrigger>
            <TabsTrigger value="education">{t.dashboard.education}</TabsTrigger>
            <TabsTrigger value="testimonials">{t.dashboard.testimonials}</TabsTrigger>
            <TabsTrigger value="contact">{t.dashboard.contact}</TabsTrigger>
            <TabsTrigger value="resume">{t.dashboard.resume}</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutMeEditor data={data.aboutMe} onSave={updateAboutMe} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsEditor
              projects={data.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceEditor
              experiences={data.experiences}
              onAdd={addExperience}
              onUpdate={updateExperience}
              onDelete={deleteExperience}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsEditor
              skills={data.skills}
              onAdd={addSkill}
              onUpdate={updateSkill}
              onDelete={deleteSkill}
            />
          </TabsContent>

          <TabsContent value="hobbies">
            <HobbiesEditor
              hobbies={data.hobbies}
              onAdd={addHobby}
              onUpdate={updateHobby}
              onDelete={deleteHobby}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationEditor
              education={data.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onDelete={deleteEducation}
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsEditor />
          </TabsContent>


          <TabsContent value="contact">
            <ContactEditor data={data.contact} onSave={updateContact} />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeEditor
              resumeUrl={data.resumeUrl}
              resumeUrlFr={data.resumeUrlFr}
              portfolioId={portfolioId}
              onSaveEn={updateResumeUrl}
              onSaveFr={updateResumeUrlFr}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Resume Editor Component
const ResumeEditor = ({
  resumeUrl,
  resumeUrlFr,
  portfolioId,
  onSaveEn,
  onSaveFr,
}: {
  resumeUrl?: string;
  resumeUrlFr?: string;
  portfolioId: string | null;
  onSaveEn: (url: string | null) => Promise<void>;
  onSaveFr: (url: string | null) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [uploadingEn, setUploadingEn] = useState(false);
  const [uploadingFr, setUploadingFr] = useState(false);
  const [removingEn, setRemovingEn] = useState(false);
  const [removingFr, setRemovingFr] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, language: 'en' | 'fr') => {
    const file = e.target.files?.[0];
    if (!file || !portfolioId) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: t.dashboard.uploadError, description: t.dashboard.uploadPdfOrImage, variant: 'destructive' });
      return;
    }

    const setUploading = language === 'en' ? setUploadingEn : setUploadingFr;
    const onSave = language === 'en' ? onSaveEn : onSaveFr;
    const currentUrl = language === 'en' ? resumeUrl : resumeUrlFr;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${portfolioId}/resume_${language}.${fileExt}`;

      // Delete old file if exists
      if (currentUrl) {
        const oldPath = currentUrl.split('/resumes/')[1];
        if (oldPath) {
          await supabase.storage.from('resumes').remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      
      await onSave(urlData.publicUrl);
      toast({ title: t.dashboard.success, description: t.dashboard.resumeUploaded });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({ title: t.dashboard.error, description: t.dashboard.failedToUpload, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (language: 'en' | 'fr') => {
    const currentUrl = language === 'en' ? resumeUrl : resumeUrlFr;
    if (!currentUrl || !portfolioId) return;

    const setRemoving = language === 'en' ? setRemovingEn : setRemovingFr;
    const onSave = language === 'en' ? onSaveEn : onSaveFr;

    setRemoving(true);
    try {
      const path = currentUrl.split('/resumes/')[1];
      if (path) {
        await supabase.storage.from('resumes').remove([path]);
      }
      await onSave(null);
      toast({ title: t.dashboard.success, description: t.dashboard.resumeRemoved });
    } catch (error) {
      console.error('Error removing resume:', error);
      toast({ title: t.dashboard.error, description: t.dashboard.failedToRemove, variant: 'destructive' });
    } finally {
      setRemoving(false);
    }
  };

  const isPdfEn = resumeUrl?.toLowerCase().endsWith('.pdf');
  const isPdfFr = resumeUrlFr?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-6">
      {/* English Resume */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.editResume} (English)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.dashboard.uploadResume}</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, 'en')}
                disabled={uploadingEn}
                className="cursor-pointer"
              />
              {uploadingEn && <span className="text-muted-foreground text-sm">{t.common.saving}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.resumeHelp}</p>
          </div>

          {resumeUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t.dashboard.currentResume}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove('en')}
                  disabled={removingEn}
                >
                  <X className="w-4 h-4 mr-2" />
                  {removingEn ? t.common.saving : t.dashboard.removeResume}
                </Button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                {isPdfEn ? (
                  <div className="flex items-center gap-3 p-4 bg-secondary/50">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{t.dashboard.resumePdfLabel}</p>
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {t.dashboard.viewPdfLink}
                      </a>
                    </div>
                  </div>
                ) : (
                  <img
                    src={resumeUrl}
                    alt={t.dashboard.resumePreviewAlt}
                    className="max-w-full h-auto max-h-96 object-contain mx-auto"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* French Resume */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.editResume} (Français)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.dashboard.uploadResume}</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, 'fr')}
                disabled={uploadingFr}
                className="cursor-pointer"
              />
              {uploadingFr && <span className="text-muted-foreground text-sm">{t.common.saving}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.resumeHelp}</p>
          </div>

          {resumeUrlFr && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t.dashboard.currentResume}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove('fr')}
                  disabled={removingFr}
                >
                  <X className="w-4 h-4 mr-2" />
                  {removingFr ? t.common.saving : t.dashboard.removeResume}
                </Button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                {isPdfFr ? (
                  <div className="flex items-center gap-3 p-4 bg-secondary/50">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{t.dashboard.resumePdfLabel}</p>
                      <a
                        href={resumeUrlFr}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {t.dashboard.viewPdfLink}
                      </a>
                    </div>
                  </div>
                ) : (
                  <img
                    src={resumeUrlFr}
                    alt={t.dashboard.resumePreviewAlt}
                    className="max-w-full h-auto max-h-96 object-contain mx-auto"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// About Me Editor
const AboutMeEditor = ({
  data,
  onSave,
}: {
  data: { name: string; title: string; bio: string; image?: string };
  onSave: (data: { name: string; title: string; bio: string; image?: string }) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(data);
  const [previewImage, setPreviewImage] = useState<string | undefined>(data.image);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm({ ...form, image: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    toast({ title: t.dashboard.saved, description: t.dashboard.aboutMeUpdated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.editAboutMe}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t.dashboard.profilePictureLabel}</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={t.dashboard.profilePreviewAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-xs">{t.dashboard.noImage}</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">{t.dashboard.uploadProfilePictureHelp}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{t.dashboard.nameLabel}</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">{t.dashboard.titleLabel}</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">{t.dashboard.bioLabel}</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.saving : t.common.save}
        </Button>
      </CardContent>
    </Card>
  );
};

// Contact Editor
const ContactEditor = ({
  data,
  onSave,
}: {
  data: { email: string; location: string; linkedin?: string; github?: string };
  onSave: (data: { email: string; location: string; linkedin?: string; github?: string }) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    toast({ title: t.dashboard.saved, description: t.dashboard.contactUpdated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.editContact}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t.dashboard.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">{t.dashboard.locationLabel}</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">{t.dashboard.linkedinLabel}</Label>
            <Input
              id="linkedin"
              value={form.linkedin || ''}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">{t.dashboard.githubLabel}</Label>
            <Input
              id="github"
              value={form.github || ''}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.saving : t.common.save}
        </Button>
      </CardContent>
    </Card>
  );
};

// Projects Editor
const ProjectsEditor = ({
  projects,
  onAdd,
  onUpdate,
  onDelete,
}: {
  projects: Project[];
  onAdd: (project: Omit<Project, 'id'>) => Promise<void>;
  onUpdate: (project: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.dashboard.manageProjects}</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> {t.dashboard.addProject}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dashboard.addNewProject}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              onSave={async (project) => {
                await onAdd(project);
                setIsAddOpen(false);
                toast({ title: t.dashboard.added, description: t.dashboard.projectAdded });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{project.title}</h4>
                <p className="text-sm text-muted-foreground">{project.technologies.join(', ')}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.dashboard.editProject}</DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                      project={project}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: project.id });
                        toast({ title: t.dashboard.updated, description: t.dashboard.projectUpdated });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(project.id);
                    toast({ title: t.dashboard.deleted, description: t.dashboard.projectRemoved });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectForm = ({
  project,
  onSave,
}: {
  project?: Project;
  onSave: (project: Omit<Project, 'id'>) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies.join(', ') || '',
    link: project?.link || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      title: form.title,
      description: form.description,
      technologies: form.technologies.split(',').map((t) => t.trim()),
      link: form.link || undefined,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-title">{t.dashboard.projectTitleLabel}</Label>
        <Input
          id="project-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-desc">{t.dashboard.projectDescriptionLabel}</Label>
        <Textarea
          id="project-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-tech">{t.dashboard.projectTechnologiesLabel}</Label>
        <Input
          id="project-tech"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          placeholder={t.dashboard.projectTechnologiesPlaceholder}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-link">{t.dashboard.projectLinkLabel}</Label>
        <Input
          id="project-link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder={t.dashboard.projectLinkPlaceholder}
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? t.common.saving : t.common.saveShort}
      </Button>
    </form>
  );
};

// Experience Editor
const ExperienceEditor = ({
  experiences,
  onAdd,
  onUpdate,
  onDelete,
}: {
  experiences: Experience[];
  onAdd: (experience: Omit<Experience, 'id'>) => Promise<void>;
  onUpdate: (experience: Experience) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.dashboard.manageExperience}</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> {t.dashboard.addExperience}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dashboard.addNewExperience}</DialogTitle>
            </DialogHeader>
            <ExperienceForm
              onSave={async (exp) => {
                await onAdd(exp);
                setIsAddOpen(false);
                toast({ title: t.dashboard.added, description: t.dashboard.experienceAdded });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{exp.role}</h4>
                <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.dashboard.editExperience}</DialogTitle>
                    </DialogHeader>
                    <ExperienceForm
                      experience={exp}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: exp.id });
                        toast({ title: t.dashboard.updated, description: t.dashboard.experienceUpdated });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(exp.id);
                    toast({ title: t.dashboard.deleted, description: t.dashboard.experienceRemoved });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceForm = ({
  experience,
  onSave,
}: {
  experience?: Experience;
  onSave: (experience: Omit<Experience, 'id'>) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    company: experience?.company || '',
    role: experience?.role || '',
    duration: experience?.duration || '',
    description: experience?.description || '',
    skills: experience?.skills?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      company: form.company,
      role: form.role,
      duration: form.duration,
      description: form.description,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exp-role">{t.dashboard.experienceRoleLabel}</Label>
        <Input
          id="exp-role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-company">{t.dashboard.experienceCompanyLabel}</Label>
        <Input
          id="exp-company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-duration">{t.dashboard.experienceDurationLabel}</Label>
        <Input
          id="exp-duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder={t.dashboard.experienceDurationPlaceholder}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-desc">{t.dashboard.experienceDescriptionLabel}</Label>
        <Textarea
          id="exp-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-skills">{t.dashboard.experienceSkillsLabel}</Label>
        <Input
          id="exp-skills"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder={t.dashboard.experienceSkillsPlaceholder}
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? t.common.saving : t.common.saveShort}
      </Button>
    </form>
  );
};

// Skills Editor
const SkillsEditor = ({
  skills,
  onAdd,
  onUpdate,
  onDelete,
}: {
  skills: Skill[];
  onAdd: (skill: Omit<Skill, 'id'>) => Promise<void>;
  onUpdate: (skill: Skill) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.dashboard.manageSkills}</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> {t.dashboard.addSkill}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dashboard.addNewSkill}</DialogTitle>
            </DialogHeader>
            <SkillForm
              categories={categories}
              onSave={async (skill) => {
                await onAdd(skill);
                setIsAddOpen(false);
                toast({ title: t.dashboard.added, description: t.dashboard.skillAdded });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{skill.name}</h4>
                <p className="text-sm text-muted-foreground">{skill.category}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.dashboard.editSkill}</DialogTitle>
                    </DialogHeader>
                    <SkillForm
                      skill={skill}
                      categories={categories}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: skill.id });
                        toast({ title: t.dashboard.updated, description: t.dashboard.skillUpdated });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(skill.id);
                    toast({ title: t.dashboard.deleted, description: t.dashboard.skillRemoved });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SkillForm = ({
  skill,
  categories,
  onSave,
}: {
  skill?: Skill;
  categories: string[];
  onSave: (skill: Omit<Skill, 'id'>) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: skill?.name || '',
    category: skill?.category || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skill-name">{t.dashboard.skillNameLabel}</Label>
        <Input
          id="skill-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill-category">{t.dashboard.skillCategoryLabel}</Label>
        <Input
          id="skill-category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder={t.dashboard.skillCategoryPlaceholder}
          list="categories"
          required
        />
        <datalist id="categories">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? t.common.saving : t.common.saveShort}
      </Button>
    </form>
  );
};

// Education Editor
const EducationEditor = ({
  education,
  onAdd,
  onUpdate,
  onDelete,
}: {
  education: Education[];
  onAdd: (edu: Omit<Education, 'id'>) => Promise<void>;
  onUpdate: (edu: Education) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.dashboard.manageEducation}</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> {t.dashboard.addEducation}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dashboard.addNewEducation}</DialogTitle>
            </DialogHeader>
            <EducationForm
              onSave={async (edu) => {
                await onAdd(edu);
                setIsAddOpen(false);
                toast({ title: t.dashboard.added, description: t.dashboard.educationAdded });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution} • {edu.duration}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.dashboard.editEducation}</DialogTitle>
                    </DialogHeader>
                    <EducationForm
                      education={edu}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: edu.id });
                        toast({ title: t.dashboard.updated, description: t.dashboard.educationUpdated });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(edu.id);
                    toast({ title: t.dashboard.deleted, description: t.dashboard.educationRemoved });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EducationForm = ({
  education,
  onSave,
}: {
  education?: Education;
  onSave: (edu: Omit<Education, 'id'>) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    institution: education?.institution || '',
    degree: education?.degree || '',
    duration: education?.duration || '',
    description: education?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edu-degree">{t.dashboard.educationDegreeLabel}</Label>
        <Input
          id="edu-degree"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-institution">{t.dashboard.educationInstitutionLabel}</Label>
        <Input
          id="edu-institution"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-duration">{t.dashboard.educationDurationLabel}</Label>
        <Input
          id="edu-duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder={t.dashboard.educationDurationPlaceholder}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-desc">{t.dashboard.educationDescriptionLabel}</Label>
        <Textarea
          id="edu-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? t.common.saving : t.common.saveShort}
      </Button>
    </form>
  );
};

// Hobbies Editor
const HobbiesEditor = ({
  hobbies,
  onAdd,
  onUpdate,
  onDelete,
}: {
  hobbies: Hobby[];
  onAdd: (hobby: Omit<Hobby, 'id'>) => Promise<void>;
  onUpdate: (hobby: Hobby) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [...new Set(hobbies.map((h) => h.category))];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.dashboard.manageHobbies}</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> {t.dashboard.addHobby}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dashboard.addNewHobby}</DialogTitle>
            </DialogHeader>
            <HobbyForm
              categories={categories}
              onSave={async (hobby) => {
                await onAdd(hobby);
                setIsAddOpen(false);
                toast({ title: t.dashboard.added, description: t.dashboard.hobbyAdded });
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{hobby.name}</h4>
                <p className="text-sm text-muted-foreground">{hobby.category}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.dashboard.editHobby}</DialogTitle>
                    </DialogHeader>
                    <HobbyForm
                      hobby={hobby}
                      categories={categories}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: hobby.id });
                        toast({ title: t.dashboard.updated, description: t.dashboard.hobbyUpdated });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(hobby.id);
                    toast({ title: t.dashboard.deleted, description: t.dashboard.hobbyRemoved });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const HobbyForm = ({
  hobby,
  categories,
  onSave,
}: {
  hobby?: Hobby;
  categories: string[];
  onSave: (hobby: Omit<Hobby, 'id'>) => Promise<void>;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: hobby?.name || '',
    category: hobby?.category || '',
    icon: hobby?.icon || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: form.name,
      category: form.category,
      icon: form.icon || undefined,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hobby-name">{t.dashboard.hobbyNameLabel}</Label>
        <Input
          id="hobby-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hobby-category">{t.dashboard.hobbyCategoryLabel}</Label>
        <Input
          id="hobby-category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder={t.dashboard.hobbyCategoryPlaceholder}
          list="hobby-categories"
          required
        />
        <datalist id="hobby-categories">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="hobby-icon">{t.dashboard.hobbyIconLabel}</Label>
        <Input
          id="hobby-icon"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder={t.dashboard.hobbyIconPlaceholder}
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? t.common.saving : t.common.saveShort}
      </Button>
    </form>
  );
};

// Testimonials Editor Component
interface Testimonial {
  id: string;
  content: string;
  status: string;
  user_id: string;
  created_at: string;
  name: string;
}

const TestimonialsEditor = () => {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: translatedTestimonials } = useTranslatedArray(testimonials, ['content']);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Fetch all testimonials (admin can see all)
      const { data: testimonialsData, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(testimonialsData || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      toast({ title: t.dashboard.error, description: t.dashboard.failedToLoadTestimonials, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => 
        prev.map(t => t.id === id ? { ...t, status } : t)
      );
      toast({ 
        title: status === 'approved' ? t.testimonials.approved : t.testimonials.rejected,
        description: status === 'approved' ? t.dashboard.testimonialApprovedDesc : t.dashboard.testimonialRejectedDesc,
      });
    } catch (err) {
      console.error('Error updating testimonial:', err);
      toast({ title: t.dashboard.error, description: t.dashboard.failedToUpdateTestimonial, variant: 'destructive' });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: t.dashboard.deleted, description: t.dashboard.testimonialDeletedDesc });
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast({ title: t.dashboard.error, description: t.dashboard.failedToDeleteTestimonial, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600">{t.testimonials.approved}</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-600">{t.testimonials.rejected}</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-600">{t.testimonials.pending}</span>;
    }
  };

  const pendingCount = testimonials.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">{t.dashboard.loadingTestimonials}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t.dashboard.manageTestimonials}
          {pendingCount > 0 && (
            <span className="text-sm font-normal bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full">
              {pendingCount} {t.dashboard.pendingLabel}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{t.testimonials.noTestimonials}</p>
        ) : (
          <div className="space-y-4">
            {translatedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 border border-border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(testimonial.status)}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                <div className="flex gap-2">
                  {testimonial.status !== 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => updateStatus(testimonial.id, 'approved')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {t.testimonials.approve}
                    </Button>
                  )}
                  {testimonial.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 hover:text-orange-700"
                      onClick={() => updateStatus(testimonial.id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      {t.testimonials.reject}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t.common.delete}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
