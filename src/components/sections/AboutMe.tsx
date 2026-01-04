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
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          {t.sections.aboutMe}
        </motion.h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
          >
            {aboutMe.image ? (
              <img
                src={aboutMe.image}
                alt={aboutMe.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-primary" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">{aboutMe.name}</h3>
            <p className="text-lg text-primary mb-4 flex items-center justify-center md:justify-start gap-2">
              {translatedTitle}
              {isTranslating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </p>
            <p className="text-muted-foreground leading-relaxed">{translatedBio}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;