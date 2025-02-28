
import { useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';
import { PackageOpen, BarChart3, Clock, Zap, TrendingUp, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const MarketplaceContent = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um endereço de email válido.',
        variant: 'destructive',
      });
      return;
    }
    
    // Submit notification request
    toast({
      title: 'Obrigado pelo seu interesse!',
      description: 'Iremos notificá-lo quando o marketplace for lançado.',
      variant: 'default',
    });
    
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('marketplace')}</h1>
            <p className="text-white/60 text-lg">Encontre, compre e venda skins de CS2 em nossa comunidade marketplace</p>
          </div>
          
          {/* Hero Banner - Coming Soon */}
          <div className="glass-card p-0 rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-medium mb-4 animate-pulse">
                  <Clock size={14} />
                  <span>Em breve - Lançamento em 29 dias</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">O Marketplace que você estava esperando</h2>
                
                <p className="text-white/80 mb-6 text-lg">
                  Nossa marketplace revolucionará a forma como você compra, vende e troca skins de CS2.
                  Com recursos exclusivos como análise de preços com IA, transações instantâneas e muito mais.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Transações Instantâneas</h3>
                      <p className="text-white/60 text-sm">Sem tempo de espera para compras e vendas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={16} className="text-neon-green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Análise de Preços com IA</h3>
                      <p className="text-white/60 text-sm">Previsões precisas de tendências de mercado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
                      <Tag size={16} className="text-neon-yellow" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Taxas Reduzidas</h3>
                      <p className="text-white/60 text-sm">As menores taxas do mercado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                      <PackageOpen size={16} className="text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Inventário Integrado</h3>
                      <p className="text-white/60 text-sm">Venda diretamente do seu inventário</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <p className="text-white/70">Seja notificado quando lançarmos</p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Seu endereço de email"
                      className="bg-black/30 border-white/10 text-white placeholder:text-white/50 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      className="neon-button whitespace-nowrap rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80"
                    >
                      Notifique-me
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="md:w-2/5 bg-black/30 relative overflow-hidden min-h-[300px] md:min-h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-neon-purple/30 z-10"></div>
                
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full bg-neon-blue/20 filter blur-xl animate-pulse"></div>
                  <div className="absolute top-[60%] left-[60%] w-40 h-40 rounded-full bg-neon-purple/20 filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-[30%] left-[40%] w-24 h-24 rounded-full bg-neon-green/20 filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* 3D Floating CS2 Logo */}
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
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-neon-blue" />
                    <span className="text-white font-medium">Lançamento em: </span>
                    <span className="text-neon-green font-mono">29 dias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Insights */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Análise de Mercado</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <PackageOpen size={20} className="text-neon-blue" />
                  Volume de Mercado
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Volume 24h</span>
                    <span className="font-mono text-neon-blue">$3,456,789</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Volume 7d</span>
                    <span className="font-mono text-neon-yellow">$24,567,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Volume 30d</span>
                    <span className="font-mono text-neon-purple">$87,654,321</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-neon-green" />
                  Categorias Populares
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Facas</span>
                    <span className="font-mono text-neon-green">+12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">AWPs</span>
                    <span className="font-mono text-neon-blue">+8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Luvas</span>
                    <span className="font-mono text-neon-yellow">+6.2%</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-neon-purple" />
                  Em Breve
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-blue font-medium">Compra/Venda Instantânea</div>
                    <div className="text-sm text-white/70">Troque skins sem tempo de espera</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-green font-medium">Previsões de Preço com IA</div>
                    <div className="text-sm text-white/70">Obtenha insights sobre preços futuros</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-yellow font-medium">Negociação em Massa</div>
                    <div className="text-sm text-white/70">Compre e venda múltiplas skins de uma vez</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neon-blue">Quando o marketplace será lançado?</h3>
                <p className="text-white/70">Nosso marketplace será lançado em aproximadamente 29 dias. Estamos nos preparando para oferecer a melhor experiência possível.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neon-green">Como funcionarão as taxas?</h3>
                <p className="text-white/70">Teremos as menores taxas do mercado, com apenas 2% sobre cada transação concluída com sucesso.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neon-yellow">É seguro comprar e vender aqui?</h3>
                <p className="text-white/70">Sim, implementamos sistemas avançados de segurança e autenticação para garantir que todas as transações sejam 100% seguras.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neon-purple">Como funciona a análise de preços com IA?</h3>
                <p className="text-white/70">Nossa IA analisa milhões de dados históricos e tendências de mercado para fornecer previsões precisas sobre o valor futuro das skins.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Marketplace = () => {
  return (
    <I18nProvider>
      <MarketplaceContent />
    </I18nProvider>
  );
};

export default Marketplace;
