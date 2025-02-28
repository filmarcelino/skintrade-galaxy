
export interface Skin {
  id: number;
  name: string;
  float: string;
  wear: string;
  purchasePrice: number;
  currentPrice: number;
  profitLoss: number;
  trend: 'up' | 'down';
  image: string;
  notes?: string;
}
