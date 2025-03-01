
import { useToast } from '@/hooks/use-toast';

export const useSkinActions = () => {
  const { toast } = useToast();
  
  const handleInspect = (skinName: string) => {
    toast({
      title: 'Inspect Weapon',
      description: `Opening inspection for ${skinName}`,
      variant: 'default',
    });
    // Simulate opening the inspection link
    setTimeout(() => {
      window.open(`https://steamcommunity.com/market/listings/730/${encodeURIComponent(skinName)}`, '_blank');
    }, 1000);
  };

  return {
    handleInspect
  };
};
