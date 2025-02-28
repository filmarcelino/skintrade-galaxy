
import { useState } from 'react';
import { Skin } from '@/lib/types';
import { Plus } from 'lucide-react';
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

const wearOptions = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];

interface AddSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkin: (skin: Omit<Skin, 'id' | 'profitLoss' | 'trend'>) => void;
}

const AddSkinModal = ({ isOpen, onClose, onAddSkin }: AddSkinModalProps) => {
  const { toast } = useToast();
  const [newSkin, setNewSkin] = useState({
    name: '',
    float: '0.0000',
    wear: 'Factory New',
    purchasePrice: 0,
    currentPrice: 0,
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.type === 'number' 
      ? parseFloat(e.target.value) 
      : e.target.value;
    
    setNewSkin({ ...newSkin, [field]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSkin({ ...newSkin, wear: e.target.value });
  };

  const handleSubmit = () => {
    if (!newSkin.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a skin name",
        variant: "destructive",
      });
      return;
    }

    // If no image is provided, use a default placeholder
    const finalSkin = {
      ...newSkin,
      image: newSkin.image || 'https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
    };

    onAddSkin(finalSkin);
    toast({
      title: "Skin Added",
      description: `${newSkin.name} has been added to your inventory`,
      variant: "default",
    });

    // Reset form
    setNewSkin({
      name: '',
      float: '0.0000',
      wear: 'Factory New',
      purchasePrice: 0,
      currentPrice: 0,
      image: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Add New Skin</DialogTitle>
          <DialogDescription className="text-white/70">
            Add a new skin to your inventory
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 block mb-2">Skin Name*</label>
            <Input 
              value={newSkin.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="bg-black/20 border-white/10"
              placeholder="e.g. AWP | Dragon Lore"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Float Value</label>
              <Input 
                value={newSkin.float}
                onChange={(e) => handleInputChange(e, 'float')}
                className="bg-black/20 border-white/10"
                placeholder="0.0000"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-2">Wear</label>
              <select
                value={newSkin.wear}
                onChange={handleSelectChange}
                className="w-full h-10 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {wearOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Purchase Price ($)</label>
              <Input 
                type="number"
                value={newSkin.purchasePrice}
                onChange={(e) => handleInputChange(e, 'purchasePrice')}
                className="bg-black/20 border-white/10"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-2">Market Value ($)</label>
              <Input 
                type="number"
                value={newSkin.currentPrice}
                onChange={(e) => handleInputChange(e, 'currentPrice')}
                className="bg-black/20 border-white/10"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/70 block mb-2">Image URL (optional)</label>
            <Input 
              value={newSkin.image}
              onChange={(e) => handleInputChange(e, 'image')}
              className="bg-black/20 border-white/10"
              placeholder="https://example.com/skin-image.png"
            />
          </div>
          
          <div>
            <label className="text-sm text-white/70 block mb-2">Acquisition Date</label>
            <Input 
              type="date"
              className="bg-black/20 border-white/10"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/10"
          >
            Cancel
          </Button>
          <Button 
            className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30"
            onClick={handleSubmit}
          >
            <Plus size={16} className="mr-2" />
            Add to Inventory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkinModal;
