
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, Steam, X } from 'lucide-react';

const Navbar = () => {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-neon-glow animate-pulse rounded-full opacity-50"></div>
              <span className="relative text-white font-bold text-2xl">S</span>
            </div>
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-gradient-flow">
              Skinculator
            </span>
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink href="/">{t('dashboard')}</NavLink>
          <NavLink href="/marketplace">{t('marketplace')}</NavLink>
          <NavLink href="/inventory">{t('inventory')}</NavLink>
          <NavLink href="/analytics">{t('analytics')}</NavLink>
          <NavLink href="/settings">{t('settings')}</NavLink>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <Steam size={16} />
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
          <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>{t('dashboard')}</MobileNavLink>
          <MobileNavLink href="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>{t('marketplace')}</MobileNavLink>
          <MobileNavLink href="/inventory" onClick={() => setIsMobileMenuOpen(false)}>{t('inventory')}</MobileNavLink>
          <MobileNavLink href="/analytics" onClick={() => setIsMobileMenuOpen(false)}>{t('analytics')}</MobileNavLink>
          <MobileNavLink href="/settings" onClick={() => setIsMobileMenuOpen(false)}>{t('settings')}</MobileNavLink>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Steam size={16} />
              {t('login')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      className="px-4 py-2 rounded-md text-white/80 transition-colors duration-200 hover:text-white hover:bg-white/5"
    >
      {children}
    </a>
  );
};

const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => {
  return (
    <a 
      href={href} 
      className="py-3 px-2 text-lg border-b border-white/10 text-white/80 hover:text-white flex items-center justify-between"
      onClick={onClick}
    >
      {children}
      <ChevronDown size={20} className="text-white/60" />
    </a>
  );
};

export default Navbar;
