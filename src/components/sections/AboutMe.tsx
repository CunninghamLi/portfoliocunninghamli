import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutMe = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { aboutMe } = data;

  const { text: translatedTitle, isTranslating: titleLoading } = useTranslatedText(aboutMe.title);
  const { text: translatedBio, isTranslating: bioLoading } = useTranslatedText(aboutMe.bio);

  const isTranslating = titleLoading || bioLoading;

  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full border border-border/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full border border-border/10"
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
          <span className="text-sm font-medium text-glow-primary mb-4 block">GET TO KNOW ME</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {t.sections.aboutMe}
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image/Avatar section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Glow effect behind avatar */}
                <div className="absolute inset-0 rounded-2xl blur-3xl bg-gradient-to-br from-glow-primary/30 to-glow-secondary/30 scale-110" />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl glow-border overflow-hidden"
                >
                  {aboutMe.image ? (
                    <img
                      src={aboutMe.image}
                      alt={aboutMe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                      <User className="w-32 h-32 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>

                {/* Floating accent elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-xl bg-glow-primary/20 backdrop-blur-sm border border-glow-primary/30"
                />
                <motion.div
                  animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-glow-secondary/20 backdrop-blur-sm border border-glow-secondary/30"
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  {aboutMe.name}
                </h3>
                <p className="text-xl text-gradient font-semibold flex items-center gap-2">
                  {translatedTitle}
                  {isTranslating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </p>
              </div>

              <div className="w-20 h-1 bg-gradient-to-r from-glow-primary to-glow-secondary rounded-full" />

              <p className="text-lg text-muted-foreground leading-relaxed">
                {translatedBio}
              </p>

              {/* Stats or highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass rounded-xl p-4 text-center glass-hover transition-all duration-300">
                  <div className="text-2xl font-bold text-gradient">5+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="glass rounded-xl p-4 text-center glass-hover transition-all duration-300">
                  <div className="text-2xl font-bold text-gradient">10+</div>
                  <div className="text-sm text-muted-foreground">Technologies</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
