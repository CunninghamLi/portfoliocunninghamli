import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cpu, Sparkles } from 'lucide-react';
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
  const { t, language } = useLanguage();
  const { skills } = data;

  const displaySkills = useMemo(() => 
    skills.map(s => ({ 
      ...s, 
      name: language === 'fr' && s.name_fr ? s.name_fr : s.name,
      category: language === 'fr' && s.category_fr ? s.category_fr : s.category
    })), 
    [skills, language]
  );

  const categories = [...new Set(displaySkills.map((s) => s.category))];

  return (
    <section id="skills" className="py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hex-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-mesh" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-cyan mb-4 block tracking-wider">
            {'// ' + t.sections.skillTree}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-cyan flex items-center justify-center gap-3">
            <Cpu className="w-10 h-10" />
            {t.sections.skills}
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
              className="game-card p-8"
            >
              {/* Category header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border border-neon-cyan flex items-center justify-center"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                </motion.div>
                <h3 className="text-xl font-game font-bold text-foreground uppercase">
                  {category}
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                <span className="font-pixel text-[8px] text-muted-foreground">
                  {displaySkills.filter(s => s.category === category).length} {t.common.unlocked}
                </span>
              </div>

              {/* Skills grid */}
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {displaySkills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <motion.div 
                      key={skill.id} 
                      variants={item}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -5,
                        boxShadow: '0 0 20px hsl(180 100% 50% / 0.5)'
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div
                        className="px-5 py-3 text-sm font-body cursor-default transition-all duration-300 
                                   bg-muted/30 text-foreground border border-neon-cyan/30
                                   hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan"
                      >
                        <span className="text-neon-cyan/50 mr-1">+</span>
                        {skill.name}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
                  <span>{t.common.mastery}</span>
                  <span>{t.common.expert}</span>
                </div>
                <div className="power-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: catIndex * 0.2 }}
                    className="power-bar-fill"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
