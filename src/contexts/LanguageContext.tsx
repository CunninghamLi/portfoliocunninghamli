import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  nav: {
    about: string;
    projects: string;
    experience: string;
    skills: string;
    education: string;
    contact: string;
    resume: string;
    dashboard: string;
    login: string;
    logout: string;
  };
  hero: {
    greeting: string;
    viewWork: string;
    contactMe: string;
  };
  sections: {
    aboutMe: string;
    projects: string;
    experience: string;
    skills: string;
    education: string;
    contact: string;
    resume: string;
  };
  contact: {
    getInTouch: string;
    sendMessage: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    phone: string;
    location: string;
  };
  resume: {
    title: string;
    noResume: string;
    downloadPdf: string;
  };
  common: {
    loading: string;
    save: string;
    saving: string;
    add: string;
    edit: string;
    delete: string;
    cancel: string;
    viewProject: string;
    viewGithub: string;
    present: string;
  };
  dashboard: {
    title: string;
    about: string;
    projects: string;
    experience: string;
    skills: string;
    education: string;
    contact: string;
    resume: string;
    editAboutMe: string;
    editContact: string;
    manageProjects: string;
    manageExperience: string;
    manageSkills: string;
    manageEducation: string;
    editResume: string;
    addProject: string;
    addExperience: string;
    addSkill: string;
    addEducation: string;
    uploadResume: string;
    removeResume: string;
    resumeHelp: string;
    currentResume: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
    },
    hero: {
      greeting: "Hi, I'm",
      viewWork: 'View My Work',
      contactMe: 'Contact Me',
    },
    sections: {
      aboutMe: 'About Me',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
    },
    contact: {
      getInTouch: 'Get In Touch',
      sendMessage: 'Send me a message',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      phone: 'Phone',
      location: 'Location',
    },
    resume: {
      title: 'My Resume',
      noResume: 'No resume uploaded yet. Check back later!',
      downloadPdf: 'Download PDF',
    },
    common: {
      loading: 'Loading...',
      save: 'Save Changes',
      saving: 'Saving...',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      viewProject: 'View Project',
      viewGithub: 'View GitHub',
      present: 'Present',
    },
    dashboard: {
      title: 'Dashboard',
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
      editAboutMe: 'Edit About Me',
      editContact: 'Edit Contact Information',
      manageProjects: 'Manage Projects',
      manageExperience: 'Manage Experience',
      manageSkills: 'Manage Skills',
      manageEducation: 'Manage Education',
      editResume: 'Edit Resume',
      addProject: 'Add Project',
      addExperience: 'Add Experience',
      addSkill: 'Add Skill',
      addEducation: 'Add Education',
      uploadResume: 'Upload Resume (PDF or Image)',
      removeResume: 'Remove Resume',
      resumeHelp: 'Upload a PDF or image of your resume',
      currentResume: 'Current Resume',
    },
  },
  fr: {
    nav: {
      about: 'À propos',
      projects: 'Projets',
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Formation',
      contact: 'Contact',
      resume: 'CV',
      dashboard: 'Tableau de bord',
      login: 'Connexion',
      logout: 'Déconnexion',
    },
    hero: {
      greeting: 'Bonjour, je suis',
      viewWork: 'Voir mes travaux',
      contactMe: 'Me contacter',
    },
    sections: {
      aboutMe: 'À propos de moi',
      projects: 'Projets',
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Formation',
      contact: 'Contact',
      resume: 'CV',
    },
    contact: {
      getInTouch: 'Me contacter',
      sendMessage: 'Envoyez-moi un message',
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      phone: 'Téléphone',
      location: 'Localisation',
    },
    resume: {
      title: 'Mon CV',
      noResume: 'Aucun CV téléchargé pour le moment. Revenez plus tard!',
      downloadPdf: 'Télécharger le PDF',
    },
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      cancel: 'Annuler',
      viewProject: 'Voir le projet',
      viewGithub: 'Voir GitHub',
      present: 'Présent',
    },
    dashboard: {
      title: 'Tableau de bord',
      about: 'À propos',
      projects: 'Projets',
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Formation',
      contact: 'Contact',
      resume: 'CV',
      editAboutMe: 'Modifier À propos de moi',
      editContact: 'Modifier les informations de contact',
      manageProjects: 'Gérer les projets',
      manageExperience: 'Gérer l\'expérience',
      manageSkills: 'Gérer les compétences',
      manageEducation: 'Gérer la formation',
      editResume: 'Modifier le CV',
      addProject: 'Ajouter un projet',
      addExperience: 'Ajouter une expérience',
      addSkill: 'Ajouter une compétence',
      addEducation: 'Ajouter une formation',
      uploadResume: 'Télécharger le CV (PDF ou Image)',
      removeResume: 'Supprimer le CV',
      resumeHelp: 'Téléchargez un PDF ou une image de votre CV',
      currentResume: 'CV actuel',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-language');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};