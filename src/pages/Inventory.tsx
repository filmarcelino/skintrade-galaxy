
import { useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SAMPLE_SKINS } from '@/lib/constants';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const Inventory = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSkinData, setEditSkinData] = useState<any>(null);
  const [isAddSellDialogOpen, setIsAddSellDialogOpen] = useState(false);
  const [newSkinData, setNewSkinData] = useState({
    name: '',
    float: '0.0000',
    wear: 'Factory New',
    purchasePrice: 0,
    currentPrice: 0,
    image: ''
  });
  const [actionType, setActionType] = useState<'add' | 'sell'>('add');
  
  // Pre-load images
  useState(() => {
    SAMPLE_SKINS.forEach(skin => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [skin.id]: true
        }));
      };
      img.src = skin.image;
    });
  });
  
  const filteredSkins = SAMPLE_SKINS.filter(skin => 
    skin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalValue = SAMPLE_SKINS.reduce((total, skin) => total + skin.currentPrice, 0);
  const totalProfit = SAMPLE_SKINS.reduce((total, skin) => total + skin.profitLoss, 0);
  const profitPercentage = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;
  
  const handleOpenSkinDetails = (skin: any) => {
    setSelectedSkin(skin);
  };
  
  const handleEditSkin = (skin: any) => {
    setEditSkinData({...skin});
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteSkin = (skinId: number) => {
    toast({
      title: "Skin Deleted",
      description: "The skin has been removed from your inventory",
      variant: "default",
    });
    // In a real app, this would delete from database
  };
  
  const handleSaveSkinEdit = () => {
    toast({
      title: "Changes Saved",
      description: "Your skin details have been updated",
      variant: "default",
    });
    setIsEditDialogOpen(false);
    // In a real app, this would update the database
  };
  
  const handleAddToTrade = (skinName: string) => {
    toast({
      title: 'Added to Trade',
      description: `${skinName} has been added to your trade offer`,
      variant: 'default',
    });
  };
  
  const handleOpenAddSellDialog = (type: 'add' | 'sell') => {
    setActionType(type);
    setNewSkinData({
      name: '',
      float: '0.0000',
      wear: 'Factory New',
      purchasePrice: 0,
      currentPrice: 0,
      image: ''
    });
    setIsAddSellDialogOpen(true);
  };
  
  const handleSaveNewSkin = () => {
    if (actionType === 'add') {
      toast({
        title: "Skin Added",
        description: `${newSkinData.name} has been added to your inventory`,
        variant: "default",
      });
    } else {
      toast({
        title: "Skin Sold",
        description: `${newSkinData.name} has been sold from your inventory`,
        variant: "default",
      });
    }
    setIsAddSellDialogOpen(false);
    // In a real app, this would update the database
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
    }, 1000);
  };

  return (
    <I18nProvider>
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
                  onClick={() => handleOpenAddSellDialog('add')}
                >
                  <Plus size={18} />
                  Add Skin
                </Button>
                <Button 
                  className="bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl flex items-center gap-2"
                  onClick={() => handleOpenAddSellDialog('sell')}
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
                    <span className="font-mono text-neon-yellow">{SAMPLE_SKINS.length}</span>
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
                  {SAMPLE_SKINS
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
                  {SAMPLE_SKINS
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
                                  onClick={() => handleInspect(skin.name)}
                                >
                                  <ExternalLink size={14} />
                                  Inspect in-game
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2">
                                  <ShoppingCart size={14} />
                                  Sell Item
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2">
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
        
        {/* Skin Detail Modal */}
        {selectedSkin && (
          <Dialog open={Boolean(selectedSkin)} onOpenChange={(open) => !open && setSelectedSkin(null)}>
            <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedSkin.name}</DialogTitle>
                <DialogDescription className="text-white/70">
                  Detailed information about this skin
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center col-span-1">
                  <div className="w-48 h-48 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-glow-lg mb-4">
                    <img 
                      src={selectedSkin.image} 
                      alt={selectedSkin.name} 
                      className="w-full h-full object-contain" 
                      style={{ filter: 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.7))' }}
                    />
                  </div>
                  
                  <div className="space-y-2 w-full">
                    <Button 
                      className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 text-white border border-neon-blue/30 rounded-xl"
                      onClick={() => handleInspect(selectedSkin.name)}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Inspect in-game
                    </Button>
                    <Button 
                      className="w-full bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30 rounded-xl"
                      onClick={() => {
                        setSelectedSkin(null);
                        handleEditSkin(selectedSkin);
                      }}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Details
                    </Button>
                    <Button 
                      className="w-full bg-neon-red/20 hover:bg-neon-red/40 text-white border border-neon-red/30 rounded-xl"
                      onClick={() => {
                        handleDeleteSkin(selectedSkin.id);
                        setSelectedSkin(null);
                      }}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Skin
                    </Button>
                  </div>
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="text-white/60 text-sm">Float Value</div>
                      <div className="font-mono text-xl">{selectedSkin.float}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="text-white/60 text-sm">Wear</div>
                      <div className="text-xl">{selectedSkin.wear}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="text-white/60 text-sm">Purchase Price</div>
                      <div className="font-mono text-xl">${selectedSkin.purchasePrice.toFixed(2)}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="text-white/60 text-sm">Current Price</div>
                      <div className="font-mono text-xl">${selectedSkin.currentPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Profit/Loss</div>
                    <div className={`font-mono text-2xl ${selectedSkin.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedSkin.profitLoss >= 0 ? '+' : ''}${selectedSkin.profitLoss.toFixed(2)} 
                      <span className="text-sm ml-2">
                        ({((selectedSkin.profitLoss / selectedSkin.purchasePrice) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm mb-2">Price History (30 days)</div>
                    <div className="h-24 flex items-end space-x-1">
                      {/* Simple bar chart visualization */}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const height = 30 + Math.random() * 70;
                        const isCurrent = i === 29;
                        return (
                          <div 
                            key={i} 
                            style={{ height: `${height}%` }}
                            className={`w-full ${
                              isCurrent ? 'bg-neon-blue' : 
                              selectedSkin.trend === 'up' ? 'bg-green-500/50' : 'bg-red-500/50'
                            } rounded-t-sm`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Additional Information</div>
                    <div className="text-white">
                      <p>Acquired on June 15, 2023</p>
                      <p>Pattern Index: 661</p>
                      <p>Stickers: None</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Edit Skin Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
            <DialogHeader>
              <DialogTitle>Edit Skin Details</DialogTitle>
              <DialogDescription className="text-white/70">
                Update information about your skin
              </DialogDescription>
            </DialogHeader>
            
            {editSkinData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Float Value</label>
                    <Input 
                      value={editSkinData.float}
                      onChange={(e) => setEditSkinData({...editSkinData, float: e.target.value})}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Wear</label>
                    <Input 
                      value={editSkinData.wear}
                      onChange={(e) => setEditSkinData({...editSkinData, wear: e.target.value})}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Purchase Price ($)</label>
                    <Input 
                      type="number"
                      value={editSkinData.purchasePrice}
                      onChange={(e) => setEditSkinData({...editSkinData, purchasePrice: parseFloat(e.target.value)})}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Current Price ($)</label>
                    <Input 
                      type="number"
                      value={editSkinData.currentPrice}
                      onChange={(e) => setEditSkinData({...editSkinData, currentPrice: parseFloat(e.target.value)})}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 block mb-2">Acquisition Date</label>
                  <Input 
                    type="date"
                    className="bg-black/20 border-white/10"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-white/70 block mb-2">Notes</label>
                  <Input 
                    className="bg-black/20 border-white/10"
                    placeholder="Add any additional notes about this skin"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button 
                className="bg-neon-green/20 hover:bg-neon-green/40 text-white border border-neon-green/30"
                onClick={handleSaveSkinEdit}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Add/Sell Skin Dialog */}
        <Dialog open={isAddSellDialogOpen} onOpenChange={setIsAddSellDialogOpen}>
          <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
            <DialogHeader>
              <DialogTitle>{actionType === 'add' ? 'Add New Skin' : 'Sell Skin'}</DialogTitle>
              <DialogDescription className="text-white/70">
                {actionType === 'add' 
                  ? 'Add a new skin to your inventory' 
                  : 'Record the sale of a skin from your inventory'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Skin Name</label>
                <Input 
                  value={newSkinData.name}
                  onChange={(e) => setNewSkinData({...newSkinData, name: e.target.value})}
                  className="bg-black/20 border-white/10"
                  placeholder="e.g. AWP | Dragon Lore"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">Float Value</label>
                  <Input 
                    value={newSkinData.float}
                    onChange={(e) => setNewSkinData({...newSkinData, float: e.target.value})}
                    className="bg-black/20 border-white/10"
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-2">Wear</label>
                  <Input 
                    value={newSkinData.wear}
                    onChange={(e) => setNewSkinData({...newSkinData, wear: e.target.value})}
                    className="bg-black/20 border-white/10"
                    placeholder="Factory New"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">
                    {actionType === 'add' ? 'Purchase Price ($)' : 'Sale Price ($)'}
                  </label>
                  <Input 
                    type="number"
                    value={newSkinData.purchasePrice}
                    onChange={(e) => setNewSkinData({...newSkinData, purchasePrice: parseFloat(e.target.value)})}
                    className="bg-black/20 border-white/10"
                    placeholder="0.00"
                  />
                </div>
                {actionType === 'add' && (
                  <div>
                    <label className="text-sm text-white/70 block mb-2">Market Value ($)</label>
                    <Input 
                      type="number"
                      value={newSkinData.currentPrice}
                      onChange={(e) => setNewSkinData({...newSkinData, currentPrice: parseFloat(e.target.value)})}
                      className="bg-black/20 border-white/10"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
              
              {actionType === 'add' && (
                <div>
                  <label className="text-sm text-white/70 block mb-2">Image URL (optional)</label>
                  <Input 
                    value={newSkinData.image}
                    onChange={(e) => setNewSkinData({...newSkinData, image: e.target.value})}
                    className="bg-black/20 border-white/10"
                    placeholder="https://example.com/skin-image.png"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm text-white/70 block mb-2">
                  {actionType === 'add' ? 'Acquisition Date' : 'Sale Date'}
                </label>
                <Input 
                  type="date"
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddSellDialogOpen(false)}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button 
                className={`
                  ${actionType === 'add' 
                    ? 'bg-neon-green/20 hover:bg-neon-green/40 border-neon-green/30' 
                    : 'bg-neon-blue/20 hover:bg-neon-blue/40 border-neon-blue/30'
                  } text-white border
                `}
                onClick={handleSaveNewSkin}
              >
                {actionType === 'add' ? (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add to Inventory
                  </>
                ) : (
                  <>
                    <DollarSign size={16} className="mr-2" />
                    Record Sale
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Inventory;
