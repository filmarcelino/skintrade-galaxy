
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skin {
  id: number;
  name: string;
  float: string;
  wear: string;
  purchase_price: number;
  current_price: number;
  image: string;
  trend?: 'up' | 'down';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  acquired_at?: string;
}

export interface NewSkin {
  name: string;
  float: string;
  wear: string;
  purchase_price: number;
  current_price: number;
  image: string;
  notes?: string;
  trend?: 'up' | 'down';
}

export interface Transaction {
  skin_id: number;
  amount: number;
  transaction_type: 'purchase' | 'sale';
  notes?: string;
}

export function useSkins() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Adicionar uma nova skin
  const addSkin = async (newSkin: NewSkin) => {
    try {
      setIsLoading(true);
      
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para adicionar skins.',
        });
        return null;
      }

      // Realizar a inserção no banco de dados
      const { data, error } = await supabase
        .from('skins')
        .insert({
          name: newSkin.name,
          float: newSkin.float,
          wear: newSkin.wear,
          purchase_price: newSkin.purchase_price,
          current_price: newSkin.current_price,
          image: newSkin.image,
          trend: newSkin.trend || 'up',
          notes: newSkin.notes,
          user_id: session.user.id,
        })
        .select();

      if (error) {
        throw error;
      }

      // Registrar a transação de compra
      await supabase
        .from('transactions')
        .insert({
          skin_id: data[0].id,
          amount: newSkin.purchase_price,
          transaction_type: 'purchase',
          notes: `Aquisição inicial: ${newSkin.name}`,
          user_id: session.user.id,
        });

      toast({
        title: 'Skin Adicionada',
        description: `${newSkin.name} foi adicionada ao seu inventário.`,
      });

      return data[0] as Skin;
    } catch (error) {
      console.error('Erro ao adicionar skin:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a skin.',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Vender uma skin
  const sellSkin = async (skinId: number, salePrice: number, notes?: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para vender skins.',
        });
        return false;
      }

      // Obter informações da skin
      const { data: skinData, error: skinError } = await supabase
        .from('skins')
        .select('*')
        .eq('id', skinId)
        .single();

      if (skinError) {
        throw skinError;
      }

      // Registrar a transação de venda
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          skin_id: skinId,
          amount: salePrice,
          transaction_type: 'sale',
          notes: notes || `Venda: ${skinData.name}`,
          user_id: session.user.id,
        });

      if (transactionError) {
        throw transactionError;
      }

      // Excluir a skin do inventário
      const { error: deleteError } = await supabase
        .from('skins')
        .delete()
        .eq('id', skinId);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Skin Vendida',
        description: `${skinData.name} foi vendida por $${salePrice.toFixed(2)}.`,
      });

      // Calcular lucro/prejuízo
      const profitLoss = salePrice - skinData.purchase_price;
      const profitPercentage = (profitLoss / skinData.purchase_price) * 100;

      toast({
        title: profitLoss >= 0 ? 'Lucro!' : 'Prejuízo',
        description: `${profitLoss >= 0 ? 'Ganhou' : 'Perdeu'} $${Math.abs(profitLoss).toFixed(2)} (${profitPercentage.toFixed(2)}%)`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao vender skin:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível vender a skin.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar uma skin existente
  const updateSkin = async (id: number, updatedData: Partial<Skin>) => {
    try {
      setIsLoading(true);
      
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para atualizar skins.',
        });
        return null;
      }

      // Atualizar dados no Supabase
      const { data, error } = await supabase
        .from('skins')
        .update({
          name: updatedData.name,
          float: updatedData.float,
          wear: updatedData.wear,
          purchase_price: updatedData.purchase_price,
          current_price: updatedData.current_price,
          image: updatedData.image,
          trend: updatedData.trend,
          notes: updatedData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Skin Atualizada',
        description: `${updatedData.name || 'Skin'} foi atualizada com sucesso.`,
      });

      return data[0] as Skin;
    } catch (error) {
      console.error('Erro ao atualizar skin:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a skin.',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addSkin,
    sellSkin,
    updateSkin,
    isLoading
  };
}
