
import { useEffect, useState } from 'react';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CreditDisplay from '@/components/CreditDisplay';
import SkinTable from '@/components/SkinTable';
import TradeEvaluator from '@/components/TradeEvaluator';
import ComingSoon from '@/components/ComingSoon';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Zap, Package, Rocket, BarChart3 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  
  useEffect(() => {
    // Add page load animation
    document.body.classList.add('animate-fade-in');
    
    // Clean up
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Actions Bar */}
            <div className="glass-card rounded-xl p-3 flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-3 px-2">
                <span className="text-neon-purple font-semibold whitespace-nowrap">Ações Rápidas:</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <Button 
                  className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("market")}
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Comprar Skins</span>
                </Button>
                <Button 
                  className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("inventory")}
                >
                  <Package size={16} />
                  <span className="hidden sm:inline">Vender Skins</span>
                </Button>
                <Button 
                  className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("trades")}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Criar Troca</span>
                </Button>
                <Button 
                  className="bg-neon-purple/20 hover:bg-neon-purple/40 text-white border border-neon-purple/30 rounded-xl flex items-center gap-2"
                  size="sm"
                >
                  <Zap size={16} />
                  <span className="hidden sm:inline">Análise IA</span>
                </Button>
              </div>
            </div>
            
            {/* Credit Display */}
            <CreditDisplay />
            
            {/* Main Content Tabs */}
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <TabsTrigger 
                  value="inventory" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3 flex items-center gap-2 justify-center"
                >
                  <Package size={16} />
                  Inventário
                </TabsTrigger>
                <TabsTrigger 
                  value="market" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3 flex items-center gap-2 justify-center"
                >
                  <ShoppingCart size={16} />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger 
                  value="trades" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3 flex items-center gap-2 justify-center"
                >
                  <Rocket size={16} />
                  Trocas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="animate-fade-in">
                <div className="glass-card rounded-xl overflow-hidden">
                  <SkinTable />
                </div>
              </TabsContent>
              
              <TabsContent value="market" className="animate-fade-in">
                <ComingSoon />
              </TabsContent>
              
              <TabsContent value="trades" className="animate-fade-in">
                <div className="grid grid-cols-1 gap-6">
                  <TradeEvaluator />
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Stats and Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-neon-green" />
                  Estatísticas de Mercado
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Volume do Mercado</span>
                    <span className="font-mono text-neon-green">$1,245,678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Trocas Ativas</span>
                    <span className="font-mono text-neon-blue">24,567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Categoria em Alta</span>
                    <span className="font-mono text-neon-yellow">Facas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Seu Portfólio</span>
                    <span className="font-mono text-neon-purple">$4,320</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-neon-blue" />
                  Insights de Negociação
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Melhor Negócio Hoje</span>
                    <span className="font-mono text-neon-green">+42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Pior Negócio Hoje</span>
                    <span className="font-mono text-neon-red">-18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Sua Taxa de Sucesso</span>
                    <span className="font-mono text-neon-blue">76%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Volume de Trocas</span>
                    <span className="font-mono text-neon-purple">$2,145</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Rocket size={20} className="text-neon-yellow" />
                  Próximos Eventos
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-blue font-medium">Torneio Principal CS2</div>
                    <div className="text-sm text-white/70">Previsão de aumento: +15-20%</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-green font-medium">Lançamento de Nova Caixa</div>
                    <div className="text-sm text-white/70">Esperado em 12 dias</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-yellow font-medium">Promoção Relâmpago</div>
                    <div className="text-sm text-white/70">Começa em 3 dias</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Index;
