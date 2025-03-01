
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skin } from '@/types/skin';
import { fetchUserSkins } from '@/services/skinService';
import { SAMPLE_SKINS } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { useSkinActions } from './useSkinActions';
import { useAuth } from '@/App';

export const useInventory = () => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const { session } = useAuth();
  
  // Get all skin-related actions
  const skinActions = useSkinActions();
  
  // Always use real data if user is logged in
  useEffect(() => {
    setIsUsingDemoData(!session);
  }, [session]);
  
  const queryFn = async (): Promise<Skin[]> => {
    if (isUsingDemoData) {
      // For demo mode, use sample skins
      return Promise.resolve(SAMPLE_SKINS.map(skin => ({
        ...skin,
        trend: skin.trend as 'up' | 'down' | null
      })));
    } else {
      // For real mode, fetch from database
      const data = await fetchUserSkins();
      return data.map(skin => ({
        ...skin,
        trend: skin.trend as 'up' | 'down' | null,
        // Add backward compatibility fields
        purchasePrice: skin.purchase_price,
        currentPrice: skin.current_price,
        profitLoss: skin.current_price - skin.purchase_price
      }));
    }
  };
  
  const { 
    data: skinsData, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['skins', session?.user?.id],
    queryFn,
    enabled: true
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

  return {
    ...skinActions,
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
  };
};
