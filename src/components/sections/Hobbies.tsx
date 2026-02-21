import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Heart, Gamepad2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  show: { opacity: 1, scale: 1, rotate: 0 },
};

const Hobbies = () => {
  const { data, loading } = usePortfolio();
  const { t, language } = useLanguage();

  const displayHobbies = useMemo(
    () => data.hobbies.map((hobby) => ({ 
      ...hobby,
      name: language === 'fr' && hobby.name_fr ? hobby.name_fr : hobby.name,
      category: language === 'fr' && hobby.category_fr ? hobby.category_fr : hobby.category
    })),
    [data.hobbies, language]
  );

  const hobbiesByCategory = useMemo(() => {
    return displayHobbies.reduce((acc, hobby) => {
      if (!acc[hobby.category]) {
        acc[hobby.category] = [];
      }
      acc[hobby.category].push(hobby);
      return acc;
    }, {} as Record<string, typeof displayHobbies>);
  }, [displayHobbies]);

  if (loading) {
    return (
      <section id="hobbies" className="py-32 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      </section>
    );
  }

  if (data.hobbies.length === 0) {
    return null;
  }

  return (
    <section id="hobbies" className="py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-game opacity-10" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-neon-pink/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-neon-cyan/10 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-pink mb-4 block tracking-wider flex items-center justify-center gap-2">
            <Heart className="w-3 h-3" /> {t.sections.sideQuests} <Gamepad2 className="w-3 h-3" />
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-pink">
            {t.sections.hobbies}
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-10">
          {Object.entries(hobbiesByCategory).map(([category, categoryHobbies], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: catIndex % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="game-card p-8"
            >
              {/* Category header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-neon-pink"
                  style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
                />
                <h3 className="text-xl font-game font-bold text-foreground uppercase">
                  {category}
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-neon-pink/50 to-transparent" />
              </div>

              {/* Hobbies */}
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-4"
              >
                {categoryHobbies.map((hobby) => (
                  <motion.div
                    key={hobby.id}
                    variants={item}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 2,
                      boxShadow: '0 0 20px hsl(320 100% 60% / 0.5)'
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div
                      className="flex items-center gap-2 px-5 py-3 text-sm font-body cursor-default 
                                 transition-all duration-300 bg-muted/30 text-foreground border border-neon-pink/30
                                 hover:bg-neon-pink/20 hover:text-neon-pink hover:border-neon-pink"
                    >
                      {hobby.icon && <span className="text-lg">{hobby.icon}</span>}
                      {hobby.name}
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

export default Hobbies;
