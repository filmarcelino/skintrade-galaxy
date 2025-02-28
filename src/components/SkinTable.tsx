
import { useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal, ShoppingCart, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SkinTable = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const handleBuySkin = (skinName: string) => {
    toast({
      title: 'Purchase Initiated',
      description: `You are about to purchase ${skinName}`,
      variant: 'default',
    });
  };
  
  const handleSellSkin = (skinName: string) => {
    toast({
      title: 'Sale Initiated',
      description: `You are about to sell ${skinName}`,
      variant: 'default',
    });
  };
  
  const handleAddToTrade = (skinName: string) => {
    toast({
      title: 'Added to Trade',
      description: `${skinName} has been added to your trade offer`,
      variant: 'default',
    });
  };

  return (
    <div className="overflow-hidden">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold">{t('skinInventory')}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="skinculator-table">
          <thead>
            <tr>
              <th className="rounded-tl-lg">{t('name')}</th>
              <th>{t('float')}</th>
              <th>{t('wear')}</th>
              <th>{t('purchasePrice')}</th>
              <th>{t('currentPrice')}</th>
              <th>{t('profitLoss')}</th>
              <th>{t('trend')}</th>
              <th className="text-right rounded-tr-lg">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_SKINS.map((skin, index) => (
              <tr 
                key={skin.id} 
                className={`transition-colors group ${
                  index === SAMPLE_SKINS.length - 1 ? 'last-row' : ''
                }`}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                      <img 
                        src={skin.image} 
                        alt={skin.name} 
                        className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <span className="font-medium">{skin.name}</span>
                  </div>
                </td>
                <td>
                  <div className="font-mono text-sm">{skin.float}</div>
                </td>
                <td>
                  <div className="px-2 py-1 rounded-full bg-white/5 inline-block text-sm">{skin.wear}</div>
                </td>
                <td>
                  <div className="font-mono">${skin.purchasePrice.toFixed(2)}</div>
                </td>
                <td>
                  <div className="font-mono">${skin.currentPrice.toFixed(2)}</div>
                </td>
                <td>
                  <div className={`font-mono font-medium ${skin.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {skin.profitLoss >= 0 ? '+' : ''}{skin.profitLoss.toFixed(2)}
                  </div>
                </td>
                <td>
                  {skin.trend === 'up' ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpIcon size={16} className="mr-1" />
                      <span className="text-xs">↑ 4.2%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <ArrowDownIcon size={16} className="mr-1" />
                      <span className="text-xs">↓ 2.1%</span>
                    </div>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 h-8 px-2 rounded-full"
                      onClick={() => handleBuySkin(skin.name)}
                    >
                      <ShoppingCart size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 h-8 px-2 rounded-full"
                      onClick={() => handleSellSkin(skin.name)}
                    >
                      <ShoppingCart size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 h-8 px-2 rounded-full"
                      onClick={() => handleAddToTrade(skin.name)}
                    >
                      <Plus size={14} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-black/80 backdrop-blur-xl border border-white/10 text-white min-w-32 rounded-xl"
                      >
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/10 rounded-lg">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/10 rounded-lg">
                          Sell Item
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/10 rounded-lg">
                          Add to Trade
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkinTable;
