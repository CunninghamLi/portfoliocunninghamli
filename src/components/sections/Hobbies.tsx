import { motion } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const Hobbies = () => {
  const { data, loading } = usePortfolio();
  const { t } = useLanguage();

  // Group hobbies by category
  const hobbiesByCategory = data.hobbies.reduce((acc, hobby) => {
    if (!acc[hobby.category]) {
      acc[hobby.category] = [];
    }
    acc[hobby.category].push(hobby);
    return acc;
  }, {} as Record<string, typeof data.hobbies>);

  if (loading) {
    return (
      <section id="hobbies" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (data.hobbies.length === 0) {
    return null;
  }

  return (
    <section id="hobbies" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12 text-foreground flex items-center justify-center gap-3"
        >
          {t.sections.hobbies}
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {Object.entries(hobbiesByCategory).map(([category, categoryHobbies], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-foreground">{category}</h3>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {categoryHobbies.map((hobby) => (
                  <motion.div key={hobby.id} variants={item}>
                    <Badge
                      variant="secondary"
                      className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {hobby.icon && <span className="mr-2">{hobby.icon}</span>}
                      {hobby.name}
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

export default Hobbies;
