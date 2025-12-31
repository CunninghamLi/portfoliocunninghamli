import { usePortfolio } from '@/contexts/PortfolioContext';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Experience = () => {
  const { data } = usePortfolio();
  const { experiences } = data;

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          Experience
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-primary/30 pl-8 ml-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-10 relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.2 + 0.2 }}
                  className="absolute -left-[41px] w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Briefcase className="w-3 h-3 text-primary-foreground" />
                </motion.div>
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-3">{exp.duration}</p>
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
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
