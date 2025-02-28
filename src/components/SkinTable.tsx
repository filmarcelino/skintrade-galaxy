
import { useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal, ShoppingCart, Plus, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skin } from '@/lib/types';
import SkinDetailModal from './SkinDetailModal';
import AddSkinModal from './AddSkinModal';
import SellSkinModal from './SellSkinModal';

const SkinTable = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [skins, setSkins] = useState<Skin[]>([...SAMPLE_SKINS]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [skinToSell, setSkinToSell] = useState<Skin | null>(null);
  
  // Pre-load images
  useEffect(() => {
    skins.forEach(skin => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [skin.id]: true
        }));
      };
      img.src = skin.image;
    });
  }, [skins]);
  
  const handleBuySkin = (skinName: string) => {
    toast({
      title: 'Purchase Initiated',
      description: `You are about to purchase ${skinName}`,
      variant: 'default',
    });
  };
  
  const handleSellSkin = (skin: Skin) => {
    setSkinToSell(skin);
    setIsSellModalOpen(true);
  };
  
  const handleAddToTrade = (skinName: string) => {
    toast({
      title: 'Added to Trade',
      description: `${skinName} has been added to your trade offer`,
      variant: 'default',
    });
  };
  
  const handleInspect = (skinName: string) => {
    toast({
      title: 'Inspect Weapon',
      description: `Opening inspection for ${skinName}`,
      variant: 'default',
    });
    // Simulate opening the inspection link
    setTimeout(() => {
      window.open(`https://steamcommunity.com/market/listings/730/${encodeURIComponent(skinName)}`, '_blank');
    }, 500);
  };

  const handleSkinClick = (skin: Skin) => {
    setSelectedSkin(skin);
    setIsDetailModalOpen(true);
  };

  const handleAddSkin = (newSkinData: Omit<Skin, 'id' | 'profitLoss' | 'trend'>) => {
    const newSkin: Skin = {
      ...newSkinData,
      id: Date.now(), // Simple ID generation for demo
      profitLoss: newSkinData.currentPrice - newSkinData.purchasePrice,
      trend: newSkinData.currentPrice >= newSkinData.purchasePrice ? 'up' : 'down'
    };
    
    setSkins(prev => [...prev, newSkin]);
  };

  const handleEditSkin = (updatedSkin: Skin) => {
    // Update profitLoss and trend based on new values
    const editedSkin = {
      ...updatedSkin,
      profitLoss: updatedSkin.currentPrice - updatedSkin.purchasePrice,
      trend: updatedSkin.currentPrice >= updatedSkin.purchasePrice ? 'up' : 'down'
    };
    
    setSkins(prev => 
      prev.map(skin => skin.id === editedSkin.id ? editedSkin : skin)
    );
    
    setSelectedSkin(editedSkin);
  };

  const handleDeleteSkin = (skinId: number) => {
    setSkins(prev => prev.filter(skin => skin.id !== skinId));
    
    toast({
      title: "Skin Deleted",
      description: "The skin has been removed from your inventory",
      variant: "default",
    });
  };

  const handleCompleteSale = (skinId: number, salePrice: number) => {
    // Remove the skin from inventory
    setSkins(prev => prev.filter(skin => skin.id !== skinId));
  };

  return (
    <div className="overflow-hidden">
      <div className="p-6 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{t('skinInventory')}</h2>
          <p className="text-white/70 text-sm">Manage your items, track values, and view market trends.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Skin
          </Button>
          <Link to="/inventory">
            <Button className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl">
              See All
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="skinculator-table">
          <thead>
            <tr>
              <th className="rounded-tl-xl">{t('name')}</th>
              <th>{t('float')}</th>
              <th>{t('wear')}</th>
              <th>{t('purchasePrice')}</th>
              <th>{t('currentPrice')}</th>
              <th>{t('profitLoss')}</th>
              <th>{t('trend')}</th>
              <th className="text-right rounded-tr-xl">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {skins.map((skin, index) => (
              <tr 
                key={skin.id} 
                className={`transition-colors group cursor-pointer hover:bg-white/5 ${
                  index === skins.length - 1 ? 'last-row' : ''
                }`}
                onClick={() => handleSkinClick(skin)}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-glow-sm hover:shadow-glow-lg transition-all duration-300">
                      <div className="relative w-10 h-10">
                        {!loadedImages[skin.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img 
                          src={skin.image} 
                          alt={skin.name} 
                          className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ${
                            loadedImages[skin.id] ? 'opacity-100' : 'opacity-0'
                          }`} 
                          style={{ filter: 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.5))' }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{skin.name}</div>
                      <div className="text-xs text-white/60">Acquired 2 days ago</div>
                    </div>
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
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 h-8 px-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuySkin(skin.name);
                      }}
                    >
                      <Plus size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 h-8 px-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSellSkin(skin);
                      }}
                    >
                      <ShoppingCart size={14} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-black/80 backdrop-blur-xl border border-white/10 text-white min-w-32 rounded-xl"
                      >
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspect(skin.name);
                          }}
                        >
                          <ExternalLink size={14} />
                          Inspect in-game
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellSkin(skin);
                          }}
                        >
                          <ShoppingCart size={14} />
                          Sell Item
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToTrade(skin.name);
                          }}
                        >
                          <Plus size={14} />
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

      {/* Skin Detail Modal */}
      <SkinDetailModal 
        skin={selectedSkin}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditSkin}
        onDelete={handleDeleteSkin}
      />

      {/* Add Skin Modal */}
      <AddSkinModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSkin={handleAddSkin}
      />

      {/* Sell Skin Modal */}
      <SellSkinModal 
        skin={skinToSell}
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSellSkin={handleCompleteSale}
      />
    </div>
  );
};

export default SkinTable;
