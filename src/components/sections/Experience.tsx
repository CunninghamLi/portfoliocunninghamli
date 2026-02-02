
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Briefcase, Loader2, Star, Zap } from 'lucide-react';
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
      {/* Background */}
      <div className="absolute inset-0 bg-grid-game opacity-10" />
      
      {/* Animated line */}
      <motion.div
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-neon-purple to-transparent opacity-30"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-purple mb-4 block tracking-wider">
            {'// ACHIEVEMENT TIMELINE'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-purple flex items-center justify-center gap-3">
            <Star className="w-10 h-10" />
            {t.sections.experience}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px]">
              <div className="h-full bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink" />
            </div>

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
                  <motion.div 
                    animate={{ boxShadow: ['0 0 10px hsl(180 100% 50%)', '0 0 30px hsl(180 100% 50%)', '0 0 10px hsl(180 100% 50%)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-background border-2 border-neon-cyan flex items-center justify-center"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    <Briefcase className="w-5 h-5 text-neon-cyan" />
                  </motion.div>
                </motion.div>

                {/* Content card */}
                <div className={`w-full md:w-[45%] ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="game-card p-6 transition-all duration-300"
                  >
                    {/* Level badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-pixel text-[8px] text-neon-cyan">
                        LVL {String(translatedExperiences.length - index).padStart(2, '0')}
                      </div>
                      <span className="font-pixel text-[8px] text-muted-foreground px-2 py-1 border border-muted-foreground/30">
                        {exp.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-game font-bold text-foreground">{exp.role}</h3>
                    <p className="text-neon-pink font-semibold font-body flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {exp.company}
                    </p>
                    
                    <p className="text-muted-foreground mt-4 leading-relaxed font-body">
                      {'> '}{exp.description}
                    </p>
                    
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.2 + i * 0.05 }}
                            className="px-3 py-1 text-sm font-body border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-colors"
                          >
                            +{skill}
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
