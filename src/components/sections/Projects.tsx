import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Loader2, ArrowUpRight } from 'lucide-react';
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
  const { t } = useLanguage();
  const { projects } = data;

  const projectsForTranslation = useMemo(() => 
    projects.map(p => ({ ...p })), 
    [projects]
  );
  
  const { items: translatedProjects, isTranslating } = useTranslatedArray(
    projectsForTranslation,
    ['description']
  );

  const displayProjects = translatedProjects.length > 0 ? translatedProjects : projects;

  return (
    <section id="projects" className="py-32 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-glow-primary mb-4 block">MY WORK</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
            {t.sections.projects}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <motion.div
          key={`projects-container-${displayProjects.length}`}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {displayProjects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <Card className="h-full group relative overflow-hidden glass glass-hover transition-all duration-500 hover:-translate-y-2">
                {/* Gradient accent on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-glow-primary to-glow-secondary" />
                </div>

                {/* Project number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-foreground/5 group-hover:text-foreground/10 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="group-hover:text-gradient transition-all duration-300">
                      {project.title}
                    </span>
                    <div className="flex gap-2">
                      {project.github && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                      )}
                      {project.link && (
                        <motion.a
                          whileHover={{ scale: 1.1, rotate: 45 }}
                          whileTap={{ scale: 0.9 }}
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-glow-primary transition-colors"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.a>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="mb-6 text-base leading-relaxed">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-secondary/50 hover:bg-glow-primary/20 hover:text-glow-primary border-transparent hover:border-glow-primary/30 transition-all duration-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
