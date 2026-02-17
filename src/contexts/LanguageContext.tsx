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
    online: string;
    ready: string;
    scrollToExplore: string;
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
    playerProfile: string;
    questLog: string;
    sideQuests: string;
    skillTree: string;
    achievementTimeline: string;
    trainingGrounds: string;
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
    initiateContact: string;
    sendMessageTitle: string;
    formDescription: string;
    transmissionComplete: string;
    willReply: string;
    nameLabel: string;
    subjectLabel: string;
    messageLabel: string;
    yourName: string;
    whatsThisAbout: string;
    yourMessage: string;
    transmitting: string;
    sendTransmission: string;
    messageSent: string;
    thankYou: string;
    errorSending: string;
    errorMessage: string;
  };
  resume: {
    title: string;
    noResume: string;
    downloadPdf: string;
  };
  common: {
    loading: string;
    save: string;
    saveShort: string;
    saving: string;
    add: string;
    edit: string;
    delete: string;
    cancel: string;
    viewProject: string;
    viewGithub: string;
    present: string;
    skillLevel: string;
    max: string;
    mastery: string;
    expert: string;
    quest: string;
    level: string;
    completion: string;
    achievement: string;
    projectsLabel: string;
    technologiesLabel: string;
    knowledgeGained: string;
    unlocked: string;
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
    messages: string;
    error: string;
    success: string;
    saved: string;
    added: string;
    updated: string;
    deleted: string;
    aboutMeUpdated: string;
    contactUpdated: string;
    projectAdded: string;
    projectUpdated: string;
    projectRemoved: string;
    experienceAdded: string;
    experienceUpdated: string;
    experienceRemoved: string;
    skillAdded: string;
    skillUpdated: string;
    skillRemoved: string;
    hobbyAdded: string;
    hobbyUpdated: string;
    hobbyRemoved: string;
    educationAdded: string;
    educationUpdated: string;
    educationRemoved: string;
    resumeUploaded: string;
    resumeRemoved: string;
    uploadError: string;
    uploadPdfOrImage: string;
    failedToUpload: string;
    failedToRemove: string;
    addNewProject: string;
    editProject: string;
    addNewExperience: string;
    editExperience: string;
    addNewSkill: string;
    editSkill: string;
    addNewEducation: string;
    editEducation: string;
    addNewHobby: string;
    editHobby: string;
    profilePictureLabel: string;
    profilePreviewAlt: string;
    noImage: string;
    uploadProfilePictureHelp: string;
    nameLabel: string;
    titleLabel: string;
    bioLabel: string;
    emailLabel: string;
    locationLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    projectTitleLabel: string;
    projectDescriptionLabel: string;
    projectTechnologiesLabel: string;
    projectTechnologiesPlaceholder: string;
    projectLinkLabel: string;
    projectLinkPlaceholder: string;
    experienceRoleLabel: string;
    experienceCompanyLabel: string;
    experienceDurationLabel: string;
    experienceDurationPlaceholder: string;
    experienceDescriptionLabel: string;
    experienceSkillsLabel: string;
    experienceSkillsPlaceholder: string;
    skillNameLabel: string;
    skillCategoryLabel: string;
    skillCategoryPlaceholder: string;
    educationDegreeLabel: string;
    educationInstitutionLabel: string;
    educationDurationLabel: string;
    educationDurationPlaceholder: string;
    educationDescriptionLabel: string;
    hobbyNameLabel: string;
    hobbyCategoryLabel: string;
    hobbyCategoryPlaceholder: string;
    hobbyIconLabel: string;
    hobbyIconPlaceholder: string;
    resumePdfLabel: string;
    viewPdfLink: string;
    resumePreviewAlt: string;
    loadingTestimonials: string;
    pendingLabel: string;
    failedToLoadTestimonials: string;
    testimonialApprovedDesc: string;
    testimonialRejectedDesc: string;
    failedToUpdateTestimonial: string;
    testimonialDeletedDesc: string;
    failedToDeleteTestimonial: string;
    contactMessagesTitle: string;
    unreadLabel: string;
    noContactMessages: string;
    markAsRead: string;
    markAsUnread: string;
    markedAsRead: string;
    markedAsUnread: string;
    messageMarkedRead: string;
    messageMarkedUnread: string;
    failedToLoadMessages: string;
    failedToUpdateMessage: string;
    failedToDeleteMessage: string;
    messageDeleted: string;
    deleteMessageTitle: string;
    deleteMessageConfirm: string;
    fromLabel: string;
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
    error: string;
    passwordRequirements: string;
    passwordsDoNotMatch: string;
    checkEmail: string;
    emailConfirmation: string;
    confirmEmailMessage: string;
    emailPlaceholder: string;
    invalidEmail: string;
    emailNotConfirmed: string;
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
    error: string;
    failedToSubmit: string;
  };
  footer: {
    openChannel: string;
    builtWith: string;
    builtWithPassion: string;
    pressStartToContinue: string;
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
      online: 'ONLINE',
      ready: 'READY',
      scrollToExplore: 'SCROLL TO EXPLORE',
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
      playerProfile: 'PLAYER PROFILE',
      questLog: 'QUEST LOG',
      sideQuests: 'SIDE QUESTS',
      skillTree: 'SKILL TREE',
      achievementTimeline: 'ACHIEVEMENT TIMELINE',
      trainingGrounds: 'TRAINING GROUNDS',
    },
    contact: {
      getInTouch: 'Get In Touch',
      sendMessage: 'Send me a message',
      name: 'Name',
      email: 'Message me',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      phone: 'Phone',
      location: 'Location',
      initiateContact: 'INITIATE CONTACT',
      sendMessageTitle: 'SEND MESSAGE',
      formDescription: "Fill out the form below and I'll get back to you as soon as possible.",
      transmissionComplete: 'TRANSMISSION COMPLETE!',
      willReply: "I'll get back to you soon.",
      nameLabel: 'NAME',
      subjectLabel: 'SUBJECT',
      messageLabel: 'MESSAGE',
      yourName: 'Your name',
      whatsThisAbout: "What's this about?",
      yourMessage: 'Your message...',
      transmitting: 'TRANSMITTING...',
      sendTransmission: 'SEND TRANSMISSION',
      messageSent: 'Message sent!',
      thankYou: "Thank you for reaching out. I'll get back to you soon.",
      errorSending: 'Error',
      errorMessage: 'Failed to send message. Please try again.',
    },
    resume: {
      title: 'My Resume',
      noResume: 'No resume uploaded yet. Check back later!',
      downloadPdf: 'Download PDF',
    },
    common: {
      loading: 'Loading...',
      save: 'Save Changes',
      saveShort: 'Save',
      saving: 'Saving...',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      viewProject: 'View Project',
      viewGithub: 'View GitHub',
      present: 'Present',
      skillLevel: 'SKILL LEVEL',
      max: 'MAX',
      mastery: 'MASTERY',
      expert: 'EXPERT',
      quest: 'QUEST',
      level: 'LVL',
      completion: 'COMPLETION',
      achievement: 'ACHIEVEMENT',
      projectsLabel: 'PROJECTS',
      technologiesLabel: 'TECHNOLOGIES',
      knowledgeGained: 'KNOWLEDGE GAINED',
      unlocked: 'UNLOCKED',
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
      messages: 'Messages',
      error: 'Error',
      success: 'Success!',
      saved: 'Saved!',
      added: 'Added!',
      updated: 'Updated!',
      deleted: 'Deleted!',
      aboutMeUpdated: 'About Me section updated.',
      contactUpdated: 'Contact information updated.',
      projectAdded: 'New project added.',
      projectUpdated: 'Project updated.',
      projectRemoved: 'Project removed.',
      experienceAdded: 'New experience added.',
      experienceUpdated: 'Experience updated.',
      experienceRemoved: 'Experience removed.',
      skillAdded: 'New skill added.',
      skillUpdated: 'Skill updated.',
      skillRemoved: 'Skill removed.',
      hobbyAdded: 'New hobby added.',
      hobbyUpdated: 'Hobby updated.',
      hobbyRemoved: 'Hobby removed.',
      educationAdded: 'New education added.',
      educationUpdated: 'Education updated.',
      educationRemoved: 'Education removed.',
      resumeUploaded: 'Resume uploaded successfully.',
      resumeRemoved: 'Resume removed.',
      uploadError: 'Error',
      uploadPdfOrImage: 'Please upload a PDF or image file.',
      failedToUpload: 'Failed to upload resume.',
      failedToRemove: 'Failed to remove resume.',
      addNewProject: 'Add New Project',
      editProject: 'Edit Project',
      addNewExperience: 'Add New Experience',
      editExperience: 'Edit Experience',
      addNewSkill: 'Add New Skill',
      editSkill: 'Edit Skill',
      addNewEducation: 'Add New Education',
      editEducation: 'Edit Education',
      addNewHobby: 'Add New Hobby',
      editHobby: 'Edit Hobby',
      profilePictureLabel: 'Profile Picture',
      profilePreviewAlt: 'Profile preview',
      noImage: 'No image',
      uploadProfilePictureHelp: 'Upload a profile picture (JPG, PNG)',
      nameLabel: 'Name',
      titleLabel: 'Title',
      bioLabel: 'Bio',
      emailLabel: 'Email',
      locationLabel: 'Location',
      linkedinLabel: 'LinkedIn URL',
      githubLabel: 'GitHub URL',
      projectTitleLabel: 'Title',
      projectDescriptionLabel: 'Description',
      projectTechnologiesLabel: 'Technologies (comma-separated)',
      projectTechnologiesPlaceholder: 'React, Node.js, PostgreSQL',
      projectLinkLabel: 'Link (optional)',
      projectLinkPlaceholder: 'https://github.com/...',
      experienceRoleLabel: 'Role',
      experienceCompanyLabel: 'Company',
      experienceDurationLabel: 'Duration',
      experienceDurationPlaceholder: 'June 2023 - Present',
      experienceDescriptionLabel: 'Description',
      experienceSkillsLabel: 'Skills (comma-separated)',
      experienceSkillsPlaceholder: 'React, Node.js, Python',
      skillNameLabel: 'Skill Name',
      skillCategoryLabel: 'Category',
      skillCategoryPlaceholder: 'e.g., Programming Languages, Frameworks',
      educationDegreeLabel: 'Degree',
      educationInstitutionLabel: 'Institution',
      educationDurationLabel: 'Duration',
      educationDurationPlaceholder: '2021 - 2025',
      educationDescriptionLabel: 'Description',
      hobbyNameLabel: 'Hobby Name',
      hobbyCategoryLabel: 'Category',
      hobbyCategoryPlaceholder: 'e.g., Sports, Arts, Gaming',
      hobbyIconLabel: 'Icon (optional)',
      hobbyIconPlaceholder: 'e.g., 🎮, 📚, 🎵',
      resumePdfLabel: 'Resume PDF',
      viewPdfLink: 'View PDF',
      resumePreviewAlt: 'Resume preview',
      loadingTestimonials: 'Loading testimonials...',
      pendingLabel: 'pending',
      failedToLoadTestimonials: 'Failed to load testimonials.',
      testimonialApprovedDesc: 'Testimonial has been approved.',
      testimonialRejectedDesc: 'Testimonial has been rejected.',
      failedToUpdateTestimonial: 'Failed to update testimonial.',
      testimonialDeletedDesc: 'Testimonial has been removed.',
      failedToDeleteTestimonial: 'Failed to delete testimonial.',
      contactMessagesTitle: 'Contact Messages',
      unreadLabel: 'unread',
      noContactMessages: 'No contact messages yet.',
      markAsRead: 'Mark as read',
      markAsUnread: 'Mark as unread',
      markedAsRead: 'Marked as read',
      markedAsUnread: 'Marked as unread',
      messageMarkedRead: 'Message has been marked as read.',
      messageMarkedUnread: 'Message has been marked as unread.',
      failedToLoadMessages: 'Failed to load contact messages.',
      failedToUpdateMessage: 'Failed to update message status.',
      failedToDeleteMessage: 'Failed to delete message.',
      messageDeleted: 'Message has been deleted.',
      deleteMessageTitle: 'Delete Message',
      deleteMessageConfirm: 'Are you sure you want to delete this message? This action cannot be undone.',
      fromLabel: 'From:',
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
      accountCreated: 'Check your email!',
      signupSuccess: 'We sent you a confirmation email. Please check your inbox and click the link to verify your account.',
      loggingIn: 'Logging in...',
      creatingAccount: 'Creating account...',
      createAccount: 'Create Account',
      error: 'Error',
      passwordRequirements: 'Password does not meet all requirements',
      passwordsDoNotMatch: 'Passwords do not match',
      checkEmail: 'Check Your Email',
      emailConfirmation: 'Email Confirmation Required',
      confirmEmailMessage: 'Please check your email and click the confirmation link to activate your account.',
      emailPlaceholder: 'you@example.com',
      invalidEmail: 'Please enter a valid email address',
      emailNotConfirmed: 'Please confirm your email before logging in. Check your inbox for the confirmation link.',
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
      error: 'Error',
      failedToSubmit: 'Failed to submit testimonial',
    },
    footer: {
      openChannel: 'OPEN CHANNEL',
        builtWith: 'Built with',
      builtWithPassion: 'PASSION',
      pressStartToContinue: 'PRESS START TO CONTINUE',
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
      online: 'EN LIGNE',
      ready: 'PRÊT',
      scrollToExplore: 'FAITES DÉFILER POUR EXPLORER',
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
      playerProfile: 'PROFIL JOUEUR',
      questLog: 'JOURNAL DE QUÊTES',
      sideQuests: 'QUÊTES SECONDAIRES',
      skillTree: 'ARBRE DES COMPÉTENCES',
      achievementTimeline: 'CHRONOLOGIE DES RÉALISATIONS',
      trainingGrounds: 'TERRAINS D’ENTRAÎNEMENT',
    },
    contact: {
      getInTouch: 'Me contacter',
      sendMessage: 'Envoyez-moi un message',
      name: 'Nom',
      email: 'Messagez-moi',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      phone: 'Téléphone',
      location: 'Localisation',
      initiateContact: 'INITIER LE CONTACT',
      sendMessageTitle: 'ENVOYER UN MESSAGE',
      formDescription: 'Remplissez le formulaire ci-dessous et je vous répondrai dès que possible.',
      transmissionComplete: 'TRANSMISSION TERMINÉE!',
      willReply: 'Je vous répondrai bientôt.',
      nameLabel: 'NOM',
      subjectLabel: 'SUJET',
      messageLabel: 'MESSAGE',
      yourName: 'Votre nom',
      whatsThisAbout: 'De quoi s\'agit-il?',
      yourMessage: 'Votre message...',
      transmitting: 'TRANSMISSION...',
      sendTransmission: 'ENVOYER LA TRANSMISSION',
      messageSent: 'Message envoyé!',
      thankYou: 'Merci de m\'avoir contacté. Je vous répondrai bientôt.',
      errorSending: 'Erreur',
      errorMessage: 'Échec de l\'envoi du message. Veuillez réessayer.',
    },
    resume: {
      title: 'Mon CV',
      noResume: 'Aucun CV téléchargé pour le moment. Revenez plus tard!',
      downloadPdf: 'Télécharger le PDF',
    },
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      saveShort: 'Enregistrer',
      saving: 'Enregistrement...',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      cancel: 'Annuler',
      viewProject: 'Voir le projet',
      viewGithub: 'Voir GitHub',
      present: 'Présent',
      skillLevel: 'NIVEAU DE COMPÉTENCE',
      max: 'MAX',
      mastery: 'MAÎTRISE',
      expert: 'SPÉCIALISTE',
      quest: 'QUÊTE',
      level: 'NIV',
      completion: 'COMPLÉTUDE',
      achievement: 'RÉUSSITE',
      projectsLabel: 'PROJETS',
      technologiesLabel: 'TECHNOLOGIES',
      knowledgeGained: 'CONNAISSANCES ACQUISES',
      unlocked: 'DÉVERROUILLÉ',
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
      messages: 'Messages',
      error: 'Erreur',
      success: 'Succès!',
      saved: 'Enregistré!',
      added: 'Ajouté!',
      updated: 'Mis à jour!',
      deleted: 'Supprimé!',
      aboutMeUpdated: 'Section À propos de moi mise à jour.',
      contactUpdated: 'Informations de contact mises à jour.',
      projectAdded: 'Nouveau projet ajouté.',
      projectUpdated: 'Projet mis à jour.',
      projectRemoved: 'Projet supprimé.',
      experienceAdded: 'Nouvelle expérience ajoutée.',
      experienceUpdated: 'Expérience mise à jour.',
      experienceRemoved: 'Expérience supprimée.',
      skillAdded: 'Nouvelle compétence ajoutée.',
      skillUpdated: 'Compétence mise à jour.',
      skillRemoved: 'Compétence supprimée.',
      hobbyAdded: 'Nouveau loisir ajouté.',
      hobbyUpdated: 'Loisir mis à jour.',
      hobbyRemoved: 'Loisir supprimé.',
      educationAdded: 'Nouvelle formation ajoutée.',
      educationUpdated: 'Formation mise à jour.',
      educationRemoved: 'Formation supprimée.',
      resumeUploaded: 'CV téléchargé avec succès.',
      resumeRemoved: 'CV supprimé.',
      uploadError: 'Erreur',
      uploadPdfOrImage: 'Veuillez télécharger un fichier PDF ou image.',
      failedToUpload: 'Échec du téléchargement du CV.',
      failedToRemove: 'Échec de la suppression du CV.',
      addNewProject: 'Ajouter un nouveau projet',
      editProject: 'Modifier le projet',
      addNewExperience: 'Ajouter une nouvelle expérience',
      editExperience: 'Modifier l\'expérience',
      addNewSkill: 'Ajouter une nouvelle compétence',
      editSkill: 'Modifier la compétence',
      addNewEducation: 'Ajouter une nouvelle formation',
      editEducation: 'Modifier la formation',
      addNewHobby: 'Ajouter un nouveau loisir',
      editHobby: 'Modifier le loisir',
      profilePictureLabel: 'Photo de profil',
      profilePreviewAlt: 'Aperçu du profil',
      noImage: 'Aucune image',
      uploadProfilePictureHelp: 'Téléchargez une photo de profil (JPG, PNG)',
      nameLabel: 'Nom',
      titleLabel: 'Titre',
      bioLabel: 'Bio',
      emailLabel: 'Email',
      locationLabel: 'Localisation',
      linkedinLabel: 'URL LinkedIn',
      githubLabel: 'URL GitHub',
      projectTitleLabel: 'Titre',
      projectDescriptionLabel: 'Description',
      projectTechnologiesLabel: 'Technologies (séparées par des virgules)',
      projectTechnologiesPlaceholder: 'React, Node.js, PostgreSQL',
      projectLinkLabel: 'Lien (optionnel)',
      projectLinkPlaceholder: 'https://github.com/...',
      experienceRoleLabel: 'Poste',
      experienceCompanyLabel: 'Entreprise',
      experienceDurationLabel: 'Durée',
      experienceDurationPlaceholder: 'Juin 2023 - Présent',
      experienceDescriptionLabel: 'Description',
      experienceSkillsLabel: 'Compétences (séparées par des virgules)',
      experienceSkillsPlaceholder: 'React, Node.js, Python',
      skillNameLabel: 'Nom de la compétence',
      skillCategoryLabel: 'Catégorie',
      skillCategoryPlaceholder: 'ex. Langages de programmation, Frameworks',
      educationDegreeLabel: 'Diplôme',
      educationInstitutionLabel: 'Établissement',
      educationDurationLabel: 'Durée',
      educationDurationPlaceholder: '2021 - 2025',
      educationDescriptionLabel: 'Description',
      hobbyNameLabel: 'Nom du loisir',
      hobbyCategoryLabel: 'Catégorie',
      hobbyCategoryPlaceholder: 'ex. Sports, Arts, Jeux vidéo',
      hobbyIconLabel: 'Icône (optionnelle)',
      hobbyIconPlaceholder: 'ex. 🎮, 📚, 🎵',
      resumePdfLabel: 'CV PDF',
      viewPdfLink: 'Voir le PDF',
      resumePreviewAlt: 'Aperçu du CV',
      loadingTestimonials: 'Chargement des témoignages...',
      pendingLabel: 'en attente',
      failedToLoadTestimonials: 'Échec du chargement des témoignages.',
      testimonialApprovedDesc: 'Le témoignage a été approuvé.',
      testimonialRejectedDesc: 'Le témoignage a été rejeté.',
      failedToUpdateTestimonial: 'Échec de la mise à jour du témoignage.',
      testimonialDeletedDesc: 'Le témoignage a été supprimé.',
      failedToDeleteTestimonial: 'Échec de la suppression du témoignage.',
      contactMessagesTitle: 'Messages de contact',
      unreadLabel: 'non lus',
      noContactMessages: 'Aucun message de contact pour le moment.',
      markAsRead: 'Marquer comme lu',
      markAsUnread: 'Marquer comme non lu',
      markedAsRead: 'Marqué comme lu',
      markedAsUnread: 'Marqué comme non lu',
      messageMarkedRead: 'Le message a été marqué comme lu.',
      messageMarkedUnread: 'Le message a été marqué comme non lu.',
      failedToLoadMessages: 'Échec du chargement des messages de contact.',
      failedToUpdateMessage: 'Échec de la mise à jour du statut du message.',
      failedToDeleteMessage: 'Échec de la suppression du message.',
      messageDeleted: 'Le message a été supprimé.',
      deleteMessageTitle: 'Supprimer le message',
      deleteMessageConfirm: 'Êtes-vous sûr de vouloir supprimer ce message? Cette action est irréversible.',
      fromLabel: 'De :',
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
      accountCreated: 'Vérifiez votre email!',
      signupSuccess: 'Nous vous avons envoyé un email de confirmation. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vérifier votre compte.',
      loggingIn: 'Connexion en cours...',
      creatingAccount: 'Création du compte...',
      createAccount: 'Créer un compte',
      error: 'Erreur',
      passwordRequirements: 'Le mot de passe ne répond pas à toutes les exigences',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
      checkEmail: 'Vérifiez votre email',
      emailConfirmation: 'Confirmation email requise',
      confirmEmailMessage: 'Veuillez vérifier votre email et cliquer sur le lien de confirmation pour activer votre compte.',
      emailPlaceholder: 'vous@exemple.com',
      invalidEmail: 'Veuillez entrer une adresse email valide',
      emailNotConfirmed: 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception pour le lien de confirmation.',
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
      error: 'Erreur',
      failedToSubmit: 'Échec de la soumission du témoignage',
    },
    footer: {
      openChannel: 'OUVRIR LE CANAL',
        builtWith: 'Créé avec',
      builtWithPassion: 'PASSION',
      pressStartToContinue: 'APPUYEZ SUR DÉMARRER POUR CONTINUER',
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
