import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  title_fr?: string;
  description: string;
  description_fr?: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Experience {
  id: string;
  company: string;
  company_fr?: string;
  role: string;
  role_fr?: string;
  duration: string;
  duration_fr?: string;
  description: string;
  description_fr?: string;
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  name_fr?: string;
  category: string;
  category_fr?: string;
}

export interface Hobby {
  id: string;
  name: string;
  name_fr?: string;
  category: string;
  category_fr?: string;
  icon?: string;
}

export interface Education {
  id: string;
  institution: string;
  institution_fr?: string;
  degree: string;
  degree_fr?: string;
  duration: string;
  description: string;
  description_fr?: string;
}

export interface PortfolioData {
  aboutMe: {
    name: string;
    name_fr?: string;
    title: string;
    title_fr?: string;
    bio: string;
    bio_fr?: string;
    image?: string;
  };
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  hobbies: Hobby[];
  education: Education[];
  contact: {
    email: string;
    phone: string;
    location: string;
    location_fr?: string;
    linkedin?: string;
    github?: string;
  };
  resumeUrl?: string;
  resumeUrlFr?: string;
}

const defaultData: PortfolioData = {
  aboutMe: {
    name: 'Cunningham Li',
    title: 'Computer Science Student',
    bio: 'Full-stack Computer Science student at Champlain College St-Lambert with experience in backend development, frontend technologies, and API integration. I work with Java, Spring Boot, JavaScript, TypeScript, React, Next.js, SQL, and Docker, and I enjoy building reliable applications that are clear to maintain and extend. I’ve worked across different parts of the development process, from designing REST APIs to implementing user interfaces and managing data. I’m continuing to grow my skills through practical projects and team-based coursework.',
  },
  projects: [],
  experiences: [],
  skills: [],
  hobbies: [],
  education: [],
  contact: {
    email: 'snipercunni4399@gmail.com',
    phone: '4389989602',
    location: 'Brossard, QC',
    linkedin: 'https://www.linkedin.com/in/cunningham-li-7b3672382/',
    github: 'https://github.com/CunninghamLi',
  },
  resumeUrl: undefined,
  resumeUrlFr: undefined,
};

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  portfolioId: string | null;
  updateAboutMe: (aboutMe: PortfolioData['aboutMe']) => Promise<void>;
  updateContact: (contact: PortfolioData['contact']) => Promise<void>;
  updateResumeUrl: (resumeUrl: string | null) => Promise<void>;
  updateResumeUrlFr: (resumeUrlFr: string | null) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addExperience: (experience: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (experience: Experience) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (skill: Skill) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addHobby: (hobby: Omit<Hobby, 'id'>) => Promise<void>;
  updateHobby: (hobby: Hobby) => Promise<void>;
  deleteHobby: (id: string) => Promise<void>;
  addEducation: (education: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (education: Education) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get or create portfolio
        let { data: portfolio, error } = await supabase
          .from('portfolio')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        // If no portfolio exists, create one with defaults
        if (!portfolio) {
          const { data: newPortfolio, error: insertError } = await supabase
            .from('portfolio')
            .insert({
              name: defaultData.aboutMe.name,
              title: defaultData.aboutMe.title,
              bio: defaultData.aboutMe.bio,
              email: defaultData.contact.email,
              phone: defaultData.contact.phone,
              location: defaultData.contact.location,
              linkedin: defaultData.contact.linkedin,
              github: defaultData.contact.github,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          portfolio = newPortfolio;
        }

        setPortfolioId(portfolio.id);

        // Load all related data
        const [projectsRes, experiencesRes, skillsRes, hobbiesRes, educationRes] = await Promise.all([
          supabase.from('projects').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('experiences').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('skills').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('hobbies').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('education').select('*').eq('portfolio_id', portfolio.id),
        ]);

        setData({
          aboutMe: {
            name: portfolio.name,
            name_fr: portfolio.name_fr || undefined,
            title: portfolio.title,
            title_fr: portfolio.title_fr || undefined,
            bio: portfolio.bio,
            bio_fr: portfolio.bio_fr || undefined,
            image: portfolio.image || undefined,
          },
          projects: (projectsRes.data || []).map((p) => ({
            id: p.id,
            title: p.title,
            title_fr: p.title_fr || undefined,
            description: p.description,
            description_fr: p.description_fr || undefined,
            technologies: p.tags || [],
            link: p.link || undefined,
            github: p.github || undefined,
            image: p.image || undefined,
          })),
          experiences: (experiencesRes.data || []).map((e) => ({
            id: e.id,
            company: e.company,
            company_fr: e.company_fr || undefined,
            role: e.title,
            role_fr: e.title_fr || undefined,
            duration: e.period,
            duration_fr: e.period_fr || undefined,
            description: e.description,
            description_fr: e.description_fr || undefined,
            skills: e.skills || [],
          })),
          skills: (skillsRes.data || []).map((s) => ({
            id: s.id,
            name: s.name,
            name_fr: s.name_fr || undefined,
            category: s.category,
            category_fr: s.category_fr || undefined,
          })),
          hobbies: (hobbiesRes.data || []).map((h) => ({
            id: h.id,
            name: h.name,
            name_fr: h.name_fr || undefined,
            category: h.category,
            category_fr: h.category_fr || undefined,
            icon: h.icon || undefined,
          })),
          education: (educationRes.data || []).map((e) => ({
            id: e.id,
            institution: e.school,
            institution_fr: e.school_fr || undefined,
            degree: e.degree,
            degree_fr: e.degree_fr || undefined,
            duration: e.period,
            description: e.description || '',
            description_fr: e.description_fr || undefined,
          })),
          contact: {
            email: portfolio.email,
            phone: portfolio.phone || '',
            location: portfolio.location || '',
            location_fr: portfolio.location_fr || undefined,
            linkedin: portfolio.linkedin || undefined,
            github: portfolio.github || undefined,
          },
          resumeUrl: portfolio.resume_url || undefined,
          resumeUrlFr: portfolio.resume_url_fr || undefined,
        });
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateAboutMe = async (aboutMe: PortfolioData['aboutMe']) => {
    if (!portfolioId) return;
    
    const { error } = await supabase
      .from('portfolio')
      .update({
        name: aboutMe.name,
        name_fr: aboutMe.name_fr || null,
        title: aboutMe.title,
        title_fr: aboutMe.title_fr || null,
        bio: aboutMe.bio,
        bio_fr: aboutMe.bio_fr || null,
        image: aboutMe.image || null,
      })
      .eq('id', portfolioId);

    if (error) {
      console.error('Error updating about me:', error);
      return;
    }

    setData((prev) => ({ ...prev, aboutMe }));
  };

  const updateContact = async (contact: PortfolioData['contact']) => {
    if (!portfolioId) return;

    const { error } = await supabase
      .from('portfolio')
      .update({
        email: contact.email,
        phone: contact.phone || null,
        location: contact.location || null,
        location_fr: contact.location_fr || null,
        linkedin: contact.linkedin || null,
        github: contact.github || null,
      })
      .eq('id', portfolioId);

    if (error) {
      console.error('Error updating contact:', error);
      return;
    }

    setData((prev) => ({ ...prev, contact }));
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!portfolioId) return;

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        portfolio_id: portfolioId,
        title: project.title,
        title_fr: project.title_fr || null,
        description: project.description,
        description_fr: project.description_fr || null,
        tags: project.technologies,
        link: project.link || null,
        github: project.github || null,
        image: project.image || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding project:', error);
      return;
    }

    const mappedProject: Project = {
      id: newProject.id,
      title: newProject.title,
      title_fr: newProject.title_fr || undefined,
      description: newProject.description,
      description_fr: newProject.description_fr || undefined,
      technologies: newProject.tags || [],
      link: newProject.link || undefined,
      github: newProject.github || undefined,
      image: newProject.image || undefined,
    };

    setData((prev) => ({ ...prev, projects: [...prev.projects, mappedProject] }));
  };

  const updateProject = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        title_fr: project.title_fr || null,
        description: project.description,
        description_fr: project.description_fr || null,
        tags: project.technologies,
        link: project.link || null,
        github: project.github || null,
        image: project.image || null,
      })
      .eq('id', project.id);

    if (error) {
      console.error('Error updating project:', error);
      return;
    }

    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return;
    }

    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    if (!portfolioId) return;

    const { data: newExperience, error } = await supabase
      .from('experiences')
      .insert({
        portfolio_id: portfolioId,
        title: experience.role,
        title_fr: experience.role_fr || null,
        company: experience.company,
        company_fr: experience.company_fr || null,
        period: experience.duration,
        period_fr: experience.duration_fr || null,
        description: experience.description,
        description_fr: experience.description_fr || null,
        skills: experience.skills,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding experience:', error);
      return;
    }

    const mappedExperience: Experience = {
      id: newExperience.id,
      company: newExperience.company,
      company_fr: newExperience.company_fr || undefined,
      role: newExperience.title,
      role_fr: newExperience.title_fr || undefined,
      duration: newExperience.period,
      duration_fr: newExperience.period_fr || undefined,
      description: newExperience.description,
      description_fr: newExperience.description_fr || undefined,
      skills: newExperience.skills || [],
    };

    setData((prev) => ({ ...prev, experiences: [...prev.experiences, mappedExperience] }));
  };

  const updateExperience = async (experience: Experience) => {
    const { error } = await supabase
      .from('experiences')
      .update({
        title: experience.role,
        title_fr: experience.role_fr || null,
        company: experience.company,
        company_fr: experience.company_fr || null,
        period: experience.duration,
        period_fr: experience.duration_fr || null,
        description: experience.description,
        description_fr: experience.description_fr || null,
        skills: experience.skills,
      })
      .eq('id', experience.id);

    if (error) {
      console.error('Error updating experience:', error);
      return;
    }

    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === experience.id ? experience : e)),
    }));
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);

    if (error) {
      console.error('Error deleting experience:', error);
      return;
    }

    setData((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    if (!portfolioId) return;

    const { data: newSkill, error } = await supabase
      .from('skills')
      .insert({
        portfolio_id: portfolioId,
        name: skill.name,
        name_fr: skill.name_fr || null,
        category: skill.category,
        category_fr: skill.category_fr || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding skill:', error);
      return;
    }

    const mappedSkill: Skill = {
      id: newSkill.id,
      name: newSkill.name,
      name_fr: newSkill.name_fr || undefined,
      category: newSkill.category,
      category_fr: newSkill.category_fr || undefined,
    };

    setData((prev) => ({ ...prev, skills: [...prev.skills, mappedSkill] }));
  };

  const updateSkill = async (skill: Skill) => {
    const { error } = await supabase
      .from('skills')
      .update({
        name: skill.name,
        name_fr: skill.name_fr || null,
        category: skill.category,
        category_fr: skill.category_fr || null,
      })
      .eq('id', skill.id);

    if (error) {
      console.error('Error updating skill:', error);
      return;
    }

    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === skill.id ? skill : s)),
    }));
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
      console.error('Error deleting skill:', error);
      return;
    }

    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  const addHobby = async (hobby: Omit<Hobby, 'id'>) => {
    if (!portfolioId) return;

    const { data: newHobby, error } = await supabase
      .from('hobbies')
      .insert({
        portfolio_id: portfolioId,
        name: hobby.name,
        name_fr: hobby.name_fr || null,
        category: hobby.category,
        category_fr: hobby.category_fr || null,
        icon: hobby.icon || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding hobby:', error);
      return;
    }

    const mappedHobby: Hobby = {
      id: newHobby.id,
      name: newHobby.name,
      name_fr: newHobby.name_fr || undefined,
      category: newHobby.category,
      category_fr: newHobby.category_fr || undefined,
      icon: newHobby.icon || undefined,
    };

    setData((prev) => ({ ...prev, hobbies: [...prev.hobbies, mappedHobby] }));
  };

  const updateHobby = async (hobby: Hobby) => {
    const { error } = await supabase
      .from('hobbies')
      .update({
        name: hobby.name,
        name_fr: hobby.name_fr || null,
        category: hobby.category,
        category_fr: hobby.category_fr || null,
        icon: hobby.icon || null,
      })
      .eq('id', hobby.id);

    if (error) {
      console.error('Error updating hobby:', error);
      return;
    }

    setData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.map((h) => (h.id === hobby.id ? hobby : h)),
    }));
  };

  const deleteHobby = async (id: string) => {
    const { error } = await supabase.from('hobbies').delete().eq('id', id);

    if (error) {
      console.error('Error deleting hobby:', error);
      return;
    }

    setData((prev) => ({ ...prev, hobbies: prev.hobbies.filter((h) => h.id !== id) }));
  };

  const addEducation = async (education: Omit<Education, 'id'>) => {
    if (!portfolioId) return;

    const { data: newEducation, error } = await supabase
      .from('education')
      .insert({
        portfolio_id: portfolioId,
        degree: education.degree,
        degree_fr: education.degree_fr || null,
        school: education.institution,
        school_fr: education.institution_fr || null,
        period: education.duration,
        description: education.description || null,
        description_fr: education.description_fr || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding education:', error);
      return;
    }

    const mappedEducation: Education = {
      id: newEducation.id,
      institution: newEducation.school,
      institution_fr: newEducation.school_fr || undefined,
      degree: newEducation.degree,
      degree_fr: newEducation.degree_fr || undefined,
      duration: newEducation.period,
      description: newEducation.description || '',
      description_fr: newEducation.description_fr || undefined,
    };

    setData((prev) => ({ ...prev, education: [...prev.education, mappedEducation] }));
  };

  const updateEducation = async (education: Education) => {
    const { error } = await supabase
      .from('education')
      .update({
        degree: education.degree,
        degree_fr: education.degree_fr || null,
        school: education.institution,
        school_fr: education.institution_fr || null,
        period: education.duration,
        description: education.description || null,
        description_fr: education.description_fr || null,
      })
      .eq('id', education.id);

    if (error) {
      console.error('Error updating education:', error);
      return;
    }

    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === education.id ? education : e)),
    }));
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase.from('education').delete().eq('id', id);

    if (error) {
      console.error('Error deleting education:', error);
      return;
    }

    setData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  const updateResumeUrl = async (resumeUrl: string | null) => {
    if (!portfolioId) return;

    const { error } = await supabase
      .from('portfolio')
      .update({ resume_url: resumeUrl })
      .eq('id', portfolioId);

    if (error) {
      console.error('Error updating resume URL:', error);
      return;
    }

    setData((prev) => ({ ...prev, resumeUrl: resumeUrl || undefined }));
  };

  const updateResumeUrlFr = async (resumeUrlFr: string | null) => {
    if (!portfolioId) return;

    const { error } = await supabase
      .from('portfolio')
      .update({ resume_url_fr: resumeUrlFr })
      .eq('id', portfolioId);

    if (error) {
      console.error('Error updating French resume URL:', error);
      return;
    }

    setData((prev) => ({ ...prev, resumeUrlFr: resumeUrlFr || undefined }));
  };

  return (
    <PortfolioContext.Provider
      value={{
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
