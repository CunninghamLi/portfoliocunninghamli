import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { GraduationCap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Education = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { education } = data;

  const educationForTranslation = useMemo(() => 
    education.map(e => ({ ...e, degree: e.degree, description: e.description || '' })), 
    [education]
  );

  const { items: translatedEducation, isTranslating } = useTranslatedArray(
    educationForTranslation,
    ['degree', 'description']
  );

  return (
    <section id="education" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground flex items-center justify-center gap-2"
        >
          {t.sections.education}
          {isTranslating && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {translatedEducation.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <GraduationCap className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-primary font-medium">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground mb-3">{edu.duration}</p>
                  <p className="text-muted-foreground">{edu.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;