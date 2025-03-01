
import { useState } from 'react';
import { Skin } from '@/types/skin';

export const useSkinDialogs = () => {
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSkinData, setEditSkinData] = useState<Skin | null>(null);
  const [isAddSellDialogOpen, setIsAddSellDialogOpen] = useState(false);
  const [newSkinData, setNewSkinData] = useState({
    name: '',
    float: '0.0000',
    wear: 'Factory New',
    purchase_price: 0,
    current_price: 0,
    image: '',
    notes: '',
    pattern: '',
    stickers: '',
    rarity: '',
    collection: '',
  });
  const [saleData, setSaleData] = useState({
    salePrice: 0,
    notes: ''
  });
  const [actionType, setActionType] = useState<'add' | 'sell'>('add');

  // Handler functions
  const handleOpenSkinDetails = (skin: Skin) => {
    setSelectedSkin(skin);
  };
  
  const handleEditSkin = (skin: Skin) => {
    setEditSkinData({...skin});
    setIsEditDialogOpen(true);
  };
  
  const handleOpenAddSellDialog = (type: 'add' | 'sell', skin?: Skin) => {
    setActionType(type);
    if (type === 'add') {
      setNewSkinData({
        name: '',
        float: '0.0000',
        wear: 'Factory New',
        purchase_price: 0,
        current_price: 0,
        image: '',
        notes: '',
        pattern: '',
        stickers: '',
        rarity: '',
        collection: ''
      });
    } else if (type === 'sell' && skin) {
      setSaleData({
        salePrice: skin.current_price,
        notes: `Sold ${skin.name}`
      });
    }
    setSelectedSkin(skin || null);
    setIsAddSellDialogOpen(true);
  };

  return {
    selectedSkin,
    setSelectedSkin,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editSkinData,
    setEditSkinData,
    isAddSellDialogOpen,
    setIsAddSellDialogOpen,
    newSkinData,
    setNewSkinData,
    saleData,
    setSaleData,
    actionType,
    setActionType,
    handleOpenSkinDetails,
    handleEditSkin,
    handleOpenAddSellDialog
  };
};
