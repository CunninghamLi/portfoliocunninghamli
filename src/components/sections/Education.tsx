import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { GraduationCap, Loader2, Calendar, Award } from 'lucide-react';
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
      {/* Background */}
      <div className="absolute inset-0 bg-hex-pattern opacity-20" />
      
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-neon-yellow/10"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-yellow mb-4 block tracking-wider">
            {'// TRAINING GROUNDS'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-yellow flex items-center justify-center gap-3">
            <Award className="w-10 h-10" />
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
                className="game-card p-8 transition-all duration-300 relative group"
              >
                {/* Side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-yellow via-neon-orange to-neon-yellow opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Achievement badge */}
                <div className="absolute top-4 right-4 font-pixel text-[8px] text-neon-yellow/50 group-hover:text-neon-yellow transition-colors">
                  ACHIEVEMENT #{String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Icon container */}
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                    className="w-16 h-16 flex items-center justify-center shrink-0 border-2 border-neon-yellow bg-neon-yellow/10"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    <GraduationCap className="w-8 h-8 text-neon-yellow" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="text-xl md:text-2xl font-game font-bold text-foreground">{edu.degree}</h3>
                      <span className="inline-flex items-center gap-2 font-pixel text-[8px] text-muted-foreground border border-muted-foreground/30 px-3 py-1">
                        <Calendar className="w-3 h-3" />
                        {edu.duration}
                      </span>
                    </div>
                    <p className="text-lg text-neon-yellow font-semibold font-body">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-muted-foreground leading-relaxed font-body">
                        {'> '}{edu.description}
                      </p>
                    )}

                    {/* XP earned */}
                    <div className="pt-4">
                      <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
                        <span>KNOWLEDGE GAINED</span>
                        <span>+{(index + 1) * 500} XP</span>
                      </div>
                      <div className="power-bar">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                          className="power-bar-fill"
                          style={{ background: 'linear-gradient(90deg, hsl(50 100% 50%), hsl(25 100% 55%))' }}
                        />
                      </div>
                    </div>
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
