import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Briefcase, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Experience = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { experiences } = data;

  const experiencesForTranslation = useMemo(() => 
    experiences.map(e => ({ ...e, description: e.description, role: e.role })), 
    [experiences]
  );

  const { items: translatedExperiences, isTranslating } = useTranslatedArray(
    experiencesForTranslation,
    ['description', 'role']
  );

  return (
    <section id="experience" className="py-32 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl bg-glow-primary/10"
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
          <span className="text-sm font-medium text-glow-primary mb-4 block">CAREER PATH</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
            {t.sections.experience}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line with gradient */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-glow-primary via-glow-secondary to-glow-primary" />

            {translatedExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                  className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-glow-primary flex items-center justify-center glow-primary">
                    <Briefcase className="w-5 h-5 text-glow-primary" />
                  </div>
                </motion.div>

                {/* Content card */}
                <div className={`w-full md:w-[45%] ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-xl p-6 glass-hover transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                        <p className="text-glow-primary font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                        {exp.duration}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mt-4 leading-relaxed">{exp.description}</p>
                    
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.2 + i * 0.05 }}
                            className="px-3 py-1 text-sm rounded-full bg-glow-primary/10 text-glow-primary border border-glow-primary/20"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
