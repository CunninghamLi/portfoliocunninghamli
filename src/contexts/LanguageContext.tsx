import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  nav: {
    about: string;
    projects: string;
    experience: string;
    skills: string;
    hobbies: string;
    education: string;
    contact: string;
    resume: string;
    testimonials: string;
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
    hobbies: string;
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
    hobbies: string;
    education: string;
    contact: string;
    resume: string;
    testimonials: string;
    editAboutMe: string;
    editContact: string;
    manageProjects: string;
    manageExperience: string;
    manageSkills: string;
    manageHobbies: string;
    manageEducation: string;
    manageTestimonials: string;
    editResume: string;
    addProject: string;
    addExperience: string;
    addSkill: string;
    addHobby: string;
    addEducation: string;
    uploadResume: string;
    removeResume: string;
    resumeHelp: string;
    currentResume: string;
  };
  auth: {
    title: string;
    description: string;
    login: string;
    signup: string;
    email: string;
    password: string;
    username: string;
    usernameHelp: string;
    passwordHelp: string;
    usernameMinLength: string;
    passwordMinLength: string;
    loginFailed: string;
    signupFailed: string;
    welcomeBack: string;
    loginSuccess: string;
    accountCreated: string;
    signupSuccess: string;
    loggingIn: string;
    creatingAccount: string;
    createAccount: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    writeTestimonial: string;
    writeDesc: string;
    placeholder: string;
    submit: string;
    submitted: string;
    submittedDesc: string;
    loginToSubmit: string;
    yourTestimonials: string;
    publicTestimonials: string;
    noTestimonials: string;
    pending: string;
    approved: string;
    rejected: string;
    approve: string;
    reject: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      hobbies: 'Hobbies',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
      testimonials: 'Testimonials',
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
      hobbies: 'Hobbies',
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
      hobbies: 'Hobbies',
      education: 'Education',
      contact: 'Contact',
      resume: 'Resume',
      testimonials: 'Testimonials',
      editAboutMe: 'Edit About Me',
      editContact: 'Edit Contact Information',
      manageProjects: 'Manage Projects',
      manageExperience: 'Manage Experience',
      manageSkills: 'Manage Skills',
      manageHobbies: 'Manage Hobbies',
      manageEducation: 'Manage Education',
      manageTestimonials: 'Manage Testimonials',
      editResume: 'Edit Resume',
      addProject: 'Add Project',
      addExperience: 'Add Experience',
      addSkill: 'Add Skill',
      addHobby: 'Add Hobby',
      addEducation: 'Add Education',
      uploadResume: 'Upload Resume (PDF or Image)',
      removeResume: 'Remove Resume',
      resumeHelp: 'Upload a PDF or image of your resume',
      currentResume: 'Current Resume',
    },
    auth: {
      title: 'Welcome',
      description: 'Sign in to your account or create a new one',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      usernameHelp: 'This will be displayed publicly',
      passwordHelp: 'Minimum 6 characters',
      usernameMinLength: 'Username must be at least 3 characters',
      passwordMinLength: 'Password must be at least 6 characters',
      loginFailed: 'Login failed',
      signupFailed: 'Sign up failed',
      welcomeBack: 'Welcome back!',
      loginSuccess: 'You have successfully logged in.',
      accountCreated: 'Account created!',
      signupSuccess: 'Your account has been created successfully.',
      loggingIn: 'Logging in...',
      creatingAccount: 'Creating account...',
      createAccount: 'Create Account',
    },
    testimonials: {
      title: 'Testimonials',
      subtitle: 'Read what others have to say',
      writeTestimonial: 'Write a Testimonial',
      writeDesc: 'Share your experience or feedback',
      placeholder: 'Write your testimonial here...',
      submit: 'Submit',
      submitted: 'Testimonial Submitted!',
      submittedDesc: 'Your testimonial is pending review.',
      loginToSubmit: 'Please log in to submit a testimonial',
      yourTestimonials: 'Your Testimonials',
      publicTestimonials: 'Public Testimonials',
      noTestimonials: 'No testimonials yet. Be the first to share!',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      approve: 'Approve',
      reject: 'Reject',
    },
  },
  fr: {
    nav: {
      about: 'À propos',
      projects: 'Projets',
      experience: 'Expérience',
      skills: 'Compétences',
      hobbies: 'Loisirs',
      education: 'Formation',
      contact: 'Contact',
      resume: 'CV',
      testimonials: 'Témoignages',
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
      hobbies: 'Loisirs',
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
      hobbies: 'Loisirs',
      education: 'Formation',
      contact: 'Contact',
      resume: 'CV',
      testimonials: 'Témoignages',
      editAboutMe: 'Modifier À propos de moi',
      editContact: 'Modifier les informations de contact',
      manageProjects: 'Gérer les projets',
      manageExperience: 'Gérer l\'expérience',
      manageSkills: 'Gérer les compétences',
      manageHobbies: 'Gérer les loisirs',
      manageEducation: 'Gérer la formation',
      manageTestimonials: 'Gérer les témoignages',
      editResume: 'Modifier le CV',
      addProject: 'Ajouter un projet',
      addExperience: 'Ajouter une expérience',
      addSkill: 'Ajouter une compétence',
      addHobby: 'Ajouter un loisir',
      addEducation: 'Ajouter une formation',
      uploadResume: 'Télécharger le CV (PDF ou Image)',
      removeResume: 'Supprimer le CV',
      resumeHelp: 'Téléchargez un PDF ou une image de votre CV',
      currentResume: 'CV actuel',
    },
    auth: {
      title: 'Bienvenue',
      description: 'Connectez-vous à votre compte ou créez-en un nouveau',
      login: 'Connexion',
      signup: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      username: 'Nom d\'utilisateur',
      usernameHelp: 'Ceci sera affiché publiquement',
      passwordHelp: 'Minimum 6 caractères',
      usernameMinLength: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      loginFailed: 'Échec de la connexion',
      signupFailed: 'Échec de l\'inscription',
      welcomeBack: 'Bon retour!',
      loginSuccess: 'Vous vous êtes connecté avec succès.',
      accountCreated: 'Compte créé!',
      signupSuccess: 'Votre compte a été créé avec succès.',
      loggingIn: 'Connexion en cours...',
      creatingAccount: 'Création du compte...',
      createAccount: 'Créer un compte',
    },
    testimonials: {
      title: 'Témoignages',
      subtitle: 'Lisez ce que les autres ont à dire',
      writeTestimonial: 'Écrire un témoignage',
      writeDesc: 'Partagez votre expérience ou vos commentaires',
      placeholder: 'Écrivez votre témoignage ici...',
      submit: 'Soumettre',
      submitted: 'Témoignage soumis!',
      submittedDesc: 'Votre témoignage est en attente de révision.',
      loginToSubmit: 'Veuillez vous connecter pour soumettre un témoignage',
      yourTestimonials: 'Vos témoignages',
      publicTestimonials: 'Témoignages publics',
      noTestimonials: 'Pas encore de témoignages. Soyez le premier à partager!',
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      approve: 'Approuver',
      reject: 'Rejeter',
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
