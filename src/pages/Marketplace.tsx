
import { useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BellRing, ChevronRight, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You'll be notified when our marketplace launches",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial">
        <Navbar />
        
        <main className="flex-grow pt-20 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="inline-block mb-6 p-3 bg-purple-500/10 rounded-full border border-purple-500/20">
              <ShoppingCart size={32} className="text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {t('marketplaceTitle')}
            </h1>
            
            <div className="glass-card relative overflow-hidden border border-white/10 bg-black/40 rounded-2xl backdrop-blur-xl p-8 mt-8">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
              
              <h2 className="text-3xl font-bold mb-4">{t('comingSoon')}</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-8">
                Our marketplace will revolutionize CS2 skin trading with advanced filters, 
                secure transactions, and AI-powered price analytics. Stay tuned for exclusive deals 
                and features coming your way.
              </p>
              
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                  <BellRing size={18} className="text-blue-400" />
                  {t('getNotified')}
                </h3>
                
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="bg-black/30 border-white/10 focus-visible:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {t('notifyMe')}
                        <ChevronRight size={16} className="ml-1" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <FeatureBlock 
                  title="Advanced Filters" 
                  description="Find exactly what you're looking for with powerful search and filtering options."
                  icon="filter"
                />
                <FeatureBlock 
                  title="Secure Trading" 
                  description="Our platform ensures safe and transparent transactions for buyers and sellers."
                  icon="shield"
                />
                <FeatureBlock 
                  title="Live Auctions" 
                  description="Participate in exciting real-time auctions for rare and valuable skins."
                  icon="auction"
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

const FeatureBlock = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  const getIcon = () => {
    switch (icon) {
      case 'filter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        );
      case 'shield':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'auction':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D946EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M18 8a6 6 0 0 0-9.33-5"></path>
            <path d="m6 15 4-4"></path>
            <path d="M2 12h4"></path>
            <path d="M6 9v4"></path>
            <circle cx="17" cy="17" r="5"></circle>
            <path d="M17 14v4h3"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
      <div className="mb-2">{getIcon()}</div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
};

export default Marketplace;
