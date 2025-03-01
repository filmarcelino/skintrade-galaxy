
import { supabase } from "@/integrations/supabase/client";
import { Skin, Transaction } from "@/types/skin";
import { SAMPLE_SKINS } from "@/lib/constants";

export const fetchUserSkins = async (): Promise<Skin[]> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
  const { data, error } = await supabase
    .from('skins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching skins:', error);
    throw error;
  }

  // Calculate profit/loss for each skin and add backward compatibility fields
  return data.map(skin => ({
    ...skin,
    profitLoss: skin.current_price - skin.purchase_price,
    // Ensure trend is either 'up', 'down', or null
    trend: skin.trend as 'up' | 'down' | null,
    // Add backward compatibility fields
    purchasePrice: skin.purchase_price,
    currentPrice: skin.current_price,
    popularity: 'High' // Default value for TradeEvaluator
  }));
};

export const addSkin = async (skin: Omit<Skin, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Skin> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
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
    profitLoss: data.current_price - data.purchase_price,
    trend: data.trend as 'up' | 'down' | null,
    purchasePrice: data.purchase_price,
    currentPrice: data.current_price,
    popularity: 'High' // Default value
  };
};

export const updateSkin = async (id: number, skin: Partial<Skin>): Promise<Skin> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
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
    profitLoss: data.current_price - data.purchase_price,
    trend: data.trend as 'up' | 'down' | null,
    purchasePrice: data.purchase_price,
    currentPrice: data.current_price,
    popularity: 'High' // Default value
  };
};

export const deleteSkin = async (id: number): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
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
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
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
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  // Ensure transaction_type is properly typed
  return data.map(transaction => ({
    ...transaction,
    transaction_type: transaction.transaction_type as 'buy' | 'sell' | 'trade'
  }));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    throw new Error('Not authenticated');
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return {
    ...data,
    transaction_type: data.transaction_type as 'buy' | 'sell' | 'trade'
  };
};
