
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ChartPie
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
  skinCount: number;
  priceHistory: {
    date: string;
    value: number;
  }[];
  categoryDistribution: {
    name: string;
    value: number;
  }[];
  profitByMonth: {
    month: string;
    profit: number;
  }[];
}

const Analytics = () => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [skins, setSkins] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
    skinCount: 0,
    priceHistory: [],
    categoryDistribution: [],
    profitByMonth: []
  });
  const [currentTab, setCurrentTab] = useState('overview');

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
        
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*, skins(name)')
          .order('created_at', { ascending: false });
        
        if (transactionsError) throw transactionsError;
        
        setSkins(skinsData || []);
        setTransactions(transactionsData || []);
        
        // Calculate analytics data
        processAnalyticsData(skinsData || [], transactionsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate analytics data
  const processAnalyticsData = (skinsData: any[], transactionsData: any[]) => {
    // Calculate total value and profit
    const totalValue = skinsData.reduce((total, skin) => total + parseFloat(skin.current_price), 0);
    const totalProfit = skinsData.reduce((total, skin) => {
      const profitLoss = parseFloat(skin.current_price) - parseFloat(skin.purchase_price);
      return total + profitLoss;
    }, 0);
    const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
    
    // Generate mock price history data (in a real app this would come from historical data)
    const today = new Date();
    const priceHistory = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      // Generate a random value around total value for demonstration
      const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(totalValue * randomFactor)
      };
    });
    
    // Create category distribution (in a real app we would categorize skins)
    const categories = ['Rifles', 'Pistols', 'Knives', 'Gloves', 'Other'];
    const categoryDistribution = categories.map(category => {
      // Simulate distribution for demo
      const categoryValue = Math.round(totalValue * (0.1 + Math.random() * 0.3));
      return {
        name: category,
        value: categoryValue
      };
    });
    
    // Calculate profit by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const profitByMonth = months.map(month => {
      // Simulate monthly profit for demo
      const monthlyProfit = totalProfit / 12 * (0.5 + Math.random());
      return {
        month,
        profit: parseFloat(monthlyProfit.toFixed(2))
      };
    });
    
    setAnalytics({
      totalValue,
      totalProfit,
      profitPercentage,
      skinCount: skinsData.length,
      priceHistory,
      categoryDistribution,
      profitByMonth
    });
  };
  
  // Chart colors
  const COLORS = ['#00f3ff', '#9000ff', '#ff00e4', '#00ff8f', '#ffee00'];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="pt-4 pb-8">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {t('analytics', 'Analytics')}
            </h1>
            <p className="text-white/60 max-w-2xl">
              {t('analyticsDescription', 'Analyze your skin collection performance and market trends over time.')}
            </p>
          </div>
          
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <DollarSign size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white/70">{t('totalValue')}</p>
                  <h3 className="text-2xl font-bold text-white">${analytics.totalValue.toFixed(2)}</h3>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`${analytics.totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} p-3 rounded-full`}>
                  {analytics.totalProfit >= 0 ? (
                    <TrendingUp size={24} className="text-green-400" />
                  ) : (
                    <TrendingDown size={24} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-white/70">{t('totalProfit')}</p>
                  <h3 className={`text-2xl font-bold ${analytics.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.totalProfit >= 0 ? '+' : ''}{analytics.totalProfit.toFixed(2)} ({analytics.profitPercentage.toFixed(2)}%)
                  </h3>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Calendar size={24} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70">{t('transactions')}</p>
                  <h3 className="text-2xl font-bold text-white">{transactions.length}</h3>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-3 rounded-full">
                  <BarChart3 size={24} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-white/70">{t('skinsOwned')}</p>
                  <h3 className="text-2xl font-bold text-white">{analytics.skinCount}</h3>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Chart Tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setCurrentTab}>
            <TabsList className="mb-6 bg-black/30 border border-white/10">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="profit">{t('profitLoss')}</TabsTrigger>
              <TabsTrigger value="categories">{t('categories')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-400" />
                {t('portfolioValueOverTime')}
              </h2>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.priceHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Portfolio Value ($)" 
                      stroke="#00f3ff" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="profit" className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-400" />
                {t('monthlyProfitLoss')}
              </h2>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.profitByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="profit" 
                      name="Profit/Loss ($)" 
                      fill="#9000ff" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ChartPie size={20} className="text-pink-400" />
                {t('skinCategoryDistribution')}
              </h2>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }} 
                      formatter={(value) => [`$${value}`, 'Value']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Recent Transactions Summary */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              {t('recentTransactions', 'Recent Transactions')}
            </h2>
            
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => {
                // Access skin name from the joined skins table data
                const skinName = transaction.skins ? transaction.skins.name : 'Unknown Skin';
                
                return (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`${
                        transaction.transaction_type === 'add' ? 'bg-green-500/20' : 
                        transaction.transaction_type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      } p-2 rounded-full`}>
                        {transaction.transaction_type === 'add' && <TrendingUp size={16} className="text-green-400" />}
                        {transaction.transaction_type === 'sell' && <TrendingDown size={16} className="text-red-400" />}
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
              
              {transactions.length > 5 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  {t('viewAllTransactions')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
