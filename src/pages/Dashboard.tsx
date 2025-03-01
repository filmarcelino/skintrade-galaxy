
import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
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
  BarChart3,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Interface para os dados de skin
interface Skin {
  id: number;
  name: string;
  float: string;
  wear: string;
  purchase_price: number;
  current_price: number;
  image: string;
  trend: 'up' | 'down';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  acquired_at?: string;
}

// Interface para transações
interface Transaction {
  id: number;
  user_id: string;
  skin_id?: number;
  amount: number;
  transaction_type: 'purchase' | 'sale';
  notes?: string;
  created_at: string;
  skin_name?: string; // Adicionado para exibição
}

const Dashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Função para carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoadingData(true);
        
        // Verifica se há um usuário logado
        if (!user) {
          setLoadingData(false);
          return;
        }
        
        // Carregar skins do usuário
        const { data: skinsData, error: skinsError } = await supabase
          .from('skins')
          .select('*')
          .order('id', { ascending: false });
          
        if (skinsError) throw skinsError;
        
        // Carregar transações recentes do usuário
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (transactionsError) throw transactionsError;
        
        // Obter detalhes de skins para as transações
        for (const transaction of transactionsData) {
          if (transaction.skin_id) {
            const { data: skinData } = await supabase
              .from('skins')
              .select('name')
              .eq('id', transaction.skin_id)
              .single();
              
            if (skinData) {
              transaction.skin_name = skinData.name;
            }
          }
        }
        
        setSkins(skinsData as Skin[] || []);
        setTransactions(transactionsData as Transaction[] || []);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  // Calcular valores totais para o portfolio
  const totalValue = skins.reduce((total, skin) => total + skin.current_price, 0);
  const totalProfit = skins.reduce((total, skin) => total + (skin.current_price - skin.purchase_price), 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  // Funções para obter best/worst performers
  const getBestPerformers = () => {
    return skins
      .filter(skin => skin.current_price > skin.purchase_price)
      .sort((a, b) => 
        (b.current_price - b.purchase_price) - (a.current_price - a.purchase_price)
      )
      .slice(0, 3);
  };
  
  const getWorstPerformers = () => {
    return skins
      .filter(skin => skin.current_price < skin.purchase_price)
      .sort((a, b) => 
        (a.current_price - a.purchase_price) - (b.current_price - b.purchase_price)
      )
      .slice(0, 3);
  };
  
  // Formatadores
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  // Componentes de loading
  const LoadingComponent = () => (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-400" />
      <span className="text-white/70">Loading data...</span>
    </div>
  );
  
  // Obter dados
  const bestPerformers = getBestPerformers();
  const worstPerformers = getWorstPerformers();
  
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
                {loadingData ? (
                  <LoadingComponent />
                ) : (
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
                )}
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-400" />
                  {t('bestPerformers')}
                </h2>
                {loadingData ? (
                  <LoadingComponent />
                ) : bestPerformers.length > 0 ? (
                  <div className="space-y-4">
                    {bestPerformers.map(skin => {
                      const profit = skin.current_price - skin.purchase_price;
                      return (
                        <div key={skin.id} className="flex justify-between items-center">
                          <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                          <span className="font-mono text-green-400">+${profit.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-white/50 text-sm">
                    No profitable skins yet. Keep tracking your investments!
                  </div>
                )}
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown size={20} className="text-red-400" />
                  {t('worstPerformers')}
                </h2>
                {loadingData ? (
                  <LoadingComponent />
                ) : worstPerformers.length > 0 ? (
                  <div className="space-y-4">
                    {worstPerformers.map(skin => {
                      const loss = skin.current_price - skin.purchase_price;
                      return (
                        <div key={skin.id} className="flex justify-between items-center">
                          <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                          <span className="font-mono text-red-400">${loss.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-white/50 text-sm">
                    No underperforming skins. Your portfolio is doing well!
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                {t('recentActivity')}
              </h2>
              {loadingData ? (
                <LoadingComponent />
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`${
                          transaction.transaction_type === 'purchase' 
                            ? 'bg-green-500/20' 
                            : 'bg-red-500/20'
                        } p-2 rounded-full`}>
                          {transaction.transaction_type === 'purchase' ? (
                            <Plus size={16} className="text-green-400" />
                          ) : (
                            <ShoppingCart size={16} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.transaction_type === 'purchase' 
                              ? `Added ${transaction.skin_name || 'Skin'}` 
                              : `Sold ${transaction.skin_name || 'Skin'}`}
                          </div>
                          <div className="text-xs text-white/60">
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      <span className={`font-mono ${
                        transaction.transaction_type === 'purchase' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.transaction_type === 'purchase' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-white/50">
                  <p className="mb-2">No recent activity yet.</p>
                  <p className="text-sm mb-4">Add skins to your inventory to track your transactions.</p>
                </div>
              )}
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
