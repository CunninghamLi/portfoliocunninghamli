import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.hobbies, href: '#hobbies' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.education, href: '#education' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (isHome && href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-neon-cyan/30 shadow-[0_0_20px_hsl(180_100%_50%/0.1)]'
          : 'bg-transparent'
      )}
    >
      {/* Scanlines effect */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center gap-1 group -ml-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border border-neon-cyan flex items-center justify-center"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              >
                <Gamepad2 className="w-4 h-4 text-neon-cyan" />
              </motion.div>
              <span className="font-game text-lg text-foreground group-hover:text-neon-cyan transition-colors">
                PORTFOLIO
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                href={isHome ? item.href : `/${item.href}`}
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className="text-sm font-body font-medium text-muted-foreground hover:text-neon-cyan transition-colors relative group uppercase tracking-wider"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(180_100%_50%)]" />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
            >
              <Link
                to="/resume"
                className="text-sm font-body font-medium text-muted-foreground hover:text-neon-pink transition-colors relative group uppercase tracking-wider"
              >
                {t.nav.resume}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-pink transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(320_100%_60%)]" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
            >
              <Link
                to="/testimonials"
                className="text-sm font-body font-medium text-muted-foreground hover:text-neon-purple transition-colors relative group uppercase tracking-wider"
              >
                {t.nav.testimonials}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-purple transition-all duration-300 group-hover:w-full shadow-[0_0_10px_hsl(280_100%_60%)]" />
              </Link>
            </motion.div>

            {isLoggedIn && isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to="/dashboard"
                  className="text-sm font-body font-medium text-neon-green hover:text-neon-green/80 transition-colors uppercase tracking-wider"
                >
                  {t.nav.dashboard}
                </Link>
              </motion.div>
            )}

            <LanguageToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="font-game uppercase tracking-wider border-neon-pink/50 hover:border-neon-pink hover:bg-neon-pink/20 text-neon-pink"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.nav.logout}
                </Button>
              ) : (
                <Link to="/login">
                  <Button 
                    size="sm"
                    className="font-game uppercase tracking-wider neon-border-cyan bg-transparent hover:bg-neon-cyan/20 text-neon-cyan"
                  >
                    {t.nav.login}
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 text-neon-cyan"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden game-card border-t border-neon-cyan/30"
            >
              <div className="flex flex-col gap-2 py-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    href={isHome ? item.href : `/${item.href}`}
                    onClick={(e) => {
                      if (isHome) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                    }}
                    className="px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors uppercase tracking-wider"
                  >
                    {'> '}{item.label}
                  </motion.a>
                ))}

                <Link
                  to="/resume"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-neon-pink hover:bg-neon-pink/10 transition-colors uppercase tracking-wider"
                >
                  {'> '}{t.nav.resume}
                </Link>

                <Link
                  to="/testimonials"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-neon-purple hover:bg-neon-purple/10 transition-colors uppercase tracking-wider"
                >
                  {'> '}{t.nav.testimonials}
                </Link>

                {isLoggedIn && isAdmin && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-body font-medium text-neon-green hover:bg-neon-green/10 transition-colors uppercase tracking-wider"
                  >
                    {'> '}{t.nav.dashboard}
                  </Link>
                )}

                <div className="px-4 pt-2">
                  {isLoggedIn ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={logout} 
                      className="w-full font-game uppercase tracking-wider border-neon-pink/50 hover:border-neon-pink hover:bg-neon-pink/20 text-neon-pink"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.nav.logout}
                    </Button>
                  ) : (
                    <Link to="/login" className="block">
                      <Button 
                        size="sm" 
                        className="w-full font-game uppercase tracking-wider neon-border-cyan bg-transparent hover:bg-neon-cyan/20 text-neon-cyan"
                      >
                        {t.nav.login}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
