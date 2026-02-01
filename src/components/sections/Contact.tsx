import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslation';
import { Mail, Phone, MapPin, Linkedin, Github, Loader2, Send, MessageSquare, CheckCircle } from 'lucide-react';
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
      
      // Reset and close after a short delay
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
              {/* Contact Me Dialog Trigger */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group w-full text-left">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.contact.email}</p>
                        <p className="font-medium text-primary hover:underline">
                          Want to contact me about anything? Click here
                        </p>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Get in Touch
                      </DialogTitle>
                      <DialogDescription>
                        Fill out the form below and I'll get back to you as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                          <p className="text-lg font-medium">Message sent successfully!</p>
                          <p className="text-muted-foreground">I'll get back to you soon.</p>
                        </div>
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
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
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

              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
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
