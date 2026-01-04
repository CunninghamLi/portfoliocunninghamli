import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { Mail, Phone, MapPin, Linkedin, Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Contact = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { contact } = data;

  const { text: translatedLocation, isTranslating } = useTranslatedText(contact.location);

  const contactItems = [
    {
      icon: Mail,
      label: t.contact.email,
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      label: t.contact.phone,
      value: contact.phone,
    },
    {
      icon: MapPin,
      label: t.contact.location,
      value: translatedLocation,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground flex items-center justify-center gap-2"
        >
          {t.sections.contact}
          {isTranslating && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex gap-4 pt-4"
              >
                {contact.linkedin && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
                {contact.github && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;