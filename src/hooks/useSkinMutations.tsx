
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skin } from '@/types/skin';
import { addSkin, updateSkin, deleteSkin, sellSkin } from '@/services/skinService';
import { useToast } from '@/hooks/use-toast';

export const useSkinMutations = (isUsingDemoData: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addSkinMutation = useMutation({
    mutationFn: (skinData: Omit<Skin, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => addSkin(skinData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      toast({
        title: "Skin Added",
        description: `${variables.name} has been added to your inventory`,
        variant: "default",
      });
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

  // Handle operations with demo mode notification
  const handleOperation = (operation: 'add' | 'update' | 'delete' | 'sell', message: string) => {
    if (isUsingDemoData) {
      toast({
        title: "Demo Mode",
        description: message,
        variant: "default",
      });
      return true; // Indicates operation should be skipped but UI should be updated
    }
    return false; // Indicates operation should proceed
  };

  return {
    addSkinMutation,
    updateSkinMutation,
    deleteSkinMutation,
    sellSkinMutation,
    handleOperation
  };
};
