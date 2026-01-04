import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      className="flex items-center gap-1 bg-secondary/50 rounded-full p-0.5"
      whileHover={{ scale: 1.05 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${
          language === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('fr')}
        className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all ${
          language === 'fr'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        FR
      </Button>
    </motion.div>
  );
};

export default LanguageToggle;