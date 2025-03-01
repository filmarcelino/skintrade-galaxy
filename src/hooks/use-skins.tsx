
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Skin {
  id: number;
  name: string;
  wear: string;
  float: string;
  purchase_price: number;
  current_price: number;
  image: string;
  acquired_at?: string;
  notes?: string;
  trend?: string;
  user_id?: string;
}

export const useSkins = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const getSkins = async (): Promise<Skin[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("skins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching skins:", error);
      toast.error("Failed to load skins");
      throw error;
    }

    return data || [];
  };

  const addSkin = async (skin: Omit<Skin, "id">): Promise<Skin> => {
    if (!user) throw new Error("User not authenticated");
    
    const newSkin = {
      ...skin,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("skins")
      .insert([newSkin])
      .select()
      .single();

    if (error) {
      console.error("Error adding skin:", error);
      toast.error("Failed to add skin");
      throw error;
    }

    toast.success("Skin added successfully");
    return data;
  };

  const updateSkin = async (skin: Skin): Promise<Skin> => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("skins")
      .update(skin)
      .eq("id", skin.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating skin:", error);
      toast.error("Failed to update skin");
      throw error;
    }

    toast.success("Skin updated successfully");
    return data;
  };

  const deleteSkin = async (id: number): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from("skins")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting skin:", error);
      toast.error("Failed to delete skin");
      throw error;
    }

    toast.success("Skin deleted successfully");
  };

  const skinsQuery = useQuery({
    queryKey: ["skins", user?.id],
    queryFn: getSkins,
    enabled: !!user,
  });

  const addSkinMutation = useMutation({
    mutationFn: addSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins", user?.id] });
    },
  });

  const updateSkinMutation = useMutation({
    mutationFn: updateSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins", user?.id] });
    },
  });

  const deleteSkinMutation = useMutation({
    mutationFn: deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins", user?.id] });
    },
  });

  return {
    skins: skinsQuery.data || [],
    isLoading: skinsQuery.isLoading,
    isError: skinsQuery.isError,
    addSkin: addSkinMutation.mutate,
    updateSkin: updateSkinMutation.mutate,
    deleteSkin: deleteSkinMutation.mutate,
  };
};
