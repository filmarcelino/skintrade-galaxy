
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
import { ShoppingCart, Plus, Zap, Package, Rocket, BarChart3, PackageOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { SAMPLE_SKINS } from '@/lib/constants';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  
  // Calculate portfolio statistics
  const totalValue = SAMPLE_SKINS.reduce((total, skin) => total + skin.currentPrice, 0);
  const totalItems = SAMPLE_SKINS.length;
  const bestPerformer = [...SAMPLE_SKINS].sort((a, b) => b.profitLoss - a.profitLoss)[0];
  const worstPerformer = [...SAMPLE_SKINS].sort((a, b) => a.profitLoss - b.profitLoss)[0];
  
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
                <span className="text-neon-purple font-semibold whitespace-nowrap">Quick Actions:</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <Button 
                  className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("inventory")}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Skins</span>
                </Button>
                <Button 
                  className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("inventory")}
                >
                  <Package size={16} />
                  <span className="hidden sm:inline">Sell Skins</span>
                </Button>
                <Button 
                  className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl flex items-center gap-2"
                  size="sm"
                  onClick={() => setActiveTab("trades")}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Create Trade</span>
                </Button>
                <Button 
                  className="bg-neon-purple/20 hover:bg-neon-purple/40 text-white border border-neon-purple/30 rounded-xl flex items-center gap-2"
                  size="sm"
                >
                  <Zap size={16} />
                  <span className="hidden sm:inline">AI Analysis</span>
                </Button>
              </div>
            </div>
            
            {/* Updated Panel Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column - AI Credits and Inventory Summary */}
              <div className="md:col-span-4 space-y-6">
                {/* AI Credits Card - Made narrower */}
                <CreditDisplay />
                
                {/* Inventory Summary Card - Now below AI Credits */}
                <div className="glass-card p-6 animate-fade-in rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <PackageOpen size={20} className="text-neon-blue" />
                      Inventory Summary
                    </h2>
                    <div className="bg-black/40 px-4 py-2 rounded-full font-mono text-neon-blue font-bold">
                      {totalItems}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Value</span>
                      <span className="font-mono text-neon-blue">${totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Average Item Value</span>
                      <span className="font-mono text-neon-yellow">
                        ${(totalValue / totalItems).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Last Added</span>
                      <span className="font-mono text-white/70">2 days ago</span>
                    </div>
                    
                    <div className="pt-2">
                      <Link to="/inventory">
                        <Button className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Best and Worst Performers */}
              <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Performer Card - Improved */}
                <div className="glass-card p-6 animate-fade-in rounded-xl border border-neon-green/20 shadow-glow-sm hover:shadow-glow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <TrendingUp size={20} className="text-neon-green" />
                      Best Performer
                    </h2>
                    <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-xs font-semibold">
                      +{((bestPerformer.profitLoss / bestPerformer.purchasePrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  {bestPerformer && (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-black/50 rounded-xl overflow-hidden border border-neon-green/30 flex items-center justify-center shadow-glow-lg mb-4">
                        <img 
                          src={bestPerformer.image} 
                          alt={bestPerformer.name} 
                          className="w-20 h-20 object-contain" 
                          style={{ filter: 'drop-shadow(0 0 5px rgba(80, 255, 120, 0.7))' }}
                        />
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="font-medium text-lg text-white">{bestPerformer.name}</div>
                        <div className="text-xs text-white/60">{bestPerformer.wear} | Float: {bestPerformer.float}</div>
                      </div>
                      
                      <div className="w-full bg-black/30 rounded-lg p-3 border border-neon-green/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Purchase Price</span>
                          <span className="font-mono text-white/80">${bestPerformer.purchasePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Current Price</span>
                          <span className="font-mono text-neon-blue">${bestPerformer.currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Profit</span>
                          <span className="font-mono text-neon-green font-bold">
                            +${bestPerformer.profitLoss.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Worst Performer Card - Improved */}
                <div className="glass-card p-6 animate-fade-in rounded-xl border border-neon-red/20 shadow-glow-sm hover:shadow-glow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <TrendingDown size={20} className="text-neon-red" />
                      Worst Performer
                    </h2>
                    <span className="bg-neon-red/20 text-neon-red px-3 py-1 rounded-full text-xs font-semibold">
                      {((worstPerformer.profitLoss / worstPerformer.purchasePrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  {worstPerformer && (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-black/50 rounded-xl overflow-hidden border border-neon-red/30 flex items-center justify-center shadow-glow-lg mb-4">
                        <img 
                          src={worstPerformer.image} 
                          alt={worstPerformer.name} 
                          className="w-20 h-20 object-contain" 
                          style={{ filter: 'drop-shadow(0 0 5px rgba(255, 61, 61, 0.7))' }}
                        />
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="font-medium text-lg text-white">{worstPerformer.name}</div>
                        <div className="text-xs text-white/60">{worstPerformer.wear} | Float: {worstPerformer.float}</div>
                      </div>
                      
                      <div className="w-full bg-black/30 rounded-lg p-3 border border-neon-red/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Purchase Price</span>
                          <span className="font-mono text-white/80">${worstPerformer.purchasePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Current Price</span>
                          <span className="font-mono text-neon-red/80">${worstPerformer.currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Loss</span>
                          <span className="font-mono text-neon-red font-bold">
                            ${worstPerformer.profitLoss.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content Tabs */}
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <TabsTrigger 
                  value="inventory" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3 flex items-center gap-2 justify-center"
                >
                  <Package size={16} />
                  Inventory
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
                  Trades
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
                  Market Statistics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Market Volume</span>
                    <span className="font-mono text-neon-green">$1,245,678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Active Trades</span>
                    <span className="font-mono text-neon-blue">24,567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Hot Category</span>
                    <span className="font-mono text-neon-yellow">Knives</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Your Portfolio</span>
                    <span className="font-mono text-neon-purple">${totalValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-neon-blue" />
                  Trading Insights
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Best Deal Today</span>
                    <span className="font-mono text-neon-green">+42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Worst Deal Today</span>
                    <span className="font-mono text-neon-red">-18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Your Success Rate</span>
                    <span className="font-mono text-neon-blue">76%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Trade Volume</span>
                    <span className="font-mono text-neon-purple">$2,145</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Rocket size={20} className="text-neon-yellow" />
                  Upcoming Events
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-blue font-medium">CS2 Major Tournament</div>
                    <div className="text-sm text-white/70">Expected increase: +15-20%</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-green font-medium">New Case Release</div>
                    <div className="text-sm text-white/70">Expected in 12 days</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-yellow font-medium">Flash Sale</div>
                    <div className="text-sm text-white/70">Starts in 3 days</div>
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
