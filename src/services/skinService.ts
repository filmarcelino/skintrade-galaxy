
import { supabase } from "@/integrations/supabase/client";
import { Skin, Transaction } from "@/types/skin";

export const fetchUserSkins = async (): Promise<Skin[]> => {
  const { data, error } = await supabase
    .from('skins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching skins:', error);
    throw error;
  }

  // Calculate profit/loss for each skin
  return data.map(skin => ({
    ...skin,
    profitLoss: skin.current_price - skin.purchase_price
  }));
};

export const addSkin = async (skin: Omit<Skin, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Skin> => {
  const { data, error } = await supabase
    .from('skins')
    .insert([skin])
    .select()
    .single();

  if (error) {
    console.error('Error adding skin:', error);
    throw error;
  }

  // Add transaction record for the purchase
  await addTransaction({
    skin_id: data.id,
    transaction_type: 'buy',
    amount: data.purchase_price,
    notes: `Purchased ${data.name}`
  });

  return {
    ...data,
    profitLoss: data.current_price - data.purchase_price
  };
};

export const updateSkin = async (id: number, skin: Partial<Skin>): Promise<Skin> => {
  const { data, error } = await supabase
    .from('skins')
    .update(skin)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating skin:', error);
    throw error;
  }

  return {
    ...data,
    profitLoss: data.current_price - data.purchase_price
  };
};

export const deleteSkin = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('skins')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting skin:', error);
    throw error;
  }
};

export const sellSkin = async (id: number, salePrice: number, notes?: string): Promise<void> => {
  // Get the skin first
  const { data: skin, error: skinError } = await supabase
    .from('skins')
    .select('*')
    .eq('id', id)
    .single();

  if (skinError) {
    console.error('Error fetching skin for sale:', skinError);
    throw skinError;
  }

  // Add transaction record for the sale
  await addTransaction({
    skin_id: id,
    transaction_type: 'sell',
    amount: salePrice,
    notes: notes || `Sold ${skin.name} for $${salePrice}`
  });

  // Delete the skin from inventory
  await deleteSkin(id);
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return data;
};
