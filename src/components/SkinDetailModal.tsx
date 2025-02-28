
import { useState, useEffect } from 'react';
import { Skin } from '@/lib/types';
import { Edit, Trash2, X, ShoppingCart, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SkinDetailModalProps {
  skin: Skin | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedSkin: Skin) => void;
  onDelete: (skinId: number) => void;
}

const SkinDetailModal = ({ skin, isOpen, onClose, onEdit, onDelete }: SkinDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkin, setEditedSkin] = useState<Skin | null>(null);
  
  useEffect(() => {
    if (skin) {
      setEditedSkin(skin);
    }
  }, [skin]);
  
  if (!skin || !editedSkin) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (!editedSkin) return;
    
    const value = e.target.type === 'number' 
      ? parseFloat(e.target.value)
      : e.target.value;
    
    setEditedSkin({ ...editedSkin, [field]: value });
  };
  
  const handleSaveChanges = () => {
    if (!editedSkin) return;
    
    onEdit(editedSkin);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    onDelete(skin.id);
    onClose();
  };
  
  const profitColorClass = editedSkin.profitLoss >= 0 ? 'text-green-500' : 'text-red-500';
  const profitPrefix = editedSkin.profitLoss >= 0 ? '+' : '';
  const profitPercentage = editedSkin.purchasePrice > 0 
    ? (editedSkin.profitLoss / editedSkin.purchasePrice) * 100 
    : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{skin.name}</DialogTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 p-0 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 p-0 w-8 hover:text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 p-0 w-8"
                onClick={() => {
                  setIsEditing(false);
                  setEditedSkin(skin);
                }}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Skin image */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
              <img 
                src={skin.image} 
                alt={skin.name} 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.5))' }}
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Skin details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Float Value</label>
              {isEditing ? (
                <Input 
                  value={editedSkin.float}
                  onChange={(e) => handleInputChange(e, 'float')}
                  className="bg-black/20 border-white/10"
                />
              ) : (
                <div className="font-mono bg-black/20 border border-white/10 p-2 rounded-md">
                  {skin.float}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-2">Wear</label>
              {isEditing ? (
                <Input 
                  value={editedSkin.wear}
                  onChange={(e) => handleInputChange(e, 'wear')}
                  className="bg-black/20 border-white/10"
                />
              ) : (
                <div className="bg-black/20 border border-white/10 p-2 rounded-md">
                  {skin.wear}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Purchase Price</label>
              {isEditing ? (
                <Input 
                  type="number"
                  value={editedSkin.purchasePrice}
                  onChange={(e) => handleInputChange(e, 'purchasePrice')}
                  className="bg-black/20 border-white/10"
                  min="0"
                  step="0.01"
                />
              ) : (
                <div className="font-mono bg-black/20 border border-white/10 p-2 rounded-md">
                  ${skin.purchasePrice.toFixed(2)}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-2">Current Market Value</label>
              {isEditing ? (
                <Input 
                  type="number"
                  value={editedSkin.currentPrice}
                  onChange={(e) => handleInputChange(e, 'currentPrice')}
                  className="bg-black/20 border-white/10"
                  min="0"
                  step="0.01"
                />
              ) : (
                <div className="font-mono bg-black/20 border border-white/10 p-2 rounded-md">
                  ${skin.currentPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/70 block mb-2">Profit/Loss</label>
            <div className={`font-mono bg-black/20 border border-white/10 p-2 rounded-md ${profitColorClass}`}>
              {profitPrefix}${editedSkin.profitLoss.toFixed(2)} ({profitPrefix}{profitPercentage.toFixed(2)}%)
            </div>
          </div>
          
          <div>
            <label className="text-sm text-white/70 block mb-2">Notes</label>
            {isEditing ? (
              <Textarea 
                value={editedSkin.notes || ''}
                onChange={(e) => handleInputChange(e, 'notes')}
                className="bg-black/20 border-white/10 min-h-[100px]"
                placeholder="Add notes about this skin..."
              />
            ) : (
              <div className="bg-black/20 border border-white/10 p-2 rounded-md min-h-[60px]">
                {skin.notes || 'No notes added.'}
              </div>
            )}
          </div>
          
          {isEditing && (
            <div>
              <label className="text-sm text-white/70 block mb-2">Image URL</label>
              <Input 
                value={editedSkin.image}
                onChange={(e) => handleInputChange(e, 'image')}
                className="bg-black/20 border-white/10"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          {isEditing ? (
            <Button 
              onClick={handleSaveChanges}
              className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30"
            >
              Save Changes
            </Button>
          ) : (
            <div className="flex w-full justify-between">
              <div>
                <Button 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  onClick={() => window.open(`https://steamcommunity.com/market/listings/730/${encodeURIComponent(skin.name)}`, '_blank')}
                >
                  <ExternalLink size={16} className="mr-2" />
                  View on Market
                </Button>
              </div>
              <Button 
                onClick={onClose}
                className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30"
              >
                <ShoppingCart size={16} className="mr-2" />
                Sell Item
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkinDetailModal;
