import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio, Project, Experience, Skill, Education } from '@/contexts/PortfolioContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const {
    data,
    loading,
    updateAboutMe,
    updateContact,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    addEducation,
    updateEducation,
    deleteEducation,
  } = usePortfolio();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading portfolio data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
        
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
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

          <TabsContent value="education">
            <EducationEditor
              education={data.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onDelete={deleteEducation}
            />
          </TabsContent>

          <TabsContent value="contact">
            <ContactEditor data={data.contact} onSave={updateContact} />
          </TabsContent>
        </Tabs>
      </div>
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
    toast({ title: 'Saved!', description: 'About Me section updated.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit About Me</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-xs">No image</span>
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
              <p className="text-xs text-muted-foreground">Upload a profile picture (JPG, PNG)</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
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
  data: { email: string; phone: string; location: string; linkedin?: string; github?: string };
  onSave: (data: { email: string; phone: string; location: string; linkedin?: string; github?: string }) => Promise<void>;
}) => {
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    toast({ title: 'Saved!', description: 'Contact information updated.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={form.linkedin || ''}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={form.github || ''}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Projects</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm
              onSave={async (project) => {
                await onAdd(project);
                setIsAddOpen(false);
                toast({ title: 'Added!', description: 'New project added.' });
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
                      <DialogTitle>Edit Project</DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                      project={project}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: project.id });
                        toast({ title: 'Updated!', description: 'Project updated.' });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(project.id);
                    toast({ title: 'Deleted!', description: 'Project removed.' });
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
        <Label htmlFor="project-title">Title</Label>
        <Input
          id="project-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-desc">Description</Label>
        <Textarea
          id="project-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-tech">Technologies (comma-separated)</Label>
        <Input
          id="project-tech"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          placeholder="React, Node.js, PostgreSQL"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-link">Link (optional)</Label>
        <Input
          id="project-link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://github.com/..."
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Experience</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
            </DialogHeader>
            <ExperienceForm
              onSave={async (exp) => {
                await onAdd(exp);
                setIsAddOpen(false);
                toast({ title: 'Added!', description: 'New experience added.' });
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
                      <DialogTitle>Edit Experience</DialogTitle>
                    </DialogHeader>
                    <ExperienceForm
                      experience={exp}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: exp.id });
                        toast({ title: 'Updated!', description: 'Experience updated.' });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(exp.id);
                    toast({ title: 'Deleted!', description: 'Experience removed.' });
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
        <Label htmlFor="exp-role">Role</Label>
        <Input
          id="exp-role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-company">Company</Label>
        <Input
          id="exp-company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-duration">Duration</Label>
        <Input
          id="exp-duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder="June 2023 - Present"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-desc">Description</Label>
        <Textarea
          id="exp-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exp-skills">Skills (comma-separated)</Label>
        <Input
          id="exp-skills"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder="React, Node.js, Python"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Skills</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <SkillForm
              categories={categories}
              onSave={async (skill) => {
                await onAdd(skill);
                setIsAddOpen(false);
                toast({ title: 'Added!', description: 'New skill added.' });
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
                      <DialogTitle>Edit Skill</DialogTitle>
                    </DialogHeader>
                    <SkillForm
                      skill={skill}
                      categories={categories}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: skill.id });
                        toast({ title: 'Updated!', description: 'Skill updated.' });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(skill.id);
                    toast({ title: 'Deleted!', description: 'Skill removed.' });
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
        <Label htmlFor="skill-name">Skill Name</Label>
        <Input
          id="skill-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skill-category">Category</Label>
        <Input
          id="skill-category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="e.g., Programming Languages, Frameworks"
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
        {saving ? 'Saving...' : 'Save'}
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Education</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Education</DialogTitle>
            </DialogHeader>
            <EducationForm
              onSave={async (edu) => {
                await onAdd(edu);
                setIsAddOpen(false);
                toast({ title: 'Added!', description: 'New education added.' });
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
                      <DialogTitle>Edit Education</DialogTitle>
                    </DialogHeader>
                    <EducationForm
                      education={edu}
                      onSave={async (updated) => {
                        await onUpdate({ ...updated, id: edu.id });
                        toast({ title: 'Updated!', description: 'Education updated.' });
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await onDelete(edu.id);
                    toast({ title: 'Deleted!', description: 'Education removed.' });
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
        <Label htmlFor="edu-degree">Degree</Label>
        <Input
          id="edu-degree"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-institution">Institution</Label>
        <Input
          id="edu-institution"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-duration">Duration</Label>
        <Input
          id="edu-duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder="2021 - 2025"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edu-desc">Description</Label>
        <Textarea
          id="edu-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default Dashboard;
