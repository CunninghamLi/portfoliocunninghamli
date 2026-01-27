import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  content: string;
  status: string;
  created_at: string;
  username: string;
}

const Testimonials = () => {
  const { isLoggedIn, user } = useAuth();
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);

  const fetchTestimonials = async () => {
    try {
      // Fetch approved testimonials with profile info
      const { data: approved, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          content,
          status,
          created_at,
          user_id
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch usernames for testimonials
      if (approved && approved.length > 0) {
        const userIds = [...new Set(approved.map(t => t.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('user_id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p.username]) || []);
        
        const mappedTestimonials = approved.map(t => ({
          ...t,
          username: profileMap.get(t.user_id) || 'Anonymous',
        }));
        
        setTestimonials(mappedTestimonials);
      } else {
        setTestimonials([]);
      }

      // If logged in, fetch user's own testimonials (pending/rejected)
      if (user) {
        const { data: userTestimonialsData } = await supabase
          .from('testimonials')
          .select('id, content, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (userTestimonialsData) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', user.id)
            .maybeSingle();

          setUserTestimonials(
            userTestimonialsData.map(t => ({
              ...t,
              username: userProfile?.username || 'You',
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTestimonial.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          content: newTestimonial.trim(),
        });

      if (error) throw error;

      toast({
        title: t.testimonials.submitted,
        description: t.testimonials.submittedDesc,
      });
      setNewTestimonial('');
      fetchTestimonials();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit testimonial',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-600',
      approved: 'bg-green-500/20 text-green-600',
      rejected: 'bg-red-500/20 text-red-600',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.testimonials.title}</h1>
          <p className="text-muted-foreground mb-8">{t.testimonials.subtitle}</p>

          {/* Submit Form for logged-in users */}
          {isLoggedIn ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">{t.testimonials.writeTestimonial}</CardTitle>
                <CardDescription>{t.testimonials.writeDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    value={newTestimonial}
                    onChange={(e) => setNewTestimonial(e.target.value)}
                    placeholder={t.testimonials.placeholder}
                    rows={4}
                    required
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {newTestimonial.length}/500
                    </span>
                    <Button type="submit" disabled={submitting || !newTestimonial.trim()}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.common.saving}
                        </>
                      ) : (
                        t.testimonials.submit
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="py-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">{t.testimonials.loginToSubmit}</p>
                <Button asChild>
                  <Link to="/login">{t.nav.login}</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User's own testimonials */}
          {isLoggedIn && userTestimonials.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">{t.testimonials.yourTestimonials}</h2>
              <div className="space-y-4">
                {userTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-l-4 border-l-primary/50">
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </span>
                        {getStatusBadge(testimonial.status)}
                      </div>
                      <p className="text-foreground">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Public Testimonials */}
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t.testimonials.publicTestimonials}</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : testimonials.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.testimonials.noTestimonials}</p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              <div className="grid gap-4 md:grid-cols-2">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="py-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{testimonial.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(testimonial.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-foreground">{testimonial.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
