
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Package, Rocket, Star, Clock } from 'lucide-react';

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
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">{t('marketplaceTitle')}</h2>
          <div className="inline-block px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-medium mb-6 animate-pulse">
            {t('comingSoon')}
          </div>
          
          <p className="text-white/70 mb-8 text-lg">
            Nossa marketplace revolucionará a forma como você compra, vende e troca skins de CS2.
            Cadastre-se para ser o primeiro a saber quando lançarmos.
          </p>
          
          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                <Rocket size={16} className="text-neon-blue" />
              </div>
              <div>
                <h3 className="font-medium text-white">Lançamento em breve</h3>
                <p className="text-white/60 text-sm">Nossa previsão é lançar em menos de 30 dias</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-white">Mais de 10.000 itens</h3>
                <p className="text-white/60 text-sm">Nossa marketplace terá milhares de skins disponíveis</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
                <Star size={16} className="text-neon-yellow" />
              </div>
              <div>
                <h3 className="font-medium text-white">Recursos exclusivos</h3>
                <p className="text-white/60 text-sm">Análise de preços com IA, alertas de mercado e muito mais</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-white/70">{t('getNotified')}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                placeholder={t('emailPlaceholder')}
                className="bg-black/30 border-white/10 text-white placeholder:text-white/50 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit"
                className="neon-button whitespace-nowrap rounded-xl"
              >
                {t('notifyMe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="md:w-1/2 bg-black/20 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/20 z-10"></div>
          
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full bg-neon-blue/20 filter blur-xl animate-pulse"></div>
            <div className="absolute top-[60%] left-[60%] w-40 h-40 rounded-full bg-neon-purple/20 filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[30%] left-[40%] w-24 h-24 rounded-full bg-neon-green/20 filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* 3D Floating Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-20"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-40" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse opacity-80" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl">CS2</div>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-neon-blue" />
              <span className="text-white font-medium">Lançamento em: </span>
              <span className="text-neon-green font-mono">29 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
