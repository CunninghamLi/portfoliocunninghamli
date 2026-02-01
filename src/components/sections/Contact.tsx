import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { Mail, Phone, MapPin, Linkedin, Github, Loader2, Send, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
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
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
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
    <section id="contact" className="py-32 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl bg-gradient-to-t from-glow-primary/20 to-transparent"
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
          <span className="text-sm font-medium text-glow-primary mb-4 block flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> LET'S CONNECT
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
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
          <div className="glass rounded-2xl p-8 md:p-12 glass-hover transition-all duration-300 relative">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-glow-primary to-transparent" />
            </div>

            <div className="space-y-8">
              {/* Contact Me Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-5 w-full text-left p-5 rounded-xl bg-gradient-to-r from-glow-primary/10 to-glow-secondary/10 border border-glow-primary/20 hover:border-glow-primary/40 transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-glow-primary to-glow-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t.contact.email}</p>
                        <p className="font-semibold text-foreground text-lg">
                          Want to contact me about anything? Click here
                        </p>
                      </div>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass border-glow-primary/20">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Mail className="w-5 h-5 text-glow-primary" />
                        Get in Touch
                      </DialogTitle>
                      <DialogDescription>
                        Fill out the form below and I'll get back to you as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      {isSubmitted ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center justify-center py-8 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                          </div>
                          <p className="text-lg font-medium">Message sent successfully!</p>
                          <p className="text-muted-foreground">I'll get back to you soon.</p>
                        </motion.div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                              id="contact-name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                              disabled={isSubmitting}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-subject">Subject</Label>
                            <Input
                              id="contact-subject"
                              placeholder="What's this about?"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              required
                              disabled={isSubmitting}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-message">Message</Label>
                            <Textarea
                              id="contact-message"
                              placeholder="Your message..."
                              rows={4}
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              required
                              disabled={isSubmitting}
                              className="bg-background/50"
                            />
                          </div>
                          <Button type="submit" className="w-full glow-primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </form>
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* Contact info items */}
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center gap-5 p-4 rounded-xl hover:bg-secondary/30 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-foreground text-lg">{item.value}</p>
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
                    <Button variant="outline" size="lg" asChild className="hover:border-glow-primary/50 hover:text-glow-primary">
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
                    <Button variant="outline" size="lg" asChild className="hover:border-glow-secondary/50 hover:text-glow-secondary">
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
