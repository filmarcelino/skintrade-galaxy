
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
import { ShoppingCart, Plus, Zap } from 'lucide-react';

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
                <span className="text-neon-purple font-semibold whitespace-nowrap">Quick Actions:</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <Button 
                  className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-full flex items-center gap-2"
                  size="sm"
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Buy Skins</span>
                </Button>
                <Button 
                  className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-full flex items-center gap-2"
                  size="sm"
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Sell Skins</span>
                </Button>
                <Button 
                  className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-full flex items-center gap-2"
                  size="sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Create Trade</span>
                </Button>
                <Button 
                  className="bg-neon-purple/20 hover:bg-neon-purple/40 text-white border border-neon-purple/30 rounded-full flex items-center gap-2"
                  size="sm"
                >
                  <Zap size={16} />
                  <span className="hidden sm:inline">AI Analysis</span>
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
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger 
                  value="market" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger 
                  value="trades" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl py-3"
                >
                  Trades
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="animate-fade-in">
                <div className="glass-card rounded-xl overflow-hidden">
                  <SkinTable />
                </div>
              </TabsContent>
              
              <TabsContent value="market" className="animate-fade-in">
                <div className="glass-card rounded-xl p-6 text-center">
                  <ComingSoon />
                </div>
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
                <h2 className="text-xl font-semibold mb-4">Market Stats</h2>
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
                    <span className="text-white/70">Trending Category</span>
                    <span className="font-mono text-neon-yellow">Knives</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Your Portfolio</span>
                    <span className="font-mono text-neon-purple">$4,320</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Trade Insights</h2>
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
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-blue font-medium">CS2 Major Tournament</div>
                    <div className="text-sm text-white/70">Predicted price spike: +15-20%</div>
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
