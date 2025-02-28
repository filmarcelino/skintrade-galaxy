
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ComingSoon = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    
    // Submit notification request
    toast({
      title: 'Thanks for your interest!',
      description: 'We will notify you when the marketplace launches.',
      variant: 'default',
    });
    
    setEmail('');
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">{t('marketplaceTitle')}</h2>
          <div className="inline-block px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-medium mb-6 animate-pulse">
            {t('comingSoon')}
          </div>
          
          <p className="text-white/70 mb-8 text-lg">
            Our marketplace will revolutionize how you buy, sell, and trade CS2 skins.
            Sign up to be the first to know when we launch.
          </p>
          
          <div className="space-y-3">
            <p className="text-white/70">{t('getNotified')}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                placeholder={t('emailPlaceholder')}
                className="bg-black/30 border-white/10 text-white placeholder:text-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit"
                className="neon-button whitespace-nowrap"
              >
                {t('notifyMe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="md:w-1/2 bg-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/20 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-20"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-40"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-60"></div>
              <div className="absolute inset-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl">CS2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
