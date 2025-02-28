
import { useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CreditDisplay from '@/components/CreditDisplay';
import SkinTable from '@/components/SkinTable';
import TradeEvaluator from '@/components/TradeEvaluator';
import ComingSoon from '@/components/ComingSoon';
import Footer from '@/components/Footer';

const Index = () => {
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SkinTable />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <CreditDisplay />
                <TradeEvaluator />
              </div>
            </div>
            
            <ComingSoon />
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Index;
