import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { GraduationCap, Loader2, Calendar } from 'lucide-react';
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
    <section id="education" className="py-32 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-secondary/20 to-transparent" />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-glow-primary/10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-glow-primary mb-4 block">ACADEMIC JOURNEY</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
            {t.sections.education}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {translatedEducation.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 10 }}
                className="glass rounded-2xl p-8 glass-hover transition-all duration-300 relative group"
              >
                {/* Gradient accent on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-glow-primary to-glow-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Icon container */}
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-glow-primary/20 to-glow-secondary/20 flex items-center justify-center shrink-0 border border-glow-primary/20"
                  >
                    <GraduationCap className="w-8 h-8 text-glow-primary" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">{edu.degree}</h3>
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {edu.duration}
                      </span>
                    </div>
                    <p className="text-lg text-gradient font-semibold">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
