import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 },
};

const Skills = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { skills } = data;

  const skillsForTranslation = useMemo(() => 
    skills.map(s => ({ ...s, category: s.category, name: s.name })), 
    [skills]
  );

  const { items: translatedSkills, isTranslating } = useTranslatedArray(
    skillsForTranslation,
    ['category', 'name']
  );

  const categories = [...new Set(translatedSkills.map((s) => s.category))];

  return (
    <section id="skills" className="py-32 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        {/* Decorative circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full border border-border/10 rounded-full"
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
          <span className="text-sm font-medium text-glow-secondary mb-4 block">EXPERTISE</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
            {t.sections.skills}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-glow-primary to-glow-secondary" />
                {category}
              </h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {translatedSkills
                  .filter((s) => s.category === category)
                  .map((skill, index) => (
                    <motion.div 
                      key={skill.id} 
                      variants={item}
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div
                        className="px-5 py-3 rounded-xl text-sm font-medium cursor-default transition-all duration-300 
                                   bg-secondary/50 text-foreground border border-transparent
                                   hover:bg-glow-primary/20 hover:text-glow-primary hover:border-glow-primary/30 hover:glow-primary"
                      >
                        {skill.name}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
