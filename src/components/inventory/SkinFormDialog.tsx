
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Skin } from "@/types/skin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkinFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'add' | 'edit' | 'sell';
  selectedSkin: Skin | null;
  newSkinData: any;
  setNewSkinData: (data: any) => void;
  editSkinData: Skin | null;
  setEditSkinData: (data: Skin | null) => void;
  saleData: any;
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
  handleSellSkin
}: SkinFormDialogProps) => {
  const { t } = useI18n();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleAddInputChange = (field: string, value: string | number) => {
    setNewSkinData({
      ...newSkinData,
      [field]: value,
    });
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };
  
  const handleEditInputChange = (field: string, value: string | number) => {
    if (!editSkinData) return;
    
    setEditSkinData({
      ...editSkinData,
      [field]: value,
    });
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };
  
  const handleSaleInputChange = (field: string, value: string | number) => {
    setSaleData({
      ...saleData,
      [field]: value,
    });
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (actionType === 'add') {
      if (!newSkinData.name) errors.name = 'Name is required';
      if (!newSkinData.float) errors.float = 'Float is required';
      if (!newSkinData.wear) errors.wear = 'Wear is required';
      if (!newSkinData.purchase_price) errors.purchase_price = 'Purchase price is required';
      if (!newSkinData.current_price) errors.current_price = 'Current price is required';
    } else if (actionType === 'edit') {
      if (!editSkinData?.name) errors.name = 'Name is required';
      if (!editSkinData?.float) errors.float = 'Float is required';
      if (!editSkinData?.wear) errors.wear = 'Wear is required';
      if (!editSkinData?.purchase_price) errors.purchase_price = 'Purchase price is required';
      if (!editSkinData?.current_price) errors.current_price = 'Current price is required';
    } else if (actionType === 'sell') {
      if (!saleData.salePrice) errors.salePrice = 'Sale price is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (actionType === 'add') {
      handleSaveNewSkin();
    } else if (actionType === 'edit') {
      handleSaveSkinEdit();
    } else if (actionType === 'sell') {
      handleSellSkin();
    }
  };
  
  const renderAddEditForm = () => {
    const data = actionType === 'add' ? newSkinData : editSkinData;
    const handleChange = actionType === 'add' ? handleAddInputChange : handleEditInputChange;
    
    if (!data) return null;
    
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="AWP | Dragon Lore"
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="float">{t('floatValue')}</Label>
            <Input
              id="float"
              value={data.float}
              onChange={(e) => handleChange('float', e.target.value)}
              placeholder="0.0132"
              className={validationErrors.float ? 'border-red-500' : ''}
            />
            {validationErrors.float && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.float}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wear">{t('wear')}</Label>
            <Select
              value={data.wear}
              onValueChange={(value) => handleChange('wear', value)}
            >
              <SelectTrigger className={validationErrors.wear ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select wear" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Factory New">Factory New</SelectItem>
                  <SelectItem value="Minimal Wear">Minimal Wear</SelectItem>
                  <SelectItem value="Field-Tested">Field-Tested</SelectItem>
                  <SelectItem value="Well-Worn">Well-Worn</SelectItem>
                  <SelectItem value="Battle-Scarred">Battle-Scarred</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {validationErrors.wear && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.wear}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pattern">{t('pattern')}</Label>
            <Input
              id="pattern"
              value={data.pattern || ''}
              onChange={(e) => handleChange('pattern', e.target.value)}
              placeholder="661"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_price">{t('purchasePrice')}</Label>
            <Input
              id="purchase_price"
              type="number"
              value={data.purchase_price}
              onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value))}
              placeholder="1000.00"
              className={validationErrors.purchase_price ? 'border-red-500' : ''}
            />
            {validationErrors.purchase_price && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.purchase_price}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current_price">{t('currentPrice')}</Label>
            <Input
              id="current_price"
              type="number"
              value={data.current_price}
              onChange={(e) => handleChange('current_price', parseFloat(e.target.value))}
              placeholder="1200.00"
              className={validationErrors.current_price ? 'border-red-500' : ''}
            />
            {validationErrors.current_price && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.current_price}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rarity">{t('rarity')}</Label>
            <Select
              value={data.rarity || ''}
              onValueChange={(value) => handleChange('rarity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Consumer">Consumer Grade</SelectItem>
                  <SelectItem value="Industrial">Industrial Grade</SelectItem>
                  <SelectItem value="Mil-Spec">Mil-Spec Grade</SelectItem>
                  <SelectItem value="Restricted">Restricted</SelectItem>
                  <SelectItem value="Classified">Classified</SelectItem>
                  <SelectItem value="Covert">Covert</SelectItem>
                  <SelectItem value="Contraband">Contraband</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collection">{t('collection')}</Label>
            <Input
              id="collection"
              value={data.collection || ''}
              onChange={(e) => handleChange('collection', e.target.value)}
              placeholder="The Cobblestone Collection"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stickers">{t('stickers')}</Label>
          <Input
            id="stickers"
            value={data.stickers || ''}
            onChange={(e) => handleChange('stickers', e.target.value)}
            placeholder="Titan (Holo) | Katowice 2014"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={data.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/image.png"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add notes about this skin"
            className="min-h-[100px]"
          />
        </div>
      </div>
    );
  };
  
  const renderSellForm = () => {
    if (!selectedSkin) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
            <img 
              src={selectedSkin.image} 
              alt={selectedSkin.name} 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">{selectedSkin.name}</h3>
            <p className="text-sm text-white/60">{selectedSkin.float} | {selectedSkin.wear}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input
            id="salePrice"
            type="number"
            value={saleData.salePrice}
            onChange={(e) => handleSaleInputChange('salePrice', parseFloat(e.target.value))}
            placeholder="1200.00"
            className={validationErrors.salePrice ? 'border-red-500' : ''}
          />
          {validationErrors.salePrice && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.salePrice}</p>
          )}
        </div>
        
        <div className="rounded-lg bg-white/5 p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white/60">Purchase Price:</span>
            <span className="font-mono">${typeof selectedSkin.purchase_price === 'number' ? selectedSkin.purchase_price.toFixed(2) : selectedSkin.purchase_price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-white/60">Current Market Price:</span>
            <span className="font-mono">${typeof selectedSkin.current_price === 'number' ? selectedSkin.current_price.toFixed(2) : selectedSkin.current_price}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-white/10">
            <span>Profit/Loss:</span>
            <span className={`font-mono ${saleData.salePrice >= selectedSkin.purchase_price ? 'text-green-500' : 'text-red-500'}`}>
              {saleData.salePrice >= selectedSkin.purchase_price ? '+' : ''}
              ${(saleData.salePrice - selectedSkin.purchase_price).toFixed(2)}
              <span className="text-xs ml-1">
                ({(((saleData.salePrice - selectedSkin.purchase_price) / selectedSkin.purchase_price) * 100).toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="saleNotes">Notes</Label>
          <Textarea
            id="saleNotes"
            value={saleData.notes}
            onChange={(e) => handleSaleInputChange('notes', e.target.value)}
            placeholder="Add notes about this sale"
            className="min-h-[100px]"
          />
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#14141f] border border-white/10 text-white max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'add' && t('addSkin')}
            {actionType === 'edit' && t('editSkin')}
            {actionType === 'sell' && t('sellSkin')}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {actionType === 'add' && t('addToInventory')}
            {actionType === 'edit' && t('saveChanges')}
            {actionType === 'sell' && t('sellFromInventory')}
          </DialogDescription>
        </DialogHeader>
        
        {actionType === 'add' || actionType === 'edit' ? renderAddEditForm() : renderSellForm()}
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/20 hover:bg-white/10"
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            className={`px-6 ${
              actionType === 'add' 
                ? 'bg-neon-green/20 hover:bg-neon-green/40 border border-neon-green/30' 
                : actionType === 'edit'
                  ? 'bg-neon-blue/20 hover:bg-neon-blue/40 border border-neon-blue/30'
                  : 'bg-neon-red/20 hover:bg-neon-red/40 border border-neon-red/30'
            }`}
          >
            {actionType === 'add' && t('addSkin')}
            {actionType === 'edit' && t('saveChanges')}
            {actionType === 'sell' && t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
