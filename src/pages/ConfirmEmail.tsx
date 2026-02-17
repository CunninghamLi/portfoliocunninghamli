import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ConfirmEmail = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Sign out the user since they just confirmed email
    // They need to log in fresh with their credentials
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
            <CardDescription>Your email has been successfully verified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can now log in with your email and password.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmEmail;
