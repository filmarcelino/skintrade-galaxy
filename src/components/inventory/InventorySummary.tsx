
import { Skin } from "@/types/skin";
import { PackageOpen, TrendingUp, TrendingDown } from "lucide-react";

interface InventorySummaryProps {
  skinsData: Skin[] | undefined;
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
}

export const InventorySummary = ({ 
  skinsData, 
  totalValue, 
  totalProfit, 
  profitPercentage 
}: InventorySummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PackageOpen size={20} className="text-neon-blue" />
          Portfolio Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Value</span>
            <span className="font-mono text-neon-blue">${totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Items</span>
            <span className="font-mono text-neon-yellow">{skinsData ? skinsData.length : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Profit/Loss</span>
            <span className={`font-mono ${totalProfit >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-neon-green" />
          Best Performers
        </h2>
        <div className="space-y-4">
          {skinsData 
            ? skinsData
              .filter(skin => {
                const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
                return profitLoss > 0;
              })
              .sort((a, b) => {
                const profitLossA = a.profitLoss ?? (a.current_price - a.purchase_price);
                const profitLossB = b.profitLoss ?? (b.current_price - b.purchase_price);
                return profitLossB - profitLossA;
              })
              .slice(0, 3)
              .map(skin => {
                const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
                return (
                  <div key={skin.id} className="flex justify-between items-center">
                    <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                    <span className="font-mono text-neon-green">+${profitLoss.toFixed(2)}</span>
                  </div>
                );
              })
            : <div className="text-white/50 text-center py-2">No data available</div>
          }
        </div>
      </div>
      
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingDown size={20} className="text-neon-red" />
          Worst Performers
        </h2>
        <div className="space-y-4">
          {skinsData 
            ? skinsData
              .filter(skin => {
                const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
                return profitLoss < 0;
              })
              .sort((a, b) => {
                const profitLossA = a.profitLoss ?? (a.current_price - a.purchase_price);
                const profitLossB = b.profitLoss ?? (b.current_price - b.purchase_price);
                return profitLossA - profitLossB;
              })
              .slice(0, 3)
              .map(skin => {
                const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
                return (
                  <div key={skin.id} className="flex justify-between items-center">
                    <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                    <span className="font-mono text-neon-red">${profitLoss.toFixed(2)}</span>
                  </div>
                );
              })
            : <div className="text-white/50 text-center py-2">No data available</div>
          }
        </div>
      </div>
    </div>
  );
};
