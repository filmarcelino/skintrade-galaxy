
import { useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { t } = useI18n();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: isSignIn ? "Signed In" : "Account Created",
        description: isSignIn 
          ? "You have successfully signed in" 
          : "Your account has been created successfully",
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSteamLogin = () => {
    toast({
      title: "Steam Login",
      description: "Redirecting to Steam authentication...",
    });
  };
  
  return (
    <I18nProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-radial px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-70"></div>
                <span className="relative text-white font-bold text-2xl">S</span>
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Skinculator
              </span>
            </Link>
          </div>
          
          <div className="glass-card relative overflow-hidden border border-white/10 bg-black/40 rounded-2xl backdrop-blur-xl p-8">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <h1 className="text-2xl font-bold mb-6 text-center">
              {isSignIn ? t('signIn') : t('signUp')}
            </h1>
            
            {/* Steam Login Button */}
            <Button
              className="w-full mb-6 bg-[#1E5279] hover:bg-[#173F5F] text-white flex items-center gap-2 justify-center"
              onClick={handleSteamLogin}
            >
              <Github size={18} />
              <span>{t('login')}</span>
            </Button>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-white/60">
                  {isSignIn ? 'or sign in with email' : 'or sign up with email'}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-white/10 pl-10 focus-visible:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/30 border-white/10 pl-10 focus-visible:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                
                {isSignIn && (
                  <div className="text-right">
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                      {t('forgotPassword')}
                    </a>
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={16} className="mr-2" />
                      {isSignIn ? t('signIn') : t('signUp')}
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              {isSignIn ? (
                <p className="text-white/60">
                  {t('dontHaveAccount')}{' '}
                  <button
                    onClick={() => setIsSignIn(false)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {t('signUp')}
                  </button>
                </p>
              ) : (
                <p className="text-white/60">
                  {t('alreadyHaveAccount')}{' '}
                  <button
                    onClick={() => setIsSignIn(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {t('signIn')}
                  </button>
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
};

export default Auth;
