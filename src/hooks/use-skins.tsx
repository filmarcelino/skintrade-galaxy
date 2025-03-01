
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type SkinCondition = 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred';

export type Skin = {
  id: number;
  name: string;
  image: string;
  purchase_price: number;
  current_price: number;
  wear: string;
  float: string;
  notes?: string;
  acquired_at?: string;
  trend?: string;
  user_id?: string;
};

export const useSkins = () => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSkins = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setSkins([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('skins')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSkins(data || []);
    } catch (err: any) {
      console.error('Error fetching skins:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSkin = async (newSkin: Omit<Skin, 'id'>) => {
    try {
      if (!user) {
        throw new Error('Must be logged in to add skins');
      }
      
      const skinWithUserId = {
        ...newSkin,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('skins')
        .insert([skinWithUserId])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSkins(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error adding skin:', err);
      throw err;
    }
  };

  const updateSkin = async (id: number, updates: Partial<Skin>) => {
    try {
      if (!user) {
        throw new Error('Must be logged in to update skins');
      }
      
      const { data, error } = await supabase
        .from('skins')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSkins(prev => prev.map(skin => skin.id === id ? data : skin));
      return data;
    } catch (err: any) {
      console.error('Error updating skin:', err);
      throw err;
    }
  };

  const deleteSkin = async (id: number) => {
    try {
      if (!user) {
        throw new Error('Must be logged in to delete skins');
      }
      
      const { error } = await supabase
        .from('skins')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setSkins(prev => prev.filter(skin => skin.id !== id));
    } catch (err: any) {
      console.error('Error deleting skin:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSkins();
    } else {
      setSkins([]);
      setLoading(false);
    }
  }, [user]);

  return {
    skins,
    loading,
    error,
    fetchSkins,
    addSkin,
    updateSkin,
    deleteSkin
  };
};
