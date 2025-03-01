
export interface Skin {
  id: number;
  user_id?: string;
  name: string;
  float: string;
  wear: string;
  purchase_price: number;
  current_price: number;
  image: string;
  notes?: string;
  trend?: 'up' | 'down' | null;
  acquired_at?: string;
  created_at?: string;
  updated_at?: string;
  profitLoss?: number; // calculated field
  
  // CS2 specific details
  pattern?: string;
  stickers?: string;
  rarity?: string;
  collection?: string;
  
  // For backward compatibility with existing components
  purchasePrice?: number; 
  currentPrice?: number;
  popularity?: string; // Added for TradeEvaluator.tsx
}

export interface Transaction {
  id: number;
  user_id?: string;
  skin_id?: number;
  transaction_type: 'buy' | 'sell' | 'trade';
  amount: number;
  notes?: string;
  created_at?: string;
}
