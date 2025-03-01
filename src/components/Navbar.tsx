
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/App';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { title: t('inventory'), path: '/inventory', show: true },
    { title: t('marketplace'), path: '/marketplace', show: true },
    { title: t('login'), path: '/auth', show: !session }
  ].filter(link => link.show);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg h-8 w-8 mr-3 flex items-center justify-center">
                <span className="text-white font-bold">SC</span>
              </div>
              <span className="text-white font-bold text-xl">SkinCulator</span>
            </Link>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
              
              {/* Sign out button */}
              {session && (
                <Button
                  variant="ghost"
                  className="text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  {t('signOut')}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/5 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-black/80 backdrop-blur-xl border-b border-white/10`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          
          {/* Sign out button for mobile */}
          {session && (
            <button
              className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-white/70 hover:bg-white/5 hover:text-white"
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                {t('signOut')}
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
