import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { Mail, MapPin, Linkedin, Github, Loader2, Send, MessageSquare, CheckCircle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const { data } = usePortfolio();
  const { t } = useLanguage();
  const { contact } = data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: '',
  });
  const wordLimits = {
    name: 6,
    subject: 12,
    message: 120,
  };

  const countWords = (value: string) =>
    value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;

  const clampWords = (value: string, limit: number) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) return value;
    return words.slice(0, limit).join(' ');
  };

  const updateField = (field: keyof typeof formData, value: string, limit: number) => {
    const nextValue = clampWords(value, limit);
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
  };

  const { text: translatedLocation, isTranslating } = useTranslatedText(contact.location);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      setFormData({ name: '', subject: '', message: '' });
      
      toast({
        title: t.contact.messageSent,
        description: t.contact.thankYou,
      });
      
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t.contact.errorSending,
        description: t.contact.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: t.contact.location,
      value: translatedLocation,
    },
  ];

  return (
    <section id="contact" className="py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-game opacity-10" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl bg-gradient-to-t from-neon-green/20 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-pixel text-[10px] text-neon-green mb-4 block tracking-wider flex items-center justify-center gap-2">
            <Wifi className="w-3 h-3" /> {t.footer.openChannel} <Wifi className="w-3 h-3" />
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-game font-bold text-neon-green flex items-center justify-center gap-3">
            {t.sections.contact}
            {isTranslating && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="game-card p-8 md:p-12 relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-neon-green to-transparent" />

            <div className="space-y-8">
              {/* Contact Me Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-5 w-full text-left p-5 border-2 border-neon-green/50 bg-neon-green/10 hover:bg-neon-green/20 hover:border-neon-green transition-all duration-300 group"
                    >
                      <motion.div 
                        animate={{ boxShadow: ['0 0 10px hsl(120 100% 50%)', '0 0 30px hsl(120 100% 50%)', '0 0 10px hsl(120 100% 50%)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-14 h-14 bg-neon-green/20 border border-neon-green flex items-center justify-center shrink-0 group-hover:bg-neon-green/30"
                      >
                        <MessageSquare className="w-6 h-6 text-neon-green" />
                      </motion.div>
                      <div>
                        <p className="font-pixel text-[8px] text-neon-green mb-1">{t.contact.email}</p>
                        <p className="font-game font-semibold text-foreground text-lg">
                          {t.contact.initiateContact}
                        </p>
                      </div>
                    </motion.button>
                  </DialogTrigger>
                </motion.div>
                <DialogContent className="sm:max-w-md game-card border-neon-green/30">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl font-game text-neon-green">
                        <Mail className="w-5 h-5" />
                        {t.contact.sendMessageTitle}
                      </DialogTitle>
                      <DialogDescription className="font-body">
                        {t.contact.formDescription}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      {isSubmitted ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center justify-center py-8 text-center"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 border-2 border-neon-green bg-neon-green/20 flex items-center justify-center mb-4"
                          >
                            <CheckCircle className="w-10 h-10 text-neon-green" />
                          </motion.div>
                          <p className="text-lg font-game text-neon-green">{t.contact.transmissionComplete}</p>
                          <p className="text-muted-foreground font-body">{t.contact.willReply}</p>
                        </motion.div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="contact-name" className="font-pixel text-[10px] text-neon-cyan">{t.contact.nameLabel}</Label>
                            <Input
                              id="contact-name"
                              placeholder={t.contact.yourName}
                              value={formData.name}
                              onChange={(e) => updateField('name', e.target.value, wordLimits.name)}
                              required
                              disabled={isSubmitting}
                              aria-describedby="contact-name-limit"
                              className="bg-muted/30 border-neon-cyan/30 focus:border-neon-cyan font-body"
                            />
                            <p id="contact-name-limit" className="text-xs text-muted-foreground font-body">
                              {countWords(formData.name)}/{wordLimits.name} words
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-subject" className="font-pixel text-[10px] text-neon-cyan">{t.contact.subjectLabel}</Label>
                            <Input
                              id="contact-subject"
                              placeholder={t.contact.whatsThisAbout}
                              value={formData.subject}
                              onChange={(e) => updateField('subject', e.target.value, wordLimits.subject)}
                              required
                              disabled={isSubmitting}
                              aria-describedby="contact-subject-limit"
                              className="bg-muted/30 border-neon-cyan/30 focus:border-neon-cyan font-body"
                            />
                            <p id="contact-subject-limit" className="text-xs text-muted-foreground font-body">
                              {countWords(formData.subject)}/{wordLimits.subject} words
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-message" className="font-pixel text-[10px] text-neon-cyan">{t.contact.messageLabel}</Label>
                            <Textarea
                              id="contact-message"
                              placeholder={t.contact.yourMessage}
                              rows={4}
                              value={formData.message}
                              onChange={(e) => updateField('message', e.target.value, wordLimits.message)}
                              required
                              disabled={isSubmitting}
                              aria-describedby="contact-message-limit"
                              className="bg-muted/30 border-neon-cyan/30 focus:border-neon-cyan font-body"
                            />
                            <p id="contact-message-limit" className="text-xs text-muted-foreground font-body">
                              {countWords(formData.message)}/{wordLimits.message} words
                            </p>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full font-game uppercase tracking-wider neon-border-cyan bg-transparent hover:bg-neon-cyan/20 text-neon-cyan" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t.contact.transmitting}
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                {t.contact.sendTransmission}
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </form>
                  </DialogContent>
              </Dialog>

              {/* Contact info items */}
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center gap-5 p-4 border border-transparent hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-colors">
                    <div className="w-14 h-14 border border-muted-foreground/30 bg-muted/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="font-pixel text-[8px] text-muted-foreground">{item.label}</p>
                      <p className="font-body font-semibold text-foreground text-lg">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex gap-4 pt-4 justify-center"
              >
                {contact.linkedin && (
                  <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild 
                      className="font-game uppercase tracking-wider border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan/20 text-neon-cyan"
                    >
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </motion.div>
                )}
                {contact.github && (
                  <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild 
                      className="font-game uppercase tracking-wider border-neon-pink/50 hover:border-neon-pink hover:bg-neon-pink/20 text-neon-pink"
                    >
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
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
