
import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SAMPLE_SKINS } from '@/lib/constants';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  MoreHorizontal, 
  ShoppingCart, 
  Plus, 
  ExternalLink, 
  PackageOpen, 
  Trash2, 
  BarChart3, 
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SkinTable from '@/components/SkinTable';
import { supabase } from '@/integrations/supabase/client';

const Inventory = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [skins, setSkins] = useState(SAMPLE_SKINS);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Fetch skin data from Supabase
  useEffect(() => {
    const fetchSkins = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If not logged in, use sample data
          setSkins(SAMPLE_SKINS.map(skin => ({
            id: skin.id,
            name: skin.name,
            float: String(skin.float),
            wear: skin.wear,
            purchase_price: skin.purchasePrice,
            current_price: skin.currentPrice,
            image: skin.image,
            trend: skin.trend as 'up' | 'down',
            profitLoss: skin.profitLoss
          })));
          return;
        }
        
        // Fetch real data from Supabase
        const { data, error } = await supabase
          .from('skins')
          .select('*')
          .order('id', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our expected format
        const formattedSkins = data.map(skin => ({
          id: skin.id,
          name: skin.name,
          float: skin.float,
          wear: skin.wear,
          purchase_price: skin.purchase_price,
          current_price: skin.current_price,
          image: skin.image,
          trend: skin.trend || 'up',
          profitLoss: skin.current_price - skin.purchase_price
        }));
        
        setSkins(formattedSkins);
        
        // Fetch recent activity
        const { data: transactions, error: transactionError } = await supabase
          .from('transactions')
          .select(`
            *,
            skins(name, image)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (transactionError) throw transactionError;
        
        setRecentActivity(transactions);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to sample data
        setSkins(SAMPLE_SKINS.map(skin => ({
          id: skin.id,
          name: skin.name,
          float: String(skin.float),
          wear: skin.wear,
          purchase_price: skin.purchasePrice,
          current_price: skin.currentPrice,
          image: skin.image,
          trend: skin.trend as 'up' | 'down',
          profitLoss: skin.profitLoss
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkins();
  }, []);
  
  // Calculate portfolio metrics
  const totalValue = skins.reduce((total, skin) => total + skin.current_price, 0);
  const totalProfit = skins.reduce((total, skin) => total + skin.profitLoss, 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  // Handle add/sell skin buttons
  const handleOpenAddSell = (type: 'add' | 'sell') => {
    toast({
      title: type === 'add' ? "Add Skin" : "Sell Skin",
      description: `Opening ${type === 'add' ? 'add new skin' : 'sell skin'} dialog`,
      variant: "default",
    });
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('inventory')}</h1>
                <p className="text-white/60">Manage your skins, track values, and analyze market trends</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl flex items-center gap-2"
                  onClick={() => handleOpenAddSell('add')}
                >
                  <Plus size={18} />
                  Add Skin
                </Button>
                <Button 
                  className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl flex items-center gap-2"
                  onClick={() => handleOpenAddSell('sell')}
                >
                  <ShoppingCart size={18} />
                  Sell Skin
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <PackageOpen size={20} className="text-neon-blue" />
                  Portfolio Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Value</span>
                    <span className="font-mono text-neon-blue">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Items</span>
                    <span className="font-mono text-neon-yellow">{skins.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Profit/Loss</span>
                    <span className={`font-mono ${totalProfit >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                      {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-neon-green" />
                  Best Performers
                </h2>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-white/50">Loading best performers...</div>
                  ) : skins
                    .filter(skin => skin.profitLoss > 0)
                    .sort((a, b) => b.profitLoss - a.profitLoss)
                    .slice(0, 3)
                    .map(skin => (
                      <div key={skin.id} className="flex justify-between items-center">
                        <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                        <span className="font-mono text-neon-green">+${skin.profitLoss.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown size={20} className="text-neon-red" />
                  Worst Performers
                </h2>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-white/50">Loading worst performers...</div>
                  ) : skins
                    .filter(skin => skin.profitLoss < 0)
                    .sort((a, b) => a.profitLoss - b.profitLoss)
                    .slice(0, 3)
                    .map(skin => (
                      <div key={skin.id} className="flex justify-between items-center">
                        <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                        <span className="font-mono text-neon-red">${skin.profitLoss.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-neon-purple" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-white/50">Loading recent activity...</div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((transaction, index) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`${transaction.transaction_type === 'purchase' ? 'bg-neon-green/20' : 'bg-neon-red/20'} p-2 rounded-full`}>
                          {transaction.transaction_type === 'purchase' ? (
                            <Plus size={16} className="text-neon-green" />
                          ) : (
                            <ShoppingCart size={16} className="text-neon-red" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.transaction_type === 'purchase' ? 'Added ' : 'Sold '}
                            {transaction.skins ? transaction.skins.name : transaction.notes?.split(' ')[2] || 'Unknown Skin'}
                          </div>
                          <div className="text-xs text-white/60">
                            {formatRelativeTime(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      <span className={`font-mono ${transaction.transaction_type === 'purchase' ? 'text-neon-green' : 'text-neon-red'}`}>
                        {transaction.transaction_type === 'purchase' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  // Fallback sample data if no real transactions
                  <>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-neon-green/20 p-2 rounded-full">
                          <Plus size={16} className="text-neon-green" />
                        </div>
                        <div>
                          <div className="font-medium">Added AWP | Dragon Lore</div>
                          <div className="text-xs text-white/60">2 days ago</div>
                        </div>
                      </div>
                      <span className="font-mono text-neon-green">+$1,560.75</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-neon-red/20 p-2 rounded-full">
                          <ShoppingCart size={16} className="text-neon-red" />
                        </div>
                        <div>
                          <div className="font-medium">Sold Glock-18 | Fade</div>
                          <div className="text-xs text-white/60">5 days ago</div>
                        </div>
                      </div>
                      <span className="font-mono text-neon-red">-$405.50</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-neon-blue/20 p-2 rounded-full">
                          <BarChart3 size={16} className="text-neon-blue" />
                        </div>
                        <div>
                          <div className="font-medium">Price change for M4A4 | Howl</div>
                          <div className="text-xs text-white/60">1 week ago</div>
                        </div>
                      </div>
                      <span className="font-mono text-neon-blue">+$450.00</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Skin Table Component - uses Supabase for real data */}
            <SkinTable />
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Inventory;
