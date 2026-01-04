import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray, useTranslatedText } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
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
    <section id="skills" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground flex items-center justify-center gap-2"
        >
          {t.sections.skills}
          {isTranslating && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </motion.h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {translatedSkills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <motion.div key={skill.id} variants={item}>
                      <Badge
                        variant="outline"
                        className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-200 cursor-default"
                      >
                        {skill.name}
                      </Badge>
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