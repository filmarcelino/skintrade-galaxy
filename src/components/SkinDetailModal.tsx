
import { useState } from 'react';
import { Skin } from '@/lib/types';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SkinDetailModalProps {
  skin: Skin | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (skin: Skin) => void;
  onDelete: (skinId: number) => void;
}

const SkinDetailModal = ({ skin, isOpen, onClose, onEdit, onDelete }: SkinDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkin, setEditedSkin] = useState<Skin | null>(null);
  const { toast } = useToast();

  // Initialize editedSkin when skin changes
  useState(() => {
    if (skin) {
      setEditedSkin({ ...skin });
    }
  });

  const handleInspect = (skinName: string) => {
    toast({
      title: 'Inspect Weapon',
      description: `Opening inspection for ${skinName}`,
      variant: 'default',
    });
    // Simulate opening the inspection link
    setTimeout(() => {
      window.open(`https://steamcommunity.com/market/listings/730/${encodeURIComponent(skinName)}`, '_blank');
    }, 500);
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedSkin({ ...skin! });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = () => {
    if (editedSkin) {
      onEdit(editedSkin);
      setIsEditing(false);
      toast({
        title: "Changes Saved",
        description: "Your skin details have been updated",
        variant: "default",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Skin) => {
    if (!editedSkin) return;

    const value = e.target.type === 'number' 
      ? parseFloat(e.target.value) 
      : e.target.value;
    
    setEditedSkin({ ...editedSkin, [field]: value });
  };

  // Guard against null skin
  if (!skin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? 'Edit Skin' : skin.name}</DialogTitle>
          <DialogDescription className="text-white/70">
            {isEditing ? 'Update information about your skin' : 'Detailed information about this skin'}
          </DialogDescription>
        </DialogHeader>
        
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center col-span-1">
              <div className="w-48 h-48 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-glow-lg mb-4">
                <img 
                  src={skin.image} 
                  alt={skin.name} 
                  className="w-full h-full object-contain" 
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.7))' }}
                  loading="lazy"
                />
              </div>
              
              <div className="space-y-2 w-full">
                <Button 
                  className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl"
                  onClick={() => handleInspect(skin.name)}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Inspect in-game
                </Button>
                <Button 
                  className="w-full bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl"
                  onClick={handleEditStart}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Details
                </Button>
                <Button 
                  className="w-full bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl"
                  onClick={() => {
                    onDelete(skin.id);
                    onClose();
                  }}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Skin
                </Button>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Float Value</div>
                  <div className="font-mono text-xl">{skin.float}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Wear</div>
                  <div className="text-xl">{skin.wear}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Purchase Price</div>
                  <div className="font-mono text-xl">${skin.purchasePrice.toFixed(2)}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Current Price</div>
                  <div className="font-mono text-xl">${skin.currentPrice.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Profit/Loss</div>
                <div className={`font-mono text-2xl ${skin.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {skin.profitLoss >= 0 ? '+' : ''}${skin.profitLoss.toFixed(2)} 
                  <span className="text-sm ml-2">
                    ({((skin.profitLoss / skin.purchasePrice) * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm mb-2">Price History (30 days)</div>
                <div className="h-24 flex items-end space-x-1">
                  {/* Simple bar chart visualization */}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = 30 + Math.random() * 70;
                    const isCurrent = i === 29;
                    return (
                      <div 
                        key={i} 
                        style={{ height: `${height}%` }}
                        className={`w-full ${
                          isCurrent ? 'bg-neon-blue' : 
                          skin.trend === 'up' ? 'bg-green-500/50' : 'bg-red-500/50'
                        } rounded-t-sm`}
                      ></div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Additional Information</div>
                <div className="text-white">
                  <p>Acquired on June 15, 2023</p>
                  <p>Pattern Index: 661</p>
                  <p>Stickers: None</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Float Value</label>
                <Input 
                  value={editedSkin?.float}
                  onChange={(e) => handleInputChange(e, 'float')}
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-2">Wear</label>
                <Input 
                  value={editedSkin?.wear}
                  onChange={(e) => handleInputChange(e, 'wear')}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Purchase Price ($)</label>
                <Input 
                  type="number"
                  value={editedSkin?.purchasePrice}
                  onChange={(e) => handleInputChange(e, 'purchasePrice')}
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-2">Current Price ($)</label>
                <Input 
                  type="number"
                  value={editedSkin?.currentPrice}
                  onChange={(e) => handleInputChange(e, 'currentPrice')}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-white/70 block mb-2">Acquisition Date</label>
              <Input 
                type="date"
                className="bg-black/20 border-white/10"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 block mb-2">Notes</label>
              <Input 
                className="bg-black/20 border-white/10"
                placeholder="Add any additional notes about this skin"
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleEditCancel}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button 
                className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30"
                onClick={handleEditSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <DialogClose className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl px-4 py-2">
              Close
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkinDetailModal;
