
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skin } from '@/types/skin';
import { fetchUserSkins, addSkin, updateSkin, deleteSkin, sellSkin } from '@/services/skinService';
import { SAMPLE_SKINS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
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
  });
  const [saleData, setSaleData] = useState({
    salePrice: 0,
    notes: ''
  });
  const [actionType, setActionType] = useState<'add' | 'sell'>('add');
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsUsingDemoData(!data.session);
      
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setIsUsingDemoData(!session);
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);
  
  const queryFn = async (): Promise<Skin[]> => {
    if (isUsingDemoData) {
      // Ensure SAMPLE_SKINS conforms to Skin type with correct trend handling
      return Promise.resolve(SAMPLE_SKINS.map(skin => ({
        ...skin,
        trend: skin.trend as 'up' | 'down' | null
      })));
    } else {
      const data = await fetchUserSkins();
      return data.map(skin => ({
        ...skin,
        trend: skin.trend as 'up' | 'down' | null
      }));
    }
  };
  
  const { 
    data: skinsData, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['skins'],
    queryFn,
    enabled: true
  });
  
  const addSkinMutation = useMutation({
    mutationFn: (skinData: Omit<Skin, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => addSkin(skinData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Skin Added",
        description: `${newSkinData.name} has been added to your inventory`,
        variant: "default",
      });
      setIsAddSellDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error adding skin:', error);
      toast({
        title: "Error",
        description: "Failed to add skin. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const updateSkinMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Skin> }) => updateSkin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Changes Saved",
        description: "Your skin details have been updated",
        variant: "default",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating skin:', error);
      toast({
        title: "Error",
        description: "Failed to update skin. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const deleteSkinMutation = useMutation({
    mutationFn: (id: number) => deleteSkin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Skin Deleted",
        description: "The skin has been removed from your inventory",
        variant: "default",
      });
      setSelectedSkin(null);
    },
    onError: (error) => {
      console.error('Error deleting skin:', error);
      toast({
        title: "Error",
        description: "Failed to delete skin. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const sellSkinMutation = useMutation({
    mutationFn: ({ id, price, notes }: { id: number, price: number, notes: string }) => 
      sellSkin(id, price, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Skin Sold",
        description: "The skin has been sold from your inventory",
        variant: "default",
      });
      setIsAddSellDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error selling skin:', error);
      toast({
        title: "Error",
        description: "Failed to sell skin. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    if (!skinsData) return;
    
    skinsData.forEach(skin => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [skin.id]: true
        }));
      };
      img.src = skin.image;
    });
  }, [skinsData]);
  
  const totalValue = skinsData 
    ? skinsData.reduce((total, skin) => total + (typeof skin.current_price === 'number' ? skin.current_price : 0), 0)
    : 0;
    
  const totalProfit = skinsData 
    ? skinsData.reduce((total, skin) => {
        const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
        return total + profitLoss;
      }, 0)
    : 0;
    
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  const handleOpenSkinDetails = (skin: Skin) => {
    setSelectedSkin(skin);
  };
  
  const handleEditSkin = (skin: Skin) => {
    setEditSkinData({...skin});
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteSkin = (skinId: number) => {
    if (isUsingDemoData) {
      toast({
        title: "Demo Mode",
        description: "Deletion would work in a real app with auth",
        variant: "default",
      });
      return;
    }
    
    deleteSkinMutation.mutate(skinId);
  };
  
  const handleSaveSkinEdit = () => {
    if (!editSkinData) return;
    
    if (isUsingDemoData) {
      toast({
        title: "Demo Mode",
        description: "Updates would work in a real app with auth",
        variant: "default",
      });
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
        notes: editSkinData.notes
      } 
    });
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
        notes: ''
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
  
  const handleSaveNewSkin = () => {
    if (isUsingDemoData) {
      toast({
        title: "Demo Mode",
        description: `In a real app with auth, ${newSkinData.name} would be added to your inventory`,
        variant: "default",
      });
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
      trend: 'up' // Ensure trend is explicitly set to an allowed value
    });
  };
  
  const handleSellSkin = () => {
    if (!selectedSkin) return;
    
    if (isUsingDemoData) {
      toast({
        title: "Demo Mode",
        description: `In a real app with auth, ${selectedSkin.name} would be sold from your inventory`,
        variant: "default",
      });
      setIsAddSellDialogOpen(false);
      return;
    }
    
    sellSkinMutation.mutate({
      id: selectedSkin.id,
      price: saleData.salePrice,
      notes: saleData.notes
    });
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
    }, 1000);
  };

  return {
    skinsData,
    isLoading,
    isError,
    error,
    loadedImages,
    setLoadedImages,
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
    isUsingDemoData,
    totalValue,
    totalProfit,
    profitPercentage,
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
