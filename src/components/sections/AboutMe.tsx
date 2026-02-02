import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { User, Loader2, Target, Trophy } from 'lucide-react';
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
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-game opacity-10" />
      <div className="absolute inset-0 bg-gradient-mesh" />

      {/* Decorative lines */}
      <motion.div
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-cyan mb-4 block tracking-wider">
            {'// ' + t.sections.playerProfile}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-cyan neon-flicker">
            {t.sections.aboutMe}
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Avatar section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Scanning effect */}
                <motion.div
                  animate={{ y: [-100, 200, -100] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 z-20"
                />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 hud-frame overflow-hidden bg-card"
                >
                  {aboutMe.image ? (
                    <img
                      src={aboutMe.image}
                      alt={aboutMe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                      <User className="w-32 h-32 text-neon-cyan/50" />
                    </div>
                  )}
                  
                  {/* Overlay scanlines */}
                  <div className="absolute inset-0 scanlines pointer-events-none" />
                </motion.div>

                {/* Status indicators */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 px-3 py-1 bg-neon-green/20 border border-neon-green font-pixel text-[8px] text-neon-green"
                >
                  ACTIVE
                </motion.div>
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
                <h3 className="text-3xl md:text-4xl font-game font-bold text-foreground">
                  {aboutMe.name}
                </h3>
                <p className="text-xl text-gradient-game font-semibold flex items-center gap-2 font-body">
                  {'> '}{translatedTitle}
                  {isTranslating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </p>
              </div>

              {/* Decorative line */}
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-16 bg-gradient-to-r from-neon-cyan to-transparent" />
                <Target className="w-4 h-4 text-neon-cyan" />
                <div className="h-[2px] flex-1 bg-gradient-to-r from-neon-pink/50 to-transparent" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed font-body">
                {translatedBio}
              </p>

              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="game-card p-4 text-center"
                >
                  <Trophy className="w-6 h-6 text-neon-yellow mx-auto mb-2" />
                  <div className="text-2xl font-game font-bold text-neon-cyan">2+</div>
                  <div className="font-pixel text-[8px] text-muted-foreground">{t.common.projectsLabel}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="game-card p-4 text-center"
                >
                  <Target className="w-6 h-6 text-neon-pink mx-auto mb-2" />
                  <div className="text-2xl font-game font-bold text-neon-pink">10+</div>
                  <div className="font-pixel text-[8px] text-muted-foreground">{t.common.technologiesLabel}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
