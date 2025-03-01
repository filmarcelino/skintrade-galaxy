
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CreditDisplay from '@/components/CreditDisplay';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  ShoppingCart, 
  PackageOpen, 
  BarChart3, 
  Settings,
  LogIn
} from 'lucide-react';

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
        isActive(to) 
          ? 'bg-white/10 text-white font-medium' 
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-70"></div>
              <span className="relative text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Skinculator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" icon={Home} label={t('dashboard')} />
            <NavLink to="/inventory" icon={PackageOpen} label={t('inventory')} />
            <NavLink to="/marketplace" icon={ShoppingCart} label={t('marketplace')} />
            <NavLink to="/analytics" icon={BarChart3} label={t('analytics')} />
            <NavLink to="/settings" icon={Settings} label={t('settings')} />
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center gap-3">
            <CreditDisplay />
            <LanguageSwitcher />
            
            <Button 
              variant="default" 
              size="sm"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <LogIn size={16} />
              <span>{t('login')}</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-lg ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/70'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('dashboard')}
            </Link>
            <Link 
              to="/inventory" 
              className={`block py-2 px-3 rounded-lg ${isActive('/inventory') ? 'bg-white/10 text-white' : 'text-white/70'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('inventory')}
            </Link>
            <Link 
              to="/marketplace" 
              className={`block py-2 px-3 rounded-lg ${isActive('/marketplace') ? 'bg-white/10 text-white' : 'text-white/70'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('marketplace')}
            </Link>
            <Link 
              to="/analytics" 
              className={`block py-2 px-3 rounded-lg ${isActive('/analytics') ? 'bg-white/10 text-white' : 'text-white/70'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('analytics')}
            </Link>
            <Link 
              to="/settings" 
              className={`block py-2 px-3 rounded-lg ${isActive('/settings') ? 'bg-white/10 text-white' : 'text-white/70'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('settings')}
            </Link>
            
            <Button 
              variant="default" 
              size="sm"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn size={16} />
              <span>{t('login')}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
