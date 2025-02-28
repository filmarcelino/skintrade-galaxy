
import { useState, useEffect } from 'react';
import { Skin } from "@/types/skin";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  MoreHorizontal, 
  ShoppingCart, 
  ExternalLink, 
  Trash2, 
  Edit,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

interface InventoryTableProps {
  skinsData: Skin[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  loadedImages: Record<string, boolean>;
  setLoadedImages: (value: Record<string, boolean>) => void;
  handleOpenSkinDetails: (skin: Skin) => void;
  handleEditSkin: (skin: Skin) => void;
  handleDeleteSkin: (skinId: number) => void;
  handleOpenAddSellDialog: (type: 'add' | 'sell', skin?: Skin) => void;
  handleInspect: (skinName: string) => void;
}

export const InventoryTable = ({
  skinsData,
  isLoading,
  isError,
  error,
  loadedImages,
  setLoadedImages,
  handleOpenSkinDetails,
  handleEditSkin,
  handleDeleteSkin,
  handleOpenAddSellDialog,
  handleInspect
}: InventoryTableProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSkins = skinsData ? skinsData.filter(skin => 
    skin.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
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
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading skins...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            <p>Error loading skins: {error?.toString()}</p>
          </div>
        ) : filteredSkins.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <p>No skins found. Add your first skin to get started!</p>
          </div>
        ) : (
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
              {filteredSkins.map((skin, index) => {
                const profitLoss = skin.profitLoss ?? (skin.current_price - skin.purchase_price);
                return (
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
                          <div className="text-xs text-white/60">
                            {skin.acquired_at 
                              ? `Acquired ${new Date(skin.acquired_at).toLocaleDateString()}`
                              : 'Acquired 2 days ago'}
                          </div>
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
                      <div className="font-mono">${typeof skin.purchase_price === 'number' ? skin.purchase_price.toFixed(2) : skin.purchase_price}</div>
                    </td>
                    <td>
                      <div className="font-mono">${typeof skin.current_price === 'number' ? skin.current_price.toFixed(2) : skin.current_price}</div>
                    </td>
                    <td>
                      <div className={`font-mono font-medium ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}
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
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 rounded-lg flex items-center gap-2"
                              onClick={() => handleOpenAddSellDialog('sell', skin)}
                            >
                              <ShoppingCart size={14} />
                              Sell Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
