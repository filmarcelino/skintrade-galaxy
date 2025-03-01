
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Auth = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back to Skinculator!",
        });
        
        navigate('/inventory');
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email: email,
            },
          },
        });

        if (error) throw error;
        
        toast({
          title: "Registration successful",
          description: "Welcome to Skinculator! You can now login.",
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-8 glass-card rounded-xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{isLogin ? t('login') : t('signup')}</h1>
              <p className="mt-2 text-white/60">
                {isLogin 
                  ? t('loginDescription') || "Sign in to your Skinculator account to manage your inventory"
                  : t('signupDescription') || "Create a new Skinculator account to start tracking your skins"}
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/20 border-white/10"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  {t('password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/20 border-white/10"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : isLogin ? t('login') : t('signup')}
              </Button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-neon-blue hover:underline text-sm"
                >
                  {isLogin 
                    ? t('needAccount') || "Need an account? Sign up" 
                    : t('haveAccount') || "Already have an account? Log in"}
                </button>
              </div>
            </form>
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Auth;
