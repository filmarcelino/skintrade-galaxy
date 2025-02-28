
import { useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';
import { PackageOpen, BarChart3, Clock } from 'lucide-react';

const Marketplace = () => {
  const { t } = useI18n();

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('marketplace')}</h1>
              <p className="text-white/60">Find, buy, and sell skins from our community marketplace</p>
            </div>
            
            {/* Coming Soon */}
            <ComingSoon />
            
            {/* Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <PackageOpen size={20} className="text-neon-blue" />
                  Market Volume
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">24h Volume</span>
                    <span className="font-mono text-neon-blue">$3,456,789</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">7d Volume</span>
                    <span className="font-mono text-neon-yellow">$24,567,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">30d Volume</span>
                    <span className="font-mono text-neon-purple">$87,654,321</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-neon-green" />
                  Hot Categories
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Knives</span>
                    <span className="font-mono text-neon-green">+12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">AWPs</span>
                    <span className="font-mono text-neon-blue">+8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Gloves</span>
                    <span className="font-mono text-neon-yellow">+6.2%</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-neon-purple" />
                  Coming Soon
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-blue font-medium">Instant Buy/Sell</div>
                    <div className="text-sm text-white/70">Trade skins with zero wait time</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-green font-medium">AI Price Predictions</div>
                    <div className="text-sm text-white/70">Get insights on future prices</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-neon-yellow font-medium">Bulk Trading</div>
                    <div className="text-sm text-white/70">Buy and sell multiple skins at once</div>
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

export default Marketplace;
