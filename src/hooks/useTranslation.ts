import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const TRANSLATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`;

// In-memory cache for translations
const translationCache: Record<string, Record<string, string>> = {
  en: {},
  fr: {},
};

// Batch translation function - translates multiple texts in one API call
const translateBatch = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (!texts.length) return [];
  
  // Filter out empty texts and already cached texts
  const textsToTranslate: string[] = [];
  const indices: number[] = [];
  
  texts.forEach((text, i) => {
    if (!text || !text.trim()) return;
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