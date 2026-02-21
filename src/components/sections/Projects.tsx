import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Github, Sword, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Projects = () => {
  const { data } = usePortfolio();
  const { t, language } = useLanguage();
  const { projects } = data;

  // Map projects to use the appropriate language
  const displayProjects = useMemo(() => 
    projects.map(p => ({
      ...p,
      title: language === 'fr' && p.title_fr ? p.title_fr : p.title,
      description: language === 'fr' && p.description_fr ? p.description_fr : p.description,
    })),
    [projects, language]
  );

  return (
    <section id="projects" className="py-32 bg-background relative overflow-hidden">
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
          <span className="font-pixel text-[10px] text-neon-pink mb-4 block tracking-wider">
            {'// ' + t.sections.questLog}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-pink flex items-center justify-center gap-3">
            <Sword className="w-10 h-10" />
            {t.sections.projects}
            <Shield className="w-10 h-10" />
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {displayProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full group relative overflow-hidden game-card transition-all duration-300">
                  {/* Quest number badge */}
                  <div className="absolute top-4 right-4 font-pixel text-[10px] text-neon-cyan/30 group-hover:text-neon-cyan transition-colors">
                    {t.common.quest} #{String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Status indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 left-4 w-2 h-2 bg-neon-green rounded-full"
                  />

                  <CardHeader className="relative z-10 pt-8">
                    <CardTitle className="flex items-center justify-between text-xl font-game">
                      <span className="text-foreground group-hover:text-neon-cyan transition-colors">
                        {project.title}
                      </span>
                      <div className="flex gap-2">
                        {project.github && (
                          <motion.a
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-neon-cyan transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </motion.a>
                        )}
                        {project.link && (
                          <motion.a
                            whileHover={{ scale: 1.2, rotate: -10 }}
                            whileTap={{ scale: 0.9 }}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-neon-pink transition-colors"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </motion.a>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="mb-6 text-base leading-relaxed font-body text-muted-foreground">
                      {'> '}{project.description}
                    </CardDescription>
                    
                    {/* Tech stack as "items" */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-muted/50 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all font-body"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>

                    {/* XP bar decoration */}
                    <div className="mt-6">
                      <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
                        <span>{t.common.completion}</span>
                        <span>100%</span>
                      </div>
                      <div className="power-bar">
                        <div className="power-bar-fill w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
