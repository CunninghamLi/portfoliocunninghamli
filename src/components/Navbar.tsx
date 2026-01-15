import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
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
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="text-xl font-bold text-foreground">
              Portfolio
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
            >
              <Link
                to="/resume"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {t.nav.resume}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
            >
              <Link
                to="/testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {t.nav.testimonials}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
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
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t.nav.dashboard}
                </Link>
              </motion.div>
            )}

            <LanguageToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isLoggedIn ? (
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.nav.logout}
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm">
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
              className="p-2"
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
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 pb-4">
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
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}

                <Link
                  to="/resume"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {t.nav.resume}
                </Link>

                <Link
                  to="/testimonials"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {t.nav.testimonials}
                </Link>

                {isLoggedIn && isAdmin && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {t.nav.dashboard}
                  </Link>
                )}

                {isLoggedIn ? (
                  <Button variant="outline" size="sm" onClick={logout} className="mx-4">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.nav.logout}
                  </Button>
                ) : (
                  <Link to="/login" className="px-4">
                    <Button variant="default" size="sm" className="w-full">
                      {t.nav.login}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
