
import { useI18n } from '@/lib/i18n';

const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 px-6 border-t border-white/5 mt-10 bg-black/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full opacity-50"></div>
              <span className="relative text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green">
              Skinculator
            </span>
          </div>
          <p className="text-white/70">© {currentYear} Skinculator. {t('allRightsReserved') || 'Todos os direitos reservados'}</p>
        </div>
        
        <div className="flex gap-6 flex-wrap justify-center">
          <FooterLink href="/terms">{t('terms') || 'Termos de Uso'}</FooterLink>
          <FooterLink href="/privacy">{t('privacy') || 'Privacidade'}</FooterLink>
          <FooterLink href="/support">{t('support') || 'Suporte'}</FooterLink>
          <FooterLink href="/about">{t('about') || 'Sobre'}</FooterLink>
          <FooterLink href="/blog">{t('blog') || 'Blog'}</FooterLink>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      className="text-white/70 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
};

export default Footer;
