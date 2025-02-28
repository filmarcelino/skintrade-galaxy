
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, LogIn, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogin = () => {
    toast({
      title: "Logged In Successfully",
      description: "Welcome back to Skinculator!",
      variant: "default",
    });
    setIsLoginDialogOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-neon-glow animate-pulse rounded-full opacity-50"></div>
              <span className="relative text-white font-bold text-2xl">S</span>
            </div>
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-gradient-flow">
              Skinculator
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" active={location.pathname === '/'}>{t('dashboard')}</NavLink>
          <NavLink to="/marketplace" active={location.pathname === '/marketplace'}>{t('marketplace')}</NavLink>
          <NavLink to="/inventory" active={location.pathname === '/inventory'}>{t('inventory')}</NavLink>
          <NavLink to="/analytics" active={location.pathname === '/analytics'}>{t('analytics')}</NavLink>
          <NavLink to="/settings" active={location.pathname === '/settings'}>{t('settings')}</NavLink>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            onClick={() => setIsLoginDialogOpen(true)}
          >
            <User size={16} />
            Login
          </Button>
          
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <LogIn size={16} />
            {t('login')}
          </Button>
          
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 pt-20 px-6 bg-black/95 backdrop-blur-lg transition-transform duration-300 ease-in-out z-40 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col gap-4 p-4">
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('dashboard')}</MobileNavLink>
          <MobileNavLink to="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>{t('marketplace')}</MobileNavLink>
          <MobileNavLink to="/inventory" onClick={() => setIsMobileMenuOpen(false)}>{t('inventory')}</MobileNavLink>
          <MobileNavLink to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>{t('analytics')}</MobileNavLink>
          <MobileNavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)}>{t('settings')}</MobileNavLink>
          
          <div className="mt-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
              onClick={() => {
                setIsLoginDialogOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <User size={16} />
              Login
            </Button>
            
            <Button 
              variant="outline"

              className="w-full flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <LogIn size={16} />
              {t('login')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Login to Skinculator</DialogTitle>
            <DialogDescription className="text-white/70">
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Email</label>
              <Input 
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="bg-black/20 border-white/10"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 block mb-2">Password</label>
              <Input 
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black/20 border-white/10"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-black/20 border-white/20" />
                <span className="text-sm text-white/70">Remember me</span>
              </label>
              
              <button className="text-sm text-neon-blue hover:underline">
                Forgot password?
              </button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsLoginDialogOpen(false)}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button 
              className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30"
              onClick={handleLogin}
            >
              Login
            </Button>
          </DialogFooter>
          
          <div className="text-center mt-4 text-sm text-white/70">
            Don't have an account?{" "}
            <button className="text-neon-blue hover:underline">
              Sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

const NavLink = ({ to, children, active = false }: { to: string; children: React.ReactNode; active?: boolean }) => {
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
        active 
          ? 'text-white bg-white/10' 
          : 'text-white/80 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) => {
  return (
    <Link 
      to={to} 
      className="py-3 px-2 text-lg border-b border-white/10 text-white/80 hover:text-white flex items-center justify-between"
      onClick={onClick}
    >
      {children}
      <ChevronDown size={20} className="text-white/60" />
    </Link>
  );
};

export default Navbar;
