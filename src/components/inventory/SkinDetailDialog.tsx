
import { Skin } from "@/types/skin";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SkinDetailDialogProps {
  selectedSkin: Skin | null;
  setSelectedSkin: (skin: Skin | null) => void;
  handleEditSkin: (skin: Skin) => void;
  handleDeleteSkin: (skinId: number) => void;
  handleInspect: (skinName: string) => void;
}

export const SkinDetailDialog = ({
  selectedSkin,
  setSelectedSkin,
  handleEditSkin,
  handleDeleteSkin,
  handleInspect
}: SkinDetailDialogProps) => {
  if (!selectedSkin) return null;
  
  return (
    <Dialog open={Boolean(selectedSkin)} onOpenChange={(open) => !open && setSelectedSkin(null)}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{selectedSkin.name}</DialogTitle>
          <DialogDescription className="text-white/70">
            Detailed information about this skin
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center col-span-1">
            <div className="w-48 h-48 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-glow-lg mb-4">
              <img 
                src={selectedSkin.image} 
                alt={selectedSkin.name} 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.7))' }}
              />
            </div>
            
            <div className="space-y-2 w-full">
              <Button 
                className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl"
                onClick={() => handleInspect(selectedSkin.name)}
              >
                <ExternalLink size={16} className="mr-2" />
                Inspect in-game
              </Button>
              <Button 
                className="w-full bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl"
                onClick={() => {
                  setSelectedSkin(null);
                  handleEditSkin(selectedSkin);
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit Details
              </Button>
              <Button 
                className="w-full bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl"
                onClick={() => {
                  handleDeleteSkin(selectedSkin.id);
                  setSelectedSkin(null);
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
                <div className="font-mono text-xl">{selectedSkin.float}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Wear</div>
                <div className="text-xl">{selectedSkin.wear}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Purchase Price</div>
                <div className="font-mono text-xl">${typeof selectedSkin.purchase_price === 'number' ? selectedSkin.purchase_price.toFixed(2) : selectedSkin.purchase_price}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Current Price</div>
                <div className="font-mono text-xl">${typeof selectedSkin.current_price === 'number' ? selectedSkin.current_price.toFixed(2) : selectedSkin.current_price}</div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-white/60 text-sm">Profit/Loss</div>
              <div className={`font-mono text-2xl ${(selectedSkin.profitLoss ?? (selectedSkin.current_price - selectedSkin.purchase_price)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {(selectedSkin.profitLoss ?? (selectedSkin.current_price - selectedSkin.purchase_price)) >= 0 ? '+' : ''}${(selectedSkin.profitLoss ?? (selectedSkin.current_price - selectedSkin.purchase_price)).toFixed(2)} 
                <span className="text-sm ml-2">
                  ({(((selectedSkin.profitLoss ?? (selectedSkin.current_price - selectedSkin.purchase_price)) / selectedSkin.purchase_price) * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
            
            {selectedSkin.notes && (
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="text-white/60 text-sm">Notes</div>
                <div className="mt-2">{selectedSkin.notes}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
