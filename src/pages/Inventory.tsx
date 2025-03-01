
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

// Define a common skin type to use throughout the component
type Skin = {
  id: number;
  name: string;
  image: string;
  float: string | number;
  wear: string;
  purchasePrice: number;
  currentPrice: number;
  profitLoss: number;
  trend: string;
  popularity?: string;
};

// Define transaction type for recent activity
type Transaction = {
  id: number;
  amount: number;
  created_at: string;
  transaction_type: string;
  notes: string | null;
  skin_id: number | null;
  skins?: {
    name: string;
    image: string;
  } | null;
};

const Inventory = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [skins, setSkins] = useState<Skin[]>(SAMPLE_SKINS);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  
  // Fetch skin data from Supabase
  useEffect(() => {
    const fetchSkins = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If not logged in, use sample data (already in the correct format)
          setSkins(SAMPLE_SKINS);
          
          // Set sample recent activity data
          const sampleTransactions = [
            {
              id: 1,
              amount: 1560.75,
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              transaction_type: 'purchase',
              notes: 'Added AWP | Dragon Lore',
              skin_id: 1,
              skins: {
                name: 'AWP | Dragon Lore',
                image: '/path/to/image.png'
              }
            },
            {
              id: 2,
              amount: 405.50,
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
              transaction_type: 'sale',
              notes: 'Sold Glock-18 | Fade',
              skin_id: 2,
              skins: {
                name: 'Glock-18 | Fade',
                image: '/path/to/image.png'
              }
            },
            {
              id: 3,
              amount: 450.00,
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
              transaction_type: 'price_change',
              notes: 'Price change for M4A4 | Howl',
              skin_id: 3,
              skins: {
                name: 'M4A4 | Howl',
                image: '/path/to/image.png'
              }
            }
          ];
          
          setRecentActivity(sampleTransactions);
          return;
        }
        
        // Fetch real data from Supabase
        const { data, error } = await supabase
          .from('skins')
          .select('*')
          .order('id', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our expected format
        const formattedSkins: Skin[] = data.map(skin => ({
          id: skin.id,
          name: skin.name,
          float: skin.float,
          wear: skin.wear,
          purchasePrice: skin.purchase_price,
          currentPrice: skin.current_price,
          image: skin.image,
          trend: skin.trend || 'up',
          profitLoss: skin.current_price - skin.purchase_price,
          popularity: 'medium' // Default value for compatibility
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
        
        console.log('Fetched transactions:', transactions);
        
        // Ensure transactions have the correct format
        setRecentActivity(transactions || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to sample data
        setSkins(SAMPLE_SKINS);
        
        // Fallback to sample recent activity data
        const sampleTransactions = [
          {
            id: 1,
            amount: 1560.75,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            transaction_type: 'purchase',
            notes: 'Added AWP | Dragon Lore',
            skin_id: 1,
            skins: {
              name: 'AWP | Dragon Lore',
              image: '/path/to/image.png'
            }
          },
          {
            id: 2,
            amount: 405.50,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            transaction_type: 'sale',
            notes: 'Sold Glock-18 | Fade',
            skin_id: 2,
            skins: {
              name: 'Glock-18 | Fade',
              image: '/path/to/image.png'
            }
          },
          {
            id: 3,
            amount: 450.00,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            transaction_type: 'price_change',
            notes: 'Price change for M4A4 | Howl',
            skin_id: 3,
            skins: {
              name: 'M4A4 | Howl',
              image: '/path/to/image.png'
            }
          }
        ];
        
        setRecentActivity(sampleTransactions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkins();
  }, []);
  
  // Calculate portfolio metrics
  const totalValue = skins.reduce((total, skin) => total + skin.currentPrice, 0);
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

  // Get skin name from transaction
  const getSkinName = (transaction: Transaction): string => {
    if (transaction.skins && transaction.skins.name) {
      return transaction.skins.name;
    }
    
    // Extract skin name from notes if available
    if (transaction.notes) {
      const match = transaction.notes.match(/(Added|Sold|Changed) (.+)/);
      if (match && match[2]) {
        return match[2];
      }
    }
    
    return 'Unknown Skin';
  };

  // Get appropriate icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Plus size={16} className="text-neon-green" />;
      case 'sale':
        return <ShoppingCart size={16} className="text-neon-red" />;
      case 'price_change':
        return <BarChart3 size={16} className="text-neon-blue" />;
      default:
        return <Clock size={16} className="text-neon-purple" />;
    }
  };

  // Get appropriate background color for transaction type
  const getTransactionBgColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-neon-green/20';
      case 'sale':
        return 'bg-neon-red/20';
      case 'price_change':
        return 'bg-neon-blue/20';
      default:
        return 'bg-neon-purple/20';
    }
  };

  // Get appropriate text for transaction type
  const getTransactionText = (transaction: Transaction): string => {
    switch (transaction.transaction_type) {
      case 'purchase':
        return 'Added ';
      case 'sale':
        return 'Sold ';
      case 'price_change':
        return 'Price change for ';
      default:
        return 'Updated ';
    }
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
                  recentActivity.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`${getTransactionBgColor(transaction.transaction_type)} p-2 rounded-full`}>
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {getTransactionText(transaction)}
                            {getSkinName(transaction)}
                          </div>
                          <div className="text-xs text-white/60">
                            {formatRelativeTime(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      <span className={`font-mono ${transaction.transaction_type === 'purchase' ? 'text-neon-green' : transaction.transaction_type === 'sale' ? 'text-neon-red' : 'text-neon-blue'}`}>
                        {transaction.transaction_type === 'purchase' ? '+' : transaction.transaction_type === 'sale' ? '-' : ''}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-white/50">No recent activity found</div>
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
