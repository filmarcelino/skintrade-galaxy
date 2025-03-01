
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkinTable from '@/components/SkinTable';
import TradeEvaluator from '@/components/TradeEvaluator';
import { supabase } from '@/integrations/supabase/client';
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
  const [skins, setSkins] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch skins
        const { data: skinsData, error: skinsError } = await supabase
          .from('skins')
          .select('*');
        
        if (skinsError) throw skinsError;
        
        // Fetch transactions with skin information
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*, skins(name)')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (transactionsError) throw transactionsError;
        
        setSkins(skinsData || []);
        setTransactions(transactionsData || []);
        setLoadedSkins(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate portfolio statistics
  const totalValue = skins.reduce((total, skin) => total + parseFloat(skin.current_price), 0);
  const totalProfit = skins.reduce((total, skin) => {
    const profitLoss = parseFloat(skin.current_price) - parseFloat(skin.purchase_price);
    return total + profitLoss;
  }, 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  // Sort skins by profit/loss for best/worst performers
  const sortedSkins = [...skins];
  sortedSkins.sort((a, b) => {
    const profitA = parseFloat(a.current_price) - parseFloat(a.purchase_price);
    const profitB = parseFloat(b.current_price) - parseFloat(b.purchase_price);
    return profitB - profitA;
  });
  
  const bestPerformers = sortedSkins.filter(skin => parseFloat(skin.current_price) > parseFloat(skin.purchase_price)).slice(0, 3);
  const worstPerformers = [...sortedSkins].reverse().filter(skin => parseFloat(skin.current_price) < parseFloat(skin.purchase_price)).slice(0, 3);
  
  return (
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
                  <span className="font-mono text-yellow-400">{skins.length}</span>
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
                {bestPerformers.map(skin => {
                  const profit = parseFloat(skin.current_price) - parseFloat(skin.purchase_price);
                  return (
                    <div key={skin.id} className="flex justify-between items-center">
                      <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                      <span className="font-mono text-green-400">+${profit.toFixed(2)}</span>
                    </div>
                  );
                })}
                {bestPerformers.length === 0 && (
                  <div className="text-white/50 text-center py-2">No profitable skins yet</div>
                )}
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingDown size={20} className="text-red-400" />
                {t('worstPerformers')}
              </h2>
              <div className="space-y-4">
                {worstPerformers.map(skin => {
                  const loss = parseFloat(skin.current_price) - parseFloat(skin.purchase_price);
                  return (
                    <div key={skin.id} className="flex justify-between items-center">
                      <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                      <span className="font-mono text-red-400">${loss.toFixed(2)}</span>
                    </div>
                  );
                })}
                {worstPerformers.length === 0 && (
                  <div className="text-white/50 text-center py-2">No losing skins yet</div>
                )}
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
              {transactions.map(transaction => {
                // Access skin name from the joined skins table data
                const skinName = transaction.skins ? transaction.skins.name : 'Unknown Skin';
                
                return (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`${
                        transaction.transaction_type === 'add' ? 'bg-green-500/20' : 
                        transaction.transaction_type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      } p-2 rounded-full`}>
                        {transaction.transaction_type === 'add' && <Plus size={16} className="text-green-400" />}
                        {transaction.transaction_type === 'sell' && <ShoppingCart size={16} className="text-red-400" />}
                        {transaction.transaction_type === 'price_change' && <BarChart3 size={16} className="text-blue-400" />}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.transaction_type === 'add' && `Added ${skinName}`}
                          {transaction.transaction_type === 'sell' && `Sold ${skinName}`}
                          {transaction.transaction_type === 'price_change' && `Price change for ${skinName}`}
                        </div>
                        <div className="text-xs text-white/60">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`font-mono ${
                      transaction.transaction_type === 'add' ? 'text-green-400' : 
                      transaction.transaction_type === 'sell' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {transaction.transaction_type === 'sell' ? '-' : '+'}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              
              {transactions.length === 0 && (
                <div className="text-white/50 text-center py-2">No recent transactions</div>
              )}
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
  );
};

export default Dashboard;
