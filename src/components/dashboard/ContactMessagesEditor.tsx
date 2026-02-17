import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Trash2, Check, Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ContactMessage {
  id: string;
  name: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const ContactMessagesEditor = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: t.dashboard.error,
        description: t.dashboard.failedToLoadMessages,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, read: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read } : msg
      ));

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read });
      }

      toast({
        title: read ? t.dashboard.markedAsRead : t.dashboard.markedAsUnread,
        description: read ? t.dashboard.messageMarkedRead : t.dashboard.messageMarkedUnread,
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: t.dashboard.error,
        description: t.dashboard.failedToUpdateMessage,
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      
      if (selectedMessage?.id === id) {
        setIsDialogOpen(false);
        setSelectedMessage(null);
      }

      toast({
        title: t.dashboard.deleted,
        description: t.dashboard.messageDeleted,
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: t.dashboard.error,
        description: t.dashboard.failedToDeleteMessage,
        variant: 'destructive',
      });
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Mark as read when opened if not already read
    if (!message.read) {
      await markAsRead(message.id, true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t.dashboard.contactMessagesTitle}
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} {t.dashboard.unreadLabel}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.dashboard.noContactMessages}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    !message.read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                  }`}
                  onClick={() => openMessage(message)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                        <span className={`font-medium truncate ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {message.name}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${!message.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(message.id, !message.read)}
                        title={message.read ? t.dashboard.markAsUnread : t.dashboard.markAsRead}
                      >
                        {message.read ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.dashboard.deleteMessageTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t.dashboard.deleteMessageConfirm}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMessage(message.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t.common.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {selectedMessage.subject}
                </DialogTitle>
                <DialogDescription>
                  {t.dashboard.fromLabel} {selectedMessage.name} • {formatDate(selectedMessage.created_at)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap text-foreground">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                >
                  {selectedMessage.read ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      {t.dashboard.markAsUnread}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t.dashboard.markAsRead}
                    </>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.common.delete}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.dashboard.deleteMessageTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.dashboard.deleteMessageConfirm}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t.common.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactMessagesEditor;
