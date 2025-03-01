
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSkin, updateSkin, deleteSkin, sellSkin } from '@/services/skinService';
import { Skin } from '@/types/skin';
import { useToast } from '@/hooks/use-toast';

export const useSkinMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addSkinMutation = useMutation({
    mutationFn: (skinData: Omit<Skin, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => addSkin(skinData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Skin Added",
        description: "The skin has been added to your inventory",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Error adding skin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add skin. Please try again.",
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
    },
    onError: (error: any) => {
      console.error('Error updating skin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update skin. Please try again.",
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
    },
    onError: (error: any) => {
      console.error('Error deleting skin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete skin. Please try again.",
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
    },
    onError: (error: any) => {
      console.error('Error selling skin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sell skin. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  return {
    addSkinMutation,
    updateSkinMutation,
    deleteSkinMutation,
    sellSkinMutation
  };
};
