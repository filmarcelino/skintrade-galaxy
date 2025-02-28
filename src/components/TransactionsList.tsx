
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/skin';
import { fetchTransactions } from '@/services/skinService';
import { 
  Clock, 
  Plus, 
  ShoppingCart, 
  ArrowRightLeft,
  DollarSign,
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const TransactionsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsUsingDemoData(!data.session);
    };
    
    checkAuth();
  }, []);
  
  // Mock data for demo
  const demoTransactions: Transaction[] = [
    {
      id: 1,
      transaction_type: 'buy',
      amount: 1560.75,
      notes: 'Purchased AWP | Dragon Lore',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      transaction_type: 'sell',
      amount: 405.50,
      notes: 'Sold Glock-18 | Fade',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      transaction_type: 'buy',
      amount: 1750.25,
      notes: 'Purchased M4A4 | Howl',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  // Fetch transactions from Supabase
  const { 
    data: transactionsData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => isUsingDemoData ? Promise.resolve(demoTransactions) : fetchTransactions(),
    enabled: true
  });
  
  const filteredTransactions = transactionsData 
    ? transactionsData.filter(transaction => 
        transaction.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'buy':
        return <Plus size={16} className="text-neon-green" />;
      case 'sell':
        return <ShoppingCart size={16} className="text-neon-red" />;
      case 'trade':
        return <ArrowRightLeft size={16} className="text-neon-blue" />;
      default:
        return <DollarSign size={16} className="text-neon-yellow" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock size={20} className="text-neon-purple" />
            Transaction History
          </h2>
          <p className="text-white/60 text-sm">View all your skin purchases, sales, and trades</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
          <Input 
            className="pl-10 bg-black/20 border-white/10 focus:border-neon-blue/50 w-64"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading transactions...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500">
          <p>Error loading transactions</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-8 text-center text-white/60">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-full 
                  ${transaction.transaction_type === 'buy' ? 'bg-neon-green/20' : 
                    transaction.transaction_type === 'sell' ? 'bg-neon-red/20' : 'bg-neon-blue/20'}
                `}>
                  {getTransactionIcon(transaction.transaction_type)}
                </div>
                <div>
                  <div className="font-medium">{transaction.notes}</div>
                  <div className="text-xs text-white/60">
                    {transaction.created_at ? formatDate(transaction.created_at) : 'Unknown date'}
                  </div>
                </div>
              </div>
              <span className={`font-mono 
                ${transaction.transaction_type === 'buy' ? 'text-neon-red' : 
                  transaction.transaction_type === 'sell' ? 'text-neon-green' : 'text-neon-blue'}
              `}>
                {transaction.transaction_type === 'buy' ? '-' : transaction.transaction_type === 'sell' ? '+' : ''}
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 border-white/10 mt-4"
          >
            View More Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
