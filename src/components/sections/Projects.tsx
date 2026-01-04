import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedArray } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Projects = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { projects } = data;

  const projectsForTranslation = useMemo(() => 
    projects.map(p => ({ ...p, description: p.description })), 
    [projects]
  );
  
  const { items: translatedProjects, isTranslating } = useTranslatedArray(
    projectsForTranslation,
    ['description']
  );

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground flex items-center justify-center gap-2"
        >
          {t.sections.projects}
          {isTranslating && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {translatedProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors group-hover:scale-110 transform"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{project.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
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