import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const { data } = usePortfolio();
  const { aboutMe } = data;

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background pt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4"
        >
          Hi, I'm{' '}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-primary inline-block"
          >
            {aboutMe.name.split(' ')[0]}
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8"
        >
          {aboutMe.title}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" onClick={scrollToAbout} className="group">
              Explore My Work
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="ml-2 w-4 h-4" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                y: [-20, 20, -20],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
