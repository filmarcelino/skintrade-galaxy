
import { Skin } from '@/types/skin';
import { useSkinData } from '@/hooks/useSkinData';
import { useSkinMutations } from '@/hooks/useSkinMutations';
import { useSkinDialogs } from '@/hooks/useSkinDialogs';
import { useSkinActions } from '@/hooks/useSkinActions';

export const useInventory = () => {
  // Get data from smaller, focused hooks
  const {
    skinsData,
    isLoading,
    isError,
    error,
    loadedImages,
    setLoadedImages,
    isUsingDemoData,
    totalValue,
    totalProfit,
    profitPercentage
  } = useSkinData();
  
  const {
    addSkinMutation,
    updateSkinMutation,
    deleteSkinMutation,
    sellSkinMutation,
    handleOperation
  } = useSkinMutations(isUsingDemoData);
  
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
  
  const { handleInspect } = useSkinActions();
  
  // Handler functions that combine the functionality from smaller hooks
  const handleDeleteSkin = (skinId: number) => {
    if (handleOperation('delete', 'Deletion would work in a real app with auth')) {
      setSelectedSkin(null);
      return;
    }
    
    deleteSkinMutation.mutate(skinId);
  };
  
  const handleSaveSkinEdit = () => {
    if (!editSkinData) return;
    
    if (handleOperation('update', 'Updates would work in a real app with auth')) {
      setIsEditDialogOpen(false);
      return;
    }
    
    updateSkinMutation.mutate({ 
      id: editSkinData.id, 
      data: { 
        name: editSkinData.name,
        float: editSkinData.float,
        wear: editSkinData.wear,
        purchase_price: editSkinData.purchase_price,
        current_price: editSkinData.current_price,
        notes: editSkinData.notes,
        pattern: editSkinData.pattern,
        stickers: editSkinData.stickers,
        rarity: editSkinData.rarity,
        collection: editSkinData.collection
      } 
    });
  };
  
  const handleSaveNewSkin = () => {
    if (handleOperation('add', `In a real app with auth, ${newSkinData.name} would be added to your inventory`)) {
      setIsAddSellDialogOpen(false);
      return;
    }
    
    addSkinMutation.mutate({ 
      name: newSkinData.name,
      float: newSkinData.float,
      wear: newSkinData.wear,
      purchase_price: newSkinData.purchase_price,
      current_price: newSkinData.current_price,
      image: newSkinData.image || 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/130fx97f/image.png',
      notes: newSkinData.notes,
      pattern: newSkinData.pattern,
      stickers: newSkinData.stickers,
      rarity: newSkinData.rarity,
      collection: newSkinData.collection,
      trend: 'up' // Ensure trend is explicitly set to an allowed value
    });
  };
  
  const handleSellSkin = () => {
    if (!selectedSkin) return;
    
    if (handleOperation('sell', `In a real app with auth, ${selectedSkin.name} would be sold from your inventory`)) {
      setIsAddSellDialogOpen(false);
      return;
    }
    
    sellSkinMutation.mutate({
      id: selectedSkin.id,
      price: saleData.salePrice,
      notes: saleData.notes
    });
  };

  return {
    // Data
    skinsData,
    isLoading,
    isError,
    error,
    loadedImages,
    setLoadedImages,
    isUsingDemoData,
    totalValue,
    totalProfit,
    profitPercentage,
    
    // UI state
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
    
    // Handlers
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
