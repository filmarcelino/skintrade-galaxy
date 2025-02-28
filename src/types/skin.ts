
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
