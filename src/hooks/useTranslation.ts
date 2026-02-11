import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const TRANSLATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`;

// In-memory cache for translations
const translationCache: Record<string, Record<string, string>> = {
  en: {},
  fr: {},
};

const manualTranslations: Record<string, Record<string, string>> = {
  fr: {
    'Computer Science Student': 'Étudiant en informatique',
    'Skill level': 'Niveau de compétence',
    'SKILL LEVEL': 'NIVEAU DE COMPÉTENCE',
    'Player Profile': 'Profil joueur',
    'PLAYER PROFILE': 'PROFIL JOUEUR',
    'Projects': 'Projets',
    'PROJECTS': 'PROJETS',
    'Technologies': 'Technologies',
    'TECHNOLOGIES': 'TECHNOLOGIES',
    'Side quests': 'Quêtes secondaires',
    'SIDE QUESTS': 'QUÊTES SECONDAIRES',
    'Indoor': 'Intérieur',
    'Gaming': 'Jeux vidéo',
    'Watching shows': 'Regarder des séries',
    'Music': 'Musique',
    'Quest Log': 'Journal de quêtes',
    'QUEST LOG': 'JOURNAL DE QUÊTES',
    'Completion': 'Complétude',
    'COMPLETION': 'COMPLÉTUDE',
    'Achievement Timeline': 'Chronologie des réalisations',
    'ACHIEVEMENT TIMELINE': 'CHRONOLOGIE DES RÉALISATIONS',
    'Training Grounds': 'Terrains d’entraînement',
    'TRAINING GROUNDS': 'TERRAINS D’ENTRAÎNEMENT',
    'Knowledge Gained': 'Connaissances acquises',
    'KNOWLEDGE GAINED': 'CONNAISSANCES ACQUISES',
    'September': 'septembre',
    'October': 'octobre',
    'November': 'novembre',
    'December': 'décembre',
    'January': 'janvier',
    'February': 'février',
    'March': 'mars',
    'April': 'avril',
    'May': 'mai',
    'June': 'juin',
    'July': 'juillet',
    'August': 'août',
    'Present': 'Présent',
    'Full-stack Computer Science student at Champlain College St-Lambert with experience in backend development, frontend technologies, and API integration. I work with Java, Spring Boot, JavaScript, TypeScript, React, Next.js, SQL, and Docker, and I enjoy building reliable applications that are clear to maintain and extend. I’ve worked across different parts of the development process, from designing REST APIs to implementing user interfaces and managing data. I’m continuing to grow my skills through practical projects and team-based coursework.':
      'Étudiant en informatique full-stack au Collège Champlain St-Lambert avec de l’expérience en développement backend, technologies frontend et intégration d’API. Je travaille avec Java, Spring Boot, JavaScript, TypeScript, React, Next.js, SQL et Docker, et j’aime créer des applications fiables, faciles à maintenir et à faire évoluer. J’ai travaillé sur différentes parties du processus de développement, de la conception d’API REST à l’implémentation d’interfaces utilisateur et à la gestion des données. Je continue de développer mes compétences grâce à des projets pratiques et des cours en équipe.',
    'External client project built in a team of 5 where my focus was on the employee side with projects.':
      'Projet pour un client externe réalisé en équipe de 5, où je me suis concentré sur la partie employé et les projets.',
    'Full-stack job exploration platform with Spring Boot backend and React frontend.':
      'Plateforme d’exploration d’emplois full-stack avec un backend Spring Boot et un frontend React.',
    'Full-stack demo gambling-style web app with authentication built with Next.js.':
      'Application web de démonstration de style casino full-stack avec authentification, construite avec Next.js.',
    'Computer Science Tutor': 'Tuteur en informatique',
    'Champlain College St-Lambert': 'Collège Champlain St-Lambert',
    'Supported about 20 second year students each week with SQL topics including joins, filtering and relational design and held weekly tutoring sessions to guide students through labs and assignments and help clarify difficult concepts.':
      'J’ai soutenu environ 20 étudiants de deuxième année chaque semaine sur des sujets SQL, notamment les jointures, le filtrage et la conception relationnelle, et j’ai animé des séances de tutorat hebdomadaires pour les guider dans les laboratoires et les travaux et clarifier les concepts difficiles.',
    'Programming Languages': 'Langages de programmation',
    'Tools & Frameworks': 'Outils et frameworks',
    'DEC in Computer Science and Technology': 'DEC en informatique et technologie',
    'Relevant coursework: Web Services and Distributed Computing, Database Administration & Security, Web Programming and JS Libraries.':
      'Cours pertinents : Services Web et informatique distribuée, Administration et sécurité des bases de données, Programmation Web et bibliothèques JavaScript.',
  },
};

const inlineReplacements: Record<string, Record<string, string>> = {
  fr: {
    January: 'janvier',
    February: 'février',
    March: 'mars',
    April: 'avril',
    May: 'mai',
    June: 'juin',
    July: 'juillet',
    August: 'août',
    September: 'septembre',
    October: 'octobre',
    November: 'novembre',
    December: 'décembre',
    Present: 'Présent',
  },
};

const applyInlineReplacements = (text: string, targetLang: string): string => {
  const replacements = inlineReplacements[targetLang];
  if (!replacements) return text;
  let result = text;
  Object.entries(replacements).forEach(([source, replacement]) => {
    const regex = new RegExp(`\\b${source}\\b`, 'g');
    result = result.replace(regex, replacement);
  });
  return result;
};

const getManualTranslation = (text: string, targetLang: string): string | undefined => {
  const map = manualTranslations[targetLang];
  if (!map) return undefined;
  return map[text];
};

// Batch translation function - translates multiple texts in one API call
const translateBatch = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (!texts.length) return [];
  
  // Filter out empty texts and already cached texts
  const textsToTranslate: string[] = [];
  const indices: number[] = [];
  
  texts.forEach((text, i) => {
    if (!text || !text.trim()) return;
    const manual = getManualTranslation(text, targetLang);
    if (manual) {
      if (!translationCache[targetLang]) translationCache[targetLang] = {};
      translationCache[targetLang][text] = manual;
      return;
    }
    const replaced = applyInlineReplacements(text, targetLang);
    if (replaced !== text) {
      if (!translationCache[targetLang]) translationCache[targetLang] = {};
      translationCache[targetLang][text] = replaced;
      return;
    }
    if (translationCache[targetLang]?.[text]) return;
    textsToTranslate.push(text);
    indices.push(i);
  });
  
  // If all texts are cached, return cached versions
  if (textsToTranslate.length === 0) {
    return texts.map(t => translationCache[targetLang]?.[t] || t);
  }
  
  try {
    const response = await fetch(TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: targetLang }),
    });

    if (!response.ok) {
      console.error('Batch translation failed:', response.status);
      return texts;
    }

    const data = await response.json();
    const translations = data.translations || [];
    
    // Cache the translations and build result
    textsToTranslate.forEach((originalText, i) => {
      const translated = translations[i] || originalText;
      if (!translationCache[targetLang]) translationCache[targetLang] = {};
      translationCache[targetLang][originalText] = translated;
    });
    
    // Return all texts with translations applied
    return texts.map(t => translationCache[targetLang]?.[t] || t);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};

export const useTranslatedText = (originalText: string | null | undefined) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(originalText || '');
  const [isTranslating, setIsTranslating] = useState(false);
  const prevTextRef = useRef<string>('');
  const prevLangRef = useRef<string>(language);

  useEffect(() => {
    if (!originalText) {
      setTranslatedText('');
      return;
    }

    // If English, no translation needed
    if (language === 'en') {
      setTranslatedText(originalText);
      translationCache['en'][originalText] = originalText;
      return;
    }

    const manual = getManualTranslation(originalText, language);
    if (manual) {
      if (!translationCache[language]) translationCache[language] = {};
      translationCache[language][originalText] = manual;
      setTranslatedText(manual);
      return;
    }

    const replaced = applyInlineReplacements(originalText, language);
    if (replaced !== originalText) {
      if (!translationCache[language]) translationCache[language] = {};
      translationCache[language][originalText] = replaced;
      setTranslatedText(replaced);
      return;
    }

    // Check cache first
    if (translationCache[language]?.[originalText]) {
      setTranslatedText(translationCache[language][originalText]);
      return;
    }

    // Skip if we already translated this exact text for this language
    if (prevTextRef.current === originalText && prevLangRef.current === language) {
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    translateBatch([originalText], language).then(([result]) => {
      if (!cancelled) {
        setTranslatedText(result);
        prevTextRef.current = originalText;
        prevLangRef.current = language;
        setIsTranslating(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [originalText, language]);

  return { text: translatedText, isTranslating };
};

// Hook for translating arrays of items - uses batch translation
export const useTranslatedArray = <T extends Record<string, unknown>>(
  items: T[],
  fieldsToTranslate: (keyof T)[]
) => {
  const { language } = useLanguage();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevKeyRef = useRef<string>('');
  const prevLangRef = useRef<string>(language);

  useEffect(() => {
    const itemsKey = JSON.stringify(items.map(i => fieldsToTranslate.map(f => i[f])));
    
    // If no items, reset state
    if (!items.length) {
      setTranslatedItems([]);
      prevKeyRef.current = '';
      return;
    }

    // If English, just use original items
    if (language === 'en') {
      setTranslatedItems(items);
      prevKeyRef.current = itemsKey;
      prevLangRef.current = language;
      return;
    }

    // If items haven't changed and language hasn't changed, skip
    if (prevKeyRef.current === itemsKey && prevLangRef.current === language) {
      return;
    }

    // Show original items immediately while translating
    if (prevKeyRef.current !== itemsKey) {
      setTranslatedItems(items);
    }

    let cancelled = false;
    
    const translateItems = async () => {
      setIsTranslating(true);
      
      try {
        // Collect all unique texts that need translation
        const textsToTranslate: string[] = [];
        const textToIndex: Map<string, number> = new Map();
        
        items.forEach(item => {
          fieldsToTranslate.forEach(field => {
            const value = item[field];
            if (typeof value === 'string' && value.trim() && !textToIndex.has(value)) {
              // Skip if already cached
              if (!translationCache[language]?.[value]) {
                textToIndex.set(value, textsToTranslate.length);
                textsToTranslate.push(value);
              }
            }
          });
        });
        
        // Batch translate all unique texts at once (single API call!)
        if (textsToTranslate.length > 0) {
          await translateBatch(textsToTranslate, language);
        }
        
        // Build translated items from cache
        const translated = items.map(item => {
          const translatedItem = { ...item };
          fieldsToTranslate.forEach(field => {
            const value = item[field];
            if (typeof value === 'string' && value.trim()) {
              const cachedTranslation = translationCache[language]?.[value];
              if (cachedTranslation) {
                (translatedItem as Record<string, unknown>)[field as string] = cachedTranslation;
              }
            }
          });
          return translatedItem;
        });
        
        if (!cancelled) {
          setTranslatedItems(translated);
          prevKeyRef.current = itemsKey;
          prevLangRef.current = language;
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    translateItems();

    return () => {
      cancelled = true;
    };
  }, [items, language, fieldsToTranslate]);

  return { items: translatedItems, isTranslating };
};