import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SAMPLE_SKINS } from '@/lib/constants';
import { Skin } from '@/lib/types';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  MoreHorizontal, 
  ShoppingCart, 
  Plus, 
  ExternalLink, 
  PackageOpen, 
  Trash2, 
  BarChart3, 
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Edit,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import SkinDetailModal from '@/components/SkinDetailModal';
import AddSkinModal from '@/components/AddSkinModal';
import SellSkinModal from '@/components/SellSkinModal';

const InventoryContent = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [skins, setSkins] = useState<Skin[]>([...SAMPLE_SKINS]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddSkinModalOpen, setIsAddSkinModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [skinToSell, setSkinToSell] = useState<Skin | null>(null);
  
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
  
  const filteredSkins = skins.filter(skin => 
    skin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalValue = skins.reduce((total, skin) => total + skin.currentPrice, 0);
  const totalProfit = skins.reduce((total, skin) => total + skin.profitLoss, 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  const handleOpenSkinDetails = (skin: Skin) => {
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
  
  const handleSellSkin = (skin: Skin) => {
    setSkinToSell(skin);
    setIsSellModalOpen(true);
  };

  const handleCompleteSale = (skinId: number, salePrice: number) => {
    // Remove the skin from inventory after sale
    setSkins(prev => prev.filter(skin => skin.id !== skinId));
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('inventory')}</h1>
              <p className="text-white/60">Manage your skins, track values, and analyze market trends</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl flex items-center gap-2"
                onClick={() => setIsAddSkinModalOpen(true)}
              >
                <Plus size={18} />
                Add Skin
              </Button>
              <Button 
                className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl flex items-center gap-2"
                onClick={() => {
                  if (skins.length > 0) {
                    handleSellSkin(skins[0]);
                  } else {
                    toast({
                      title: "No skins available",
                      description: "Add some skins to your inventory first",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <ShoppingCart size={18} />
                Sell Skin
              </Button>
            </div>
          </div>
          
          {/* Portfolio Summary */}
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
                  <span className="font-mono text-neon-yellow">{skins.length}</span>
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
                {skins
                  .filter(skin => skin.profitLoss > 0)
                  .sort((a, b) => b.profitLoss - a.profitLoss)
                  .slice(0, 3)
                  .map(skin => (
                    <div key={skin.id} className="flex justify-between items-center">
                      <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                      <span className="font-mono text-neon-green">+${skin.profitLoss.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingDown size={20} className="text-neon-red" />
                Worst Performers
              </h2>
              <div className="space-y-4">
                {skins
                  .filter(skin => skin.profitLoss < 0)
                  .sort((a, b) => a.profitLoss - b.profitLoss)
                  .slice(0, 3)
                  .map(skin => (
                    <div key={skin.id} className="flex justify-between items-center">
                      <span className="text-white/70 truncate max-w-[150px]">{skin.name}</span>
                      <span className="font-mono text-neon-red">${skin.profitLoss.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
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
          
          {/* Inventory Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{t('skinInventory')}</h2>
                <p className="text-white/70 text-sm">Manage your items, track values, and view market trends.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                  <Input 
                    className="pl-10 bg-black/20 border-white/10 focus:border-neon-blue/50 w-64"
                    placeholder="Search skins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-white/10 bg-white/5">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
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
                  {filteredSkins.map((skin, index) => (
                    <tr 
                      key={skin.id} 
                      className={`transition-colors group cursor-pointer hover:bg-white/5 ${
                        index === filteredSkins.length - 1 ? 'last-row' : ''
                      }`}
                      onClick={() => handleOpenSkinDetails(skin)}
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
                              handleEditSkin(skin);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 h-8 px-2 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSkin(skin.id);
                            }}
                          >
                            <Trash2 size={14} />
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
          </div>
        </div>
      </main>
      
      <SkinDetailModal 
        skin={selectedSkin}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditSkin}
        onDelete={handleDeleteSkin}
      />

      <AddSkinModal 
        isOpen={isAddSkinModalOpen}
        onClose={() => setIsAddSkinModalOpen(false)}
        onAddSkin={handleAddSkin}
      />

      <SellSkinModal
        skin={skinToSell}
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSellSkin={handleCompleteSale}
      />
      
      <Footer />
    </div>
  );
};

const Inventory = () => {
  return (
    <I18nProvider>
      <InventoryContent />
    </I18nProvider>
  );
};

export default Inventory;
