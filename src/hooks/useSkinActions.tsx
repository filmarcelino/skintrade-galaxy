
import { useToast } from '@/hooks/use-toast';
import { Skin } from '@/types/skin';
import { useSkinMutations } from './useSkinMutations';
import { useSkinDialogs } from './useSkinDialogs';

export const useSkinActions = () => {
  const { toast } = useToast();
  const {
    addSkinMutation,
    updateSkinMutation,
    deleteSkinMutation,
    sellSkinMutation
  } = useSkinMutations();
  
  const {
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
  } = useSkinDialogs();
  
  const handleDeleteSkin = (skinId: number) => {
    deleteSkinMutation.mutate(skinId);
    setSelectedSkin(null);
  };
  
  const handleSaveSkinEdit = () => {
    if (!editSkinData) return;
    
    updateSkinMutation.mutate({ 
      id: editSkinData.id, 
      data: { 
        name: editSkinData.name,
        float: editSkinData.float,
        wear: editSkinData.wear,
        purchase_price: editSkinData.purchase_price,
        current_price: editSkinData.current_price,
        notes: editSkinData.notes
      } 
    });
    
    setIsEditDialogOpen(false);
  };
  
  const handleSaveNewSkin = () => {
    addSkinMutation.mutate({ 
      name: newSkinData.name,
      float: newSkinData.float,
      wear: newSkinData.wear,
      purchase_price: newSkinData.purchase_price,
      current_price: newSkinData.current_price,
      image: newSkinData.image || 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/130fx97f/image.png',
      notes: newSkinData.notes,
      trend: 'up'
    });
    
    setIsAddSellDialogOpen(false);
  };
  
  const handleSellSkin = () => {
    if (!selectedSkin) return;
    
    sellSkinMutation.mutate({
      id: selectedSkin.id,
      price: saleData.salePrice,
      notes: saleData.notes
    });
    
    setIsAddSellDialogOpen(false);
  };
  
  const handleInspect = (skinName: string) => {
    toast({
      title: 'Inspect Weapon',
      description: `Opening inspection for ${skinName}`,
      variant: 'default',
    });
    // Simulate opening the inspection link
    setTimeout(() => {
      window.open(`https://steamcommunity.com/market/listings/730/${encodeURIComponent(skinName)}`, '_blank');
    }, 100);
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
    handleOpenSkinDetails,
    handleEditSkin,
    handleDeleteSkin,
    handleSaveSkinEdit,
    handleOpenAddSellDialog,
    handleSaveNewSkin,
    handleSellSkin,
    handleInspect
  };
};
