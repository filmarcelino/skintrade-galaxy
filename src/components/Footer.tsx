
import { useI18n } from '@/lib/i18n';

const Footer = () => {
  const { t } = useI18n();
  
  return (
    <footer className="py-8 px-6 border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-white/70">{t('copyright')}</p>
        </div>
        
        <div className="flex gap-6">
          <FooterLink href="/terms">{t('terms')}</FooterLink>
          <FooterLink href="/privacy">{t('privacy')}</FooterLink>
          <FooterLink href="/support">{t('support')}</FooterLink>
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
