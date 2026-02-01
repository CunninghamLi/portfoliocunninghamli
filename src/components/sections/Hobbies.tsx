import { motion } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Heart } from 'lucide-react';

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
  const { t } = useLanguage();

  const hobbiesByCategory = data.hobbies.reduce((acc, hobby) => {
    if (!acc[hobby.category]) {
      acc[hobby.category] = [];
    }
    acc[hobby.category].push(hobby);
    return acc;
  }, {} as Record<string, typeof data.hobbies>);

  if (loading) {
    return (
      <section id="hobbies" className="py-32 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-glow-primary" />
        </div>
      </section>
    );
  }

  if (data.hobbies.length === 0) {
    return null;
  }

  return (
    <section id="hobbies" className="py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-glow-secondary/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-glow-primary/10 blur-3xl"
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
          <span className="text-sm font-medium text-glow-secondary mb-4 block flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> BEYOND CODE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
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
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-glow-secondary to-glow-primary" />
                {category}
              </h3>
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
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium cursor-default 
                                 transition-all duration-300 bg-secondary/50 text-foreground border border-transparent
                                 hover:bg-glow-secondary/20 hover:text-glow-secondary hover:border-glow-secondary/30"
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
