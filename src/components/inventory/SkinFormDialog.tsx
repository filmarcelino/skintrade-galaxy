
import { Skin } from "@/types/skin";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SkinFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'add' | 'sell' | 'edit';
  selectedSkin: Skin | null;
  newSkinData: {
    name: string;
    float: string;
    wear: string;
    purchase_price: number;
    current_price: number;
    image: string;
    notes: string;
  };
  setNewSkinData: (data: any) => void;
  editSkinData: Skin | null;
  setEditSkinData: (data: Skin | null) => void;
  saleData: {
    salePrice: number;
    notes: string;
  };
  setSaleData: (data: any) => void;
  handleSaveNewSkin: () => void;
  handleSaveSkinEdit: () => void;
  handleSellSkin: () => void;
}

export const SkinFormDialog = ({
  isOpen,
  onClose,
  actionType,
  selectedSkin,
  newSkinData,
  setNewSkinData,
  editSkinData,
  setEditSkinData,
  saleData,
  setSaleData,
  handleSaveNewSkin,
  handleSaveSkinEdit,
  handleSellSkin,
}: SkinFormDialogProps) => {
  const getTitle = () => {
    if (actionType === 'add') return "Add New Skin";
    if (actionType === 'sell') return "Sell Skin";
    return "Edit Skin";
  };

  const getDescription = () => {
    if (actionType === 'add') return "Add a new skin to your inventory";
    if (actionType === 'sell') return `Sell ${selectedSkin?.name} from your inventory`;
    return "Edit the details of your skin";
  };

  const renderContent = () => {
    if (actionType === 'add') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-white/70">Name</label>
            <Input
              id="name"
              className="col-span-3 bg-black/20 border-white/10"
              value={newSkinData.name}
              onChange={(e) => setNewSkinData({ ...newSkinData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="float" className="text-right text-white/70">Float</label>
            <Input
              id="float"
              className="col-span-3 bg-black/20 border-white/10"
              value={newSkinData.float}
              onChange={(e) => setNewSkinData({ ...newSkinData, float: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="wear" className="text-right text-white/70">Wear</label>
            <Input
              id="wear"
              className="col-span-3 bg-black/20 border-white/10"
              value={newSkinData.wear}
              onChange={(e) => setNewSkinData({ ...newSkinData, wear: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="purchasePrice" className="text-right text-white/70">Purchase Price</label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                id="purchasePrice"
                type="number"
                className="pl-10 bg-black/20 border-white/10"
                value={newSkinData.purchase_price.toString()}
                onChange={(e) => setNewSkinData({ ...newSkinData, purchase_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="currentPrice" className="text-right text-white/70">Current Price</label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                id="currentPrice"
                type="number"
                className="pl-10 bg-black/20 border-white/10"
                value={newSkinData.current_price.toString()}
                onChange={(e) => setNewSkinData({ ...newSkinData, current_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image" className="text-right text-white/70">Image URL</label>
            <Input
              id="image"
              className="col-span-3 bg-black/20 border-white/10"
              value={newSkinData.image}
              onChange={(e) => setNewSkinData({ ...newSkinData, image: e.target.value })}
              placeholder="https://example.com/image.png (leave empty for default)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right text-white/70">Notes</label>
            <Textarea
              id="notes"
              className="col-span-3 bg-black/20 border-white/10 min-h-[80px]"
              value={newSkinData.notes}
              onChange={(e) => setNewSkinData({ ...newSkinData, notes: e.target.value })}
              placeholder="Optional notes about this skin"
            />
          </div>
        </div>
      );
    } else if (actionType === 'sell' && selectedSkin) {
      return (
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
              <img 
                src={selectedSkin.image} 
                alt={selectedSkin.name} 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.5))' }}
              />
            </div>
          </div>
          <div className="text-center mb-2">
            <div className="font-medium text-lg">{selectedSkin.name}</div>
            <div className="text-white/60 text-sm">Current value: ${typeof selectedSkin.current_price === 'number' ? selectedSkin.current_price.toFixed(2) : selectedSkin.current_price}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="salePrice" className="text-right text-white/70">Sale Price</label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                id="salePrice"
                type="number"
                className="pl-10 bg-black/20 border-white/10"
                value={saleData.salePrice.toString()}
                onChange={(e) => setSaleData({ ...saleData, salePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right text-white/70">Notes</label>
            <Textarea
              id="notes"
              className="col-span-3 bg-black/20 border-white/10 min-h-[80px]"
              value={saleData.notes}
              onChange={(e) => setSaleData({ ...saleData, notes: e.target.value })}
              placeholder="Optional notes about this sale"
            />
          </div>
        </div>
      );
    } else if (actionType === 'edit' && editSkinData) {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-white/70">Name</label>
            <Input
              id="name"
              className="col-span-3 bg-black/20 border-white/10"
              value={editSkinData.name}
              onChange={(e) => setEditSkinData({ ...editSkinData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="float" className="text-right text-white/70">Float</label>
            <Input
              id="float"
              className="col-span-3 bg-black/20 border-white/10"
              value={editSkinData.float}
              onChange={(e) => setEditSkinData({ ...editSkinData, float: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="wear" className="text-right text-white/70">Wear</label>
            <Input
              id="wear"
              className="col-span-3 bg-black/20 border-white/10"
              value={editSkinData.wear}
              onChange={(e) => setEditSkinData({ ...editSkinData, wear: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="purchasePrice" className="text-right text-white/70">Purchase Price</label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                id="purchasePrice"
                type="number"
                className="pl-10 bg-black/20 border-white/10"
                value={editSkinData.purchase_price.toString()}
                onChange={(e) => setEditSkinData({ ...editSkinData, purchase_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="currentPrice" className="text-right text-white/70">Current Price</label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                id="currentPrice"
                type="number"
                className="pl-10 bg-black/20 border-white/10"
                value={editSkinData.current_price.toString()}
                onChange={(e) => setEditSkinData({ ...editSkinData, current_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right text-white/70">Notes</label>
            <Textarea
              id="notes"
              className="col-span-3 bg-black/20 border-white/10 min-h-[80px]"
              value={editSkinData.notes || ''}
              onChange={(e) => setEditSkinData({ ...editSkinData, notes: e.target.value })}
              placeholder="Optional notes about this skin"
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderFooter = () => {
    if (actionType === 'add') {
      return (
        <Button 
          onClick={handleSaveNewSkin} 
          className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl"
        >
          Add Skin
        </Button>
      );
    } else if (actionType === 'sell') {
      return (
        <Button 
          onClick={handleSellSkin}
          className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl"
        >
          Sell Skin
        </Button>
      );
    } else {
      return (
        <Button 
          onClick={handleSaveSkinEdit}
          className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl"
        >
          Save Changes
        </Button>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-white/70">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/10 hover:bg-white/10"
          >
            Cancel
          </Button>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
