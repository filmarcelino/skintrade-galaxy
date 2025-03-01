
import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkinTable from '@/components/SkinTable';
import TradeEvaluator from '@/components/TradeEvaluator';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PackageOpen, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Plus, 
  ShoppingCart, 
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { t } = useI18n();
  const [loadedSkins, setLoadedSkins] = useState<boolean>(false);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedSkins(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const totalValue = SAMPLE_SKINS.reduce((total, skin) => total + skin.currentPrice, 0);
  const totalProfit = SAMPLE_SKINS.reduce((total, skin) => total + skin.profitLoss, 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="pt-4 pb-8">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                {t('welcomeToSkinculator')}
              </h1>
              <p className="text-white/60 max-w-2xl">
                Track your CS2 skin collection, analyze market trends, and get AI-powered trade evaluations.
              </p>
            </div>
            
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <PackageOpen size={20} className="text-blue-400" />
                  {t('skinPortfolio')}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">{t('totalValue')}</span>
                    <span className="font-mono text-blue-400">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">{t('totalItems')}</span>
                    <span className="font-mono text-yellow-400">{SAMPLE_SKINS.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">{t('totalProfit')}</span>
                    <span className={`font-mono ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-400" />
                  {t('bestPerformers')}
                </h2>
                <div className="space-y-4">
                  {SAMPLE_SKINS
                    .filter(skin => skin.profitLoss > 0)
                    .sort((a, b) => b.profitLoss - a.profitLoss)
                    .slice(0, 3)
                    .map(skin => (
                      <div key={skin.id} className="flex justify-between items-center">
                        <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                        <span className="font-mono text-green-400">+${skin.profitLoss.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown size={20} className="text-red-400" />
                  {t('worstPerformers')}
                </h2>
                <div className="space-y-4">
                  {SAMPLE_SKINS
                    .filter(skin => skin.profitLoss < 0)
                    .sort((a, b) => a.profitLoss - b.profitLoss)
                    .slice(0, 3)
                    .map(skin => (
                      <div key={skin.id} className="flex justify-between items-center">
                        <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                        <span className="font-mono text-red-400">${skin.profitLoss.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                {t('recentActivity')}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Plus size={16} className="text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Added AWP | Dragon Lore</div>
                      <div className="text-xs text-white/60">2 days ago</div>
                    </div>
                  </div>
                  <span className="font-mono text-green-400">+$1,560.75</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-full">
                      <ShoppingCart size={16} className="text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Sold Glock-18 | Fade</div>
                      <div className="text-xs text-white/60">5 days ago</div>
                    </div>
                  </div>
                  <span className="font-mono text-red-400">-$405.50</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <BarChart3 size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Price change for M4A4 | Howl</div>
                      <div className="text-xs text-white/60">1 week ago</div>
                    </div>
                  </div>
                  <span className="font-mono text-blue-400">+$450.00</span>
                </div>
              </div>
            </div>
            
            {/* Skin Inventory Table */}
            <SkinTable />
            
            {/* Trade Evaluator */}
            <TradeEvaluator />
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Dashboard;
