import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown, Gamepad2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Hero = () => {
  const { data } = usePortfolio();
  const { t, language } = useLanguage();
  const { aboutMe } = data;

  const displayTitle = useMemo(() => 
    language === 'fr' && aboutMe.title_fr ? aboutMe.title_fr : aboutMe.title,
    [aboutMe.title, aboutMe.title_fr, language]
  );

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden scanlines">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-game opacity-30" />
      
      {/* Hex pattern */}
      <div className="absolute inset-0 bg-hex-pattern opacity-20" />
      
      {/* Neon glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: 'hsl(180 100% 50% / 0.3)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full blur-[100px]"
          style={{ background: 'hsl(320 100% 60% / 0.3)' }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-50, 50, -50],
              x: [-30, 30, -30],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute border-2"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              borderColor: i % 2 === 0 ? 'hsl(180 100% 50% / 0.3)' : 'hsl(320 100% 60% / 0.3)',
              transform: i % 2 === 0 ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 py-20">
        {/* Level indicator badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 game-card rounded-sm text-sm font-game text-neon-cyan neon-flicker">
            <Gamepad2 className="w-4 h-4" />
            <span className="font-pixel text-[10px]">{t.hero.greeting}</span>
            <Zap className="w-4 h-4" />
          </span>
        </motion.div>

        {/* Main title with glitch effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-game font-bold leading-tight glitch"
            data-text={aboutMe.name}
          >
            <span className="text-neon-cyan">{aboutMe.name.split(' ')[0]}</span>
            <br />
            <motion.span
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-neon-pink"
            >
              {aboutMe.name.split(' ').slice(1).join(' ')}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle with typing effect feel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-body text-foreground/80 max-w-3xl mx-auto">
            {'> '}<span className="text-gradient-game font-semibold">{displayTitle}</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-neon-cyan ml-1"
            >
              _
            </motion.span>
          </p>
        </motion.div>

        {/* Power level display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="game-card p-4 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-[8px] text-neon-cyan">{t.common.skillLevel}</span>
              <span className="font-pixel text-[8px] text-neon-pink">{t.common.max}</span>
            </div>
            <div className="power-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.8 }}
                className="power-bar-fill"
              />
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              onClick={scrollToAbout} 
              className="group px-8 py-6 text-lg font-game uppercase tracking-wider neon-border-cyan bg-transparent hover:bg-neon-cyan/20 text-neon-cyan animate-pulse-neon"
            >
              <span className="font-pixel text-xs">{t.hero.viewWork}</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowDown className="ml-3 w-5 h-5" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Bottom HUD elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8"
        >
          <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-foreground">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            {t.hero.online}
          </div>
          <div className="font-pixel text-[8px] text-muted-foreground">
            {t.hero.scrollToExplore}
          </div>
          <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-foreground">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            {t.hero.ready}
          </div>
        </motion.div>
      </div>

      {/* Corner HUD decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-neon-cyan/50" />
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-neon-cyan/50" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-neon-pink/50" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-neon-pink/50" />
    </section>
  );
};

export default Hero;
