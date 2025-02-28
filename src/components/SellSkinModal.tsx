
import { useState } from 'react';
import { Skin } from '@/lib/types';
import { DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SellSkinModalProps {
  skin: Skin | null;
  isOpen: boolean;
  onClose: () => void;
  onSellSkin: (skinId: number, salePrice: number) => void;
}

const SellSkinModal = ({ skin, isOpen, onClose, onSellSkin }: SellSkinModalProps) => {
  const { toast } = useToast();
  const [salePrice, setSalePrice] = useState(skin?.currentPrice || 0);
  const [confirmationStep, setConfirmationStep] = useState(false);

  // Update sale price when skin changes
  useState(() => {
    if (skin) {
      setSalePrice(skin.currentPrice);
    }
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalePrice(parseFloat(e.target.value));
  };

  const handleSubmit = () => {
    if (!skin) return;
    
    if (!confirmationStep) {
      setConfirmationStep(true);
      return;
    }
    
    onSellSkin(skin.id, salePrice);
    
    toast({
      title: "Skin Sold",
      description: `${skin.name} has been sold for $${salePrice.toFixed(2)}`,
      variant: "default",
    });
    
    // Reset state
    setConfirmationStep(false);
    onClose();
  };

  const handleCancel = () => {
    if (confirmationStep) {
      setConfirmationStep(false);
      return;
    }
    onClose();
  };

  const profit = skin ? salePrice - skin.purchasePrice : 0;
  const profitPercentage = skin ? (profit / skin.purchasePrice) * 100 : 0;

  if (!skin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Sell Skin</DialogTitle>
          <DialogDescription className="text-white/70">
            {confirmationStep 
              ? 'Confirm the sale of your skin' 
              : 'Record the sale of a skin from your inventory'}
          </DialogDescription>
        </DialogHeader>
        
        {!confirmationStep ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                <img 
                  src={skin.image} 
                  alt={skin.name} 
                  className="w-full h-full object-contain" 
                  style={{ filter: 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.5))' }}
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{skin.name}</h3>
                <div className="text-sm text-white/60">
                  {skin.wear} | Float: {skin.float}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Purchase Price</label>
                <Input 
                  value={skin.purchasePrice.toFixed(2)}
                  className="bg-black/20 border-white/10"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-2">Current Market Price</label>
                <Input 
                  value={skin.currentPrice.toFixed(2)}
                  className="bg-black/20 border-white/10"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-white/70 block mb-2">Sale Price ($)</label>
              <Input 
                type="number"
                value={salePrice}
                onChange={handlePriceChange}
                className="bg-black/20 border-white/10"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-white/60 text-sm">Profit/Loss on Sale</div>
              <div className={`font-mono text-lg ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)} 
                <span className="text-sm ml-2">
                  ({profitPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-white/70 block mb-2">Sale Date</label>
              <Input 
                type="date"
                className="bg-black/20 border-white/10"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-4">Confirm Sale</h3>
              <p className="mb-4">You are about to sell:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                  <img 
                    src={skin.image} 
                    alt={skin.name} 
                    className="w-full h-full object-contain" 
                    style={{ filter: 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.5))' }}
                    loading="lazy"
                  />
                </div>
                <span className="font-medium">{skin.name}</span>
              </div>
              <div className="text-xl font-mono font-semibold">${salePrice.toFixed(2)}</div>
              <p className={`text-sm mt-2 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profit >= 0 ? 'Profit: +' : 'Loss: '}${Math.abs(profit).toFixed(2)} ({profitPercentage.toFixed(2)}%)
              </p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-white/70 text-sm">
                This item will be removed from your inventory after the sale is confirmed.
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-white/10"
          >
            {confirmationStep ? 'Back' : 'Cancel'}
          </Button>
          <Button 
            className={`
              ${confirmationStep 
                ? 'bg-neon-red/20 hover:bg-neon-red/40 border-neon-red/30' 
                : 'bg-neon-blue/20 hover:bg-neon-blue/40 border-neon-blue/30'
              } text-white border
            `}
            onClick={handleSubmit}
          >
            {confirmationStep ? (
              'Confirm Sale'
            ) : (
              <>
                <DollarSign size={16} className="mr-2" />
                Proceed to Sell
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellSkinModal;
