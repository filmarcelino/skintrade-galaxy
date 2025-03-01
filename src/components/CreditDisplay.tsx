
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Brain, Plus, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const CreditDisplay = () => {
  const { t } = useI18n();
  const [credits, setCredits] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleBuyCredits = () => {
    setCredits(prev => prev + 5);
    setIsOpen(false);
    toast({
      title: "Credits Purchased",
      description: "You have successfully purchased 5 AI Credits",
    });
  };

  const handleAnalyzeMarket = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      setIsOpen(false);
      toast({
        title: "Market Analysis",
        description: "AI is analyzing the market trends for you",
      });
    } else {
      toast({
        title: "Insufficient Credits",
        description: "You need to purchase more AI Credits",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
        >
          <Brain size={14} className="mr-2 text-blue-400" />
          <span>{credits}</span>
          <span className="ml-1 text-white/70 hidden sm:inline">{t('aiCredits')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-black/80 backdrop-blur-xl border border-white/10 text-white w-56"
      >
        <DropdownMenuItem
          className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          onClick={handleBuyCredits}
        >
          <Plus size={16} className="mr-2 text-green-400" />
          <span>{t('buyCredits')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          onClick={handleAnalyzeMarket}
        >
          <TrendingUp size={16} className="mr-2 text-blue-400" />
          <span>{t('analyzeMarket')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreditDisplay;
