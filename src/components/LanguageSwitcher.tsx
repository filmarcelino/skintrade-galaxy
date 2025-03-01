
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/languages';
import { LanguageCode } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-full bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Globe size={16} className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-black/80 backdrop-blur-xl border border-white/10 text-white animate-fade-in"
      >
        {LANGUAGES.map((lang) => {
          // Only show languages that exist in our constants/translations
          if (['en', 'es', 'pt-br'].includes(lang.code)) {
            const code = lang.code === 'pt' ? 'pt-br' : lang.code;
            return (
              <DropdownMenuItem
                key={lang.code}
                className={`cursor-pointer hover:bg-white/10 ${language === code ? 'bg-white/5 font-medium' : ''}`}
                onClick={() => handleLanguageChange(code as LanguageCode)}
              >
                {lang.name}
              </DropdownMenuItem>
            );
          }
          return null;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
