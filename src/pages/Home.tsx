
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';

// Componentes
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

const Home = () => {
  const { t } = useI18n();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animação de entrada
    setIsLoaded(true);
  }, []);

  // Calcular estatísticas 
  const totalItems = SAMPLE_SKINS.length;
  const totalValue = SAMPLE_SKINS.reduce((total, skin) => total + skin.currentPrice, 0);
  const bestPerformer = [...SAMPLE_SKINS].sort((a, b) => b.profitLoss - a.profitLoss)[0];

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f1117] to-[#1a1f2c]">
        <Navbar />
        
        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className={`px-6 py-16 md:py-24 max-w-7xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green animate-gradient-flow">
                  {t('heroTitle') || 'Skinculator'}
                </h1>
                <p className="text-lg md:text-xl text-white/80">
                  {t('heroSubtitle') || 'A plataforma definitiva para gerenciar, analisar e maximizar o valor da sua coleção de skins de CS2'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/inventory">
                    <Button className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl px-6 py-6 w-full sm:w-auto">
                      <Package className="mr-2" size={20} />
                      {t('inventory') || 'Inventário'}
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button className="bg-neon-purple/20 hover:bg-neon-purple/40 text-white border border-neon-purple/30 rounded-xl px-6 py-6 w-full sm:w-auto">
                      <ShoppingCart className="mr-2" size={20} />
                      {t('marketplace') || 'Mercado'}
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-neon-blue/10 blur-3xl rounded-full"></div>
                <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-purple/20"></div>
                  <div className="p-8 relative">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <BarChart3 size={20} className="text-neon-green mr-2" />
                      {t('portfolioSnapshot') || 'Resumo do Portfólio'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">{t('totalItems') || 'Total de Itens'}:</span>
                        <span className="font-mono text-neon-blue">{totalItems}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">{t('portfolioValue') || 'Valor Total'}:</span>
                        <span className="font-mono text-neon-yellow">${totalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">{t('bestPerformer') || 'Melhor Item'}:</span>
                        <span className="font-mono text-neon-green">{bestPerformer.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className={`px-6 py-16 bg-black/20 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t('features') || 'Recursos'}</h2>
                <p className="text-white/70 max-w-2xl mx-auto">{t('featuresSubtitle') || 'Ferramentas poderosas para otimizar sua experiência'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={Package} 
                  title={t('inventoryManagement') || "Gerenciamento de Inventário"}
                  description={t('inventoryManagementDesc') || "Acompanhe todas as suas skins em um único lugar com análises detalhadas"}
                />
                <FeatureCard 
                  icon={BarChart3} 
                  title={t('marketAnalysis') || "Análise de Mercado"}
                  description={t('marketAnalysisDesc') || "Visualize tendências e tome decisões informadas com dados em tempo real"}
                />
                <FeatureCard 
                  icon={Zap} 
                  title={t('aiPowered') || "Alimentado por IA"}
                  description={t('aiPoweredDesc') || "Previsões e recomendações inteligentes para maximizar seu retorno"}
                />
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className={`px-6 py-16 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('getStarted') || 'Comece a usar agora'}</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                {t('getStartedDesc') || 'Adicione suas skins ao inventário e descubra o verdadeiro valor da sua coleção'}
              </p>
              <Link to="/inventory">
                <Button className="bg-neon-blue hover:bg-neon-blue/90 text-white px-8 py-6 rounded-xl text-lg font-medium">
                  {t('exploreInventory') || 'Explorar Inventário'}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

// Componente auxiliar para os cards de features
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-neon-blue/30 transition-all duration-300 hover:shadow-glow-sm">
    <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4">
      <Icon size={24} className="text-neon-blue" />
    </div>
    <h3 className="font-bold text-xl mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

export default Home;
