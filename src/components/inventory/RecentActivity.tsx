
import { Clock, Plus, ShoppingCart, BarChart3 } from "lucide-react";

export const RecentActivity = () => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock size={20} className="text-neon-purple" />
        Recent Activity
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-neon-green/20 p-2 rounded-full">
              <Plus size={16} className="text-neon-green" />
            </div>
            <div>
              <div className="font-medium">Added AWP | Dragon Lore</div>
              <div className="text-xs text-white/60">2 days ago</div>
            </div>
          </div>
          <span className="font-mono text-neon-green">+$1,560.75</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-neon-red/20 p-2 rounded-full">
              <ShoppingCart size={16} className="text-neon-red" />
            </div>
            <div>
              <div className="font-medium">Sold Glock-18 | Fade</div>
              <div className="text-xs text-white/60">5 days ago</div>
            </div>
          </div>
          <span className="font-mono text-neon-red">-$405.50</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-neon-blue/20 p-2 rounded-full">
              <BarChart3 size={16} className="text-neon-blue" />
            </div>
            <div>
              <div className="font-medium">Price change for M4A4 | Howl</div>
              <div className="text-xs text-white/60">1 week ago</div>
            </div>
          </div>
          <span className="font-mono text-neon-blue">+$450.00</span>
        </div>
      </div>
    </div>
  );
};
