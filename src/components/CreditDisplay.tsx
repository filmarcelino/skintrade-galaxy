
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Plus, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const CreditDisplay = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [credits, setCredits] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(10);

  const handleBuyCredits = () => {
    setCredits(prevCredits => prevCredits + selectedAmount);
    setIsDialogOpen(false);
    
    toast({
      title: 'Credits purchased!',
      description: `${selectedAmount} AI credits have been added to your account.`,
      variant: 'default',
    });
  };

  const handleUseCredit = () => {
    if (credits > 0) {
      setCredits(prevCredits => prevCredits - 1);
      
      toast({
        title: 'Analysis started',
        description: 'AI market analysis is in progress...',
        variant: 'default',
      });
      
      // Simulate analysis completion
      setTimeout(() => {
        toast({
          title: 'Analysis complete',
          description: 'Market analysis has been completed successfully.',
          variant: 'default',
        });
      }, 2000);
    } else {
      toast({
        title: 'Not enough credits',
        description: 'You need to purchase more AI credits.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Zap size={20} className="text-neon-yellow" />
          {t('aiCredits')}
        </h2>
        <div className="bg-black/40 px-4 py-2 rounded-full font-mono text-neon-yellow font-bold">
          {credits}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl"
            >
              <Plus size={16} className="mr-2" /> {t('buyCredits')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
            <DialogHeader>
              <DialogTitle>Buy AI Credits</DialogTitle>
              <DialogDescription className="text-white/70">
                Select the amount of AI credits you want to purchase.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4 my-4">
              {[10, 20, 50].map(amount => (
                <button
                  key={amount}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedAmount === amount 
                      ? 'border-neon-blue bg-neon-blue/10 text-white' 
                      : 'border-white/10 bg-black/20 text-white/70 hover:bg-black/30'
                  }`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  <div className="text-2xl font-bold">{amount}</div>
                  <div className="text-xs">${(amount * 0.10).toFixed(2)}</div>
                </button>
              ))}
            </div>
            
            <DialogFooter>
              <Button 
                className="neon-button w-full rounded-xl"
                onClick={handleBuyCredits}
              >
                Buy {selectedAmount} Credits for ${(selectedAmount * 0.10).toFixed(2)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          className="neon-button rounded-xl"
          onClick={handleUseCredit}
        >
          <Zap size={16} className="mr-2" /> {t('analyzeMarket')}
        </Button>
      </div>
    </div>
  );
};

export default CreditDisplay;
