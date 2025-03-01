
import { useQuery } from '@tanstack/react-query';
import { Skin } from '@/types/skin';
import { fetchUserSkins } from '@/services/skinService';
import { SAMPLE_SKINS } from '@/lib/data/sampleSkins';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSkinData = () => {
  const [isUsingDemoData, setIsUsingDemoData] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
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
  
  // Calculate portfolio statistics
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
