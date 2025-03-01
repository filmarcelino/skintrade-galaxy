
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/marketplace' && location.pathname === '/marketplace') return true;
    if (path === '/inventory' && location.pathname === '/inventory') return true;
    return false;
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/favicon-32x32.png"
                alt="Logo"
                className="w-8 h-8 mr-2 animate-pulse"
              />
              <span className="text-white font-semibold text-xl tracking-tighter">Skinculator</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t('dashboard')}
              </Link>
              <Link
                to="/marketplace"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/marketplace') 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t('marketplace')}
              </Link>
              <Link
                to="/inventory"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/inventory') 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t('inventory')}
              </Link>
            </div>
          </div>
          
          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200 flex items-center gap-2"
            >
              {t('login')}
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-white/10 text-white' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t('dashboard')}
          </Link>
          <Link
            to="/marketplace"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/marketplace') 
                ? 'bg-white/10 text-white' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t('marketplace')}
          </Link>
          <Link
            to="/inventory"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/inventory') 
                ? 'bg-white/10 text-white' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {t('inventory')}
          </Link>
          <button
            className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            {t('login')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
