
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  MoreHorizontal, 
  ExternalLink, 
  Trash2,
  Edit,
  Plus,
  Loader2,
  Search,
  Filter,
  ShoppingCart,
  DollarSign,
  PackageOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

// Definindo a interface para os dados das skins
interface Skin {
  id: number;
  name: string;
  float: string;
  wear: string;
  purchase_price: number;
  current_price: number;
  image: string;
  trend: 'up' | 'down';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  acquired_at?: string;
}

const SkinTable = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSkinData, setEditSkinData] = useState<Skin | null>(null);
  const [isAddSellDialogOpen, setIsAddSellDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'sell'>('add');
  const [newSkinData, setNewSkinData] = useState({
    name: '',
    float: '0.0000',
    wear: 'Factory New',
    purchase_price: 0,
    current_price: 0,
    image: ''
  });
  
  // Carregar skins do Supabase
  useEffect(() => {
    const loadSkins = async () => {
      try {
        setLoading(true);
        
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Se não houver sessão, usar dados de amostra
          // Convertendo o float para string para corresponder à interface Skin
          setSkins(SAMPLE_SKINS.map(skin => ({
            id: skin.id,
            name: skin.name,
            float: String(skin.float), // Convertendo para string
            wear: skin.wear,
            purchase_price: skin.purchasePrice,
            current_price: skin.currentPrice,
            image: skin.image,
            trend: skin.trend as 'up' | 'down' // Garantindo o tipo correto
          })));
          return;
        }
        
        // Consultar skins do usuário autenticado
        const { data, error } = await supabase
          .from('skins')
          .select('*')
          .order('id', { ascending: false });
          
        if (error) throw error;
        
        // Mapear dados para o formato esperado
        const formattedSkins = data.map((skin): Skin => ({
          id: skin.id,
          name: skin.name,
          float: skin.float,
          wear: skin.wear,
          purchase_price: skin.purchase_price,
          current_price: skin.current_price,
          image: skin.image,
          trend: (skin.trend as 'up' | 'down') || 'up', // Garantindo o tipo correto
          user_id: skin.user_id,
          created_at: skin.created_at,
          updated_at: skin.updated_at,
          notes: skin.notes,
          acquired_at: skin.acquired_at
        }));
        
        setSkins(formattedSkins);
      } catch (error) {
        console.error('Erro ao carregar skins:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas skins.',
        });
        
        // Fallback para dados de amostra em caso de erro
        setSkins(SAMPLE_SKINS.map(skin => ({
          id: skin.id,
          name: skin.name,
          float: String(skin.float), // Convertendo para string
          wear: skin.wear,
          purchase_price: skin.purchasePrice,
          current_price: skin.currentPrice,
          image: skin.image,
          trend: skin.trend as 'up' | 'down' // Garantindo o tipo correto
        })));
      } finally {
        setLoading(false);
      }
    };
    
    loadSkins();
  }, [toast]);
  
  // Pré-carregar imagens
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
  
  const handleAddToTrade = (skinName: string) => {
    toast({
      title: 'Adicionado ao Trade',
      description: `${skinName} foi adicionado à sua oferta de trade`,
    });
  };
  
  const handleInspect = (skinName: string) => {
    toast({
      title: 'Inspecionar Arma',
      description: `Abrindo inspeção para ${skinName}`,
    });
  };
  
  const handleDeleteSkin = async (id: number, name: string) => {
    try {
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para excluir skins.',
        });
        return;
      }
      
      // Excluir skin do Supabase
      const { error } = await supabase
        .from('skins')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar estado local
      setSkins(skins.filter(skin => skin.id !== id));
      
      toast({
        title: 'Skin Excluída',
        description: `${name} foi removida do seu inventário.`,
      });
    } catch (error) {
      console.error('Erro ao excluir skin:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a skin.',
      });
    }
  };
  
  // Calcular lucro/prejuízo
  const calculateProfitLoss = (purchasePrice: number, currentPrice: number) => {
    return currentPrice - purchasePrice;
  };

  // Função para abrir o modal de detalhes da skin
  const handleOpenSkinDetails = (skin: Skin) => {
    setSelectedSkin(skin);
  };
  
  // Função para abrir o modal de edição
  const handleEditSkin = (skin: Skin) => {
    setEditSkinData({...skin});
    setIsEditDialogOpen(true);
  };
  
  // Função para salvar as alterações da skin
  const handleSaveSkinEdit = async () => {
    if (!editSkinData) return;
    
    try {
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para editar skins.',
        });
        return;
      }
      
      // Atualizar skin no Supabase
      const { error } = await supabase
        .from('skins')
        .update({
          name: editSkinData.name,
          float: editSkinData.float,
          wear: editSkinData.wear,
          purchase_price: editSkinData.purchase_price,
          current_price: editSkinData.current_price,
          notes: editSkinData.notes
        })
        .eq('id', editSkinData.id);
        
      if (error) throw error;
      
      // Atualizar estado local
      setSkins(skins.map(skin => skin.id === editSkinData.id ? editSkinData : skin));
      
      toast({
        title: 'Skin Atualizada',
        description: `${editSkinData.name} foi atualizada com sucesso.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar skin:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a skin.',
      });
    }
  };
  
  // Função para abrir o modal de adicionar/vender skin
  const handleOpenAddSellDialog = (type: 'add' | 'sell') => {
    setActionType(type);
    setNewSkinData({
      name: '',
      float: '0.0000',
      wear: 'Factory New',
      purchase_price: 0,
      current_price: 0,
      image: ''
    });
    setIsAddSellDialogOpen(true);
  };
  
  // Função para salvar nova skin ou registrar venda
  const handleSaveNewSkin = async () => {
    try {
      // Verificar se há sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para adicionar ou vender skins.',
        });
        return;
      }
      
      if (actionType === 'add') {
        // Adicionar nova skin ao Supabase
        const { data, error } = await supabase
          .from('skins')
          .insert({
            name: newSkinData.name,
            float: newSkinData.float,
            wear: newSkinData.wear,
            purchase_price: newSkinData.purchase_price,
            current_price: newSkinData.current_price,
            image: newSkinData.image || 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6eQ9N7z3ALsrUY_MGD2cYKRdQE7ZlyE_QO8xOnq1sW-78nKz3Vl7yEn-z-DyNJ9do-y/360fx360f',
            user_id: session.user.id,
            trend: 'up'
          })
          .select();
          
        if (error) throw error;
        
        // Adicionar a nova skin ao estado local
        if (data && data.length > 0) {
          const newSkin: Skin = {
            id: data[0].id,
            name: data[0].name,
            float: data[0].float,
            wear: data[0].wear,
            purchase_price: data[0].purchase_price,
            current_price: data[0].current_price,
            image: data[0].image,
            trend: 'up',
            user_id: data[0].user_id,
            created_at: data[0].created_at,
            acquired_at: data[0].acquired_at
          };
          
          setSkins([newSkin, ...skins]);
          
          // Registrar transação de compra
          await supabase
            .from('transactions')
            .insert({
              user_id: session.user.id,
              skin_id: data[0].id,
              amount: newSkinData.purchase_price,
              transaction_type: 'purchase',
              notes: `Compra de ${newSkinData.name}`
            });
          
          toast({
            title: 'Skin Adicionada',
            description: `${newSkinData.name} foi adicionada ao seu inventário.`,
          });
        }
      } else if (actionType === 'sell') {
        // Registrar transação de venda apenas (não excluir a skin)
        await supabase
          .from('transactions')
          .insert({
            user_id: session.user.id,
            amount: newSkinData.current_price,
            transaction_type: 'sale',
            notes: `Venda de ${newSkinData.name}`
          });
        
        toast({
          title: 'Venda Registrada',
          description: `A venda de ${newSkinData.name} foi registrada com sucesso.`,
        });
      }
      
      setIsAddSellDialogOpen(false);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${actionType === 'add' ? 'adicionar a skin' : 'registrar a venda'}.`,
      });
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t('skinInventory')}</h2>
          <p className="text-white/70 text-sm">View your skins, track prices, and manage your collection.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input 
              className="pl-10 bg-black/20 border-white/10 focus:border-blue-400/50 w-full md:w-64"
              placeholder="Search skins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="border-white/10 bg-white/5 hidden md:flex"
            onClick={() => {}}
          >
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          
          <Button 
            className="bg-green-500/20 hover:bg-green-500/40 text-white border border-green-500/30"
            onClick={() => handleOpenAddSellDialog('add')}
          >
            <Plus size={18} className="mr-2" />
            Add
          </Button>
          
          <Button 
            className="bg-blue-500/20 hover:bg-blue-500/40 text-white border border-blue-500/30"
            onClick={() => handleOpenAddSellDialog('sell')}
          >
            <ShoppingCart size={18} className="mr-2" />
            Sell
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-white/70">Carregando skins...</span>
          </div>
        ) : filteredSkins.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-12">
            <div className="text-white/70 mb-2">Nenhuma skin encontrada</div>
            <p className="text-white/50 text-sm mb-4 text-center">
              {searchQuery 
                ? 'Tente ajustar sua busca ou limpar o filtro' 
                : 'Adicione skins ao seu inventário para começar a rastreá-las'}
            </p>
            <Button 
              onClick={() => handleOpenAddSellDialog('add')}
              className="bg-green-500/20 hover:bg-green-500/40 text-white border border-green-500/30"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Skin
            </Button>
          </div>
        ) : (
          <table className="skinculator-table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('float')}</th>
                <th>{t('wear')}</th>
                <th>{t('purchasePrice')}</th>
                <th>{t('currentPrice')}</th>
                <th>{t('profitLoss')}</th>
                <th>{t('trend')}</th>
                <th className="text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkins.map((skin, index) => {
                const profitLoss = calculateProfitLoss(skin.purchase_price, skin.current_price);
                
                return (
                  <tr 
                    key={skin.id} 
                    className={`transition-colors hover:bg-white/5 cursor-pointer ${
                      index === filteredSkins.length - 1 ? 'last-row' : ''
                    }`}
                    onClick={() => handleOpenSkinDetails(skin)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-glow-sm">
                          <div className="relative w-10 h-10">
                            {!loadedImages[skin.id] && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            <img 
                              src={skin.image} 
                              alt={skin.name} 
                              className={`w-full h-full object-contain ${
                                loadedImages[skin.id] ? 'opacity-100' : 'opacity-0'
                              }`} 
                              style={{ filter: 'drop-shadow(0 0 3px rgba(0, 170, 255, 0.5))' }}
                            />
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{skin.name}</div>
                          <div className="text-xs text-white/60">
                            {skin.acquired_at 
                              ? `Adquirido em ${new Date(skin.acquired_at).toLocaleDateString()}` 
                              : 'Data de aquisição não registrada'}
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
                      <div className="font-mono">${skin.purchase_price.toFixed(2)}</div>
                    </td>
                    <td>
                      <div className="font-mono">${skin.current_price.toFixed(2)}</div>
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
                      <div className="flex items-center justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSkin(skin);
                          }}
                        >
                          <Edit size={15} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                            <MoreHorizontal size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="bg-black/80 backdrop-blur-xl border border-white/10 text-white min-w-32"
                          >
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 flex items-center gap-2"
                              onClick={() => handleInspect(skin.name)}
                            >
                              <ExternalLink size={14} />
                              Inspect in-game
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSkin(skin);
                              }}
                            >
                              <Edit size={14} />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkin(skin.id, skin.name);
                              }}
                            >
                              <Trash2 size={14} />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 flex items-center gap-2"
                              onClick={() => handleAddToTrade(skin.name)}
                            >
                              <Plus size={14} />
                              Add to Trade
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
      
      {/* Modal de Detalhes da Skin */}
      {selectedSkin && (
        <Dialog open={Boolean(selectedSkin)} onOpenChange={(open) => !open && setSelectedSkin(null)}>
          <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedSkin.name}</DialogTitle>
              <DialogDescription className="text-white/70">
                Informações detalhadas sobre esta skin
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
                    className="w-full bg-blue-500/20 hover:bg-blue-500/40 text-white border border-blue-500/30 rounded-xl"
                    onClick={() => handleInspect(selectedSkin.name)}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Inspecionar in-game
                  </Button>
                  <Button 
                    className="w-full bg-green-500/20 hover:bg-green-500/40 text-white border border-green-500/30 rounded-xl"
                    onClick={() => {
                      setSelectedSkin(null);
                      handleEditSkin(selectedSkin);
                    }}
                  >
                    <Edit size={16} className="mr-2" />
                    Editar Detalhes
                  </Button>
                  <Button 
                    className="w-full bg-red-500/20 hover:bg-red-500/40 text-white border border-red-500/30 rounded-xl"
                    onClick={() => {
                      handleDeleteSkin(selectedSkin.id, selectedSkin.name);
                      setSelectedSkin(null);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Excluir Skin
                  </Button>
                </div>
              </div>
              
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Valor do Float</div>
                    <div className="font-mono text-xl">{selectedSkin.float}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Desgaste</div>
                    <div className="text-xl">{selectedSkin.wear}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Preço de Compra</div>
                    <div className="font-mono text-xl">${selectedSkin.purchase_price.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white/60 text-sm">Preço Atual</div>
                    <div className="font-mono text-xl">${selectedSkin.current_price.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Lucro/Prejuízo</div>
                  <div className={`font-mono text-2xl ${
                    calculateProfitLoss(selectedSkin.purchase_price, selectedSkin.current_price) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {calculateProfitLoss(selectedSkin.purchase_price, selectedSkin.current_price) >= 0 ? '+' : ''}
                    ${calculateProfitLoss(selectedSkin.purchase_price, selectedSkin.current_price).toFixed(2)} 
                    <span className="text-sm ml-2">
                      ({((calculateProfitLoss(selectedSkin.purchase_price, selectedSkin.current_price) / selectedSkin.purchase_price) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-2">Histórico de Preços (30 dias)</div>
                  <div className="h-24 flex items-end space-x-1">
                    {/* Gráfico de barras simples */}
                    {Array.from({ length: 30 }).map((_, i) => {
                      const height = 30 + Math.random() * 70;
                      const isCurrent = i === 29;
                      return (
                        <div 
                          key={i} 
                          style={{ height: `${height}%` }}
                          className={`w-full ${
                            isCurrent ? 'bg-blue-500' : 
                            selectedSkin.trend === 'up' ? 'bg-green-500/50' : 'bg-red-500/50'
                          } rounded-t-sm`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-white/60 text-sm">Informações Adicionais</div>
                  <div className="text-white">
                    <p>
                      {selectedSkin.acquired_at 
                        ? `Adquirido em ${new Date(selectedSkin.acquired_at).toLocaleDateString()}` 
                        : 'Data de aquisição não registrada'}
                    </p>
                    <p>Notas: {selectedSkin.notes || 'Nenhuma nota registrada'}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Modal de Edição de Skin */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Editar Detalhes da Skin</DialogTitle>
            <DialogDescription className="text-white/70">
              Atualize as informações sobre sua skin
            </DialogDescription>
          </DialogHeader>
          
          {editSkinData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">Nome da Skin</label>
                  <Input 
                    value={editSkinData.name}
                    onChange={(e) => setEditSkinData({...editSkinData, name: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-2">Valor do Float</label>
                  <Input 
                    value={editSkinData.float}
                    onChange={(e) => setEditSkinData({...editSkinData, float: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">Desgaste</label>
                  <Input 
                    value={editSkinData.wear}
                    onChange={(e) => setEditSkinData({...editSkinData, wear: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-2">URL da Imagem</label>
                  <Input 
                    value={editSkinData.image}
                    onChange={(e) => setEditSkinData({...editSkinData, image: e.target.value})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">Preço de Compra ($)</label>
                  <Input 
                    type="number"
                    value={editSkinData.purchase_price}
                    onChange={(e) => setEditSkinData({...editSkinData, purchase_price: parseFloat(e.target.value)})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-2">Preço Atual ($)</label>
                  <Input 
                    type="number"
                    value={editSkinData.current_price}
                    onChange={(e) => setEditSkinData({...editSkinData, current_price: parseFloat(e.target.value)})}
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/70 block mb-2">Notas</label>
                <Input 
                  className="bg-black/20 border-white/10"
                  placeholder="Adicione observações sobre esta skin"
                  value={editSkinData.notes || ''}
                  onChange={(e) => setEditSkinData({...editSkinData, notes: e.target.value})}
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
              Cancelar
            </Button>
            <Button 
              className="bg-green-500/20 hover:bg-green-500/40 text-white border border-green-500/30"
              onClick={handleSaveSkinEdit}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Adicionar/Vender Skin */}
      <Dialog open={isAddSellDialogOpen} onOpenChange={setIsAddSellDialogOpen}>
        <DialogContent className="bg-[#14141f] border border-white/10 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'add' ? 'Adicionar Nova Skin' : 'Registrar Venda de Skin'}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {actionType === 'add' 
                ? 'Adicione uma nova skin ao seu inventário' 
                : 'Registre a venda de uma skin do seu inventário'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Nome da Skin</label>
              <Input 
                value={newSkinData.name}
                onChange={(e) => setNewSkinData({...newSkinData, name: e.target.value})}
                className="bg-black/20 border-white/10"
                placeholder="ex. AWP | Dragon Lore"
              />
            </div>
            
            {actionType === 'add' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 block mb-2">Valor do Float</label>
                  <Input 
                    value={newSkinData.float}
                    onChange={(e) => setNewSkinData({...newSkinData, float: e.target.value})}
                    className="bg-black/20 border-white/10"
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-2">Desgaste</label>
                  <Input 
                    value={newSkinData.wear}
                    onChange={(e) => setNewSkinData({...newSkinData, wear: e.target.value})}
                    className="bg-black/20 border-white/10"
                    placeholder="Factory New"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">
                  {actionType === 'add' ? 'Preço de Compra ($)' : 'Preço de Venda ($)'}
                </label>
                <Input 
                  type="number"
                  value={actionType === 'add' ? newSkinData.purchase_price : newSkinData.current_price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (actionType === 'add') {
                      setNewSkinData({...newSkinData, purchase_price: value});
                    } else {
                      setNewSkinData({...newSkinData, current_price: value});
                    }
                  }}
                  className="bg-black/20 border-white/10"
                  placeholder="0.00"
                />
              </div>
              {actionType === 'add' && (
                <div>
                  <label className="text-sm text-white/70 block mb-2">Valor de Mercado ($)</label>
                  <Input 
                    type="number"
                    value={newSkinData.current_price}
                    onChange={(e) => setNewSkinData({...newSkinData, current_price: parseFloat(e.target.value)})}
                    className="bg-black/20 border-white/10"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
            
            {actionType === 'add' && (
              <div>
                <label className="text-sm text-white/70 block mb-2">URL da Imagem (opcional)</label>
                <Input 
                  value={newSkinData.image}
                  onChange={(e) => setNewSkinData({...newSkinData, image: e.target.value})}
                  className="bg-black/20 border-white/10"
                  placeholder="https://exemplo.com/imagem-skin.png"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddSellDialogOpen(false)}
              className="border-white/10"
            >
              Cancelar
            </Button>
            <Button 
              className={`
                ${actionType === 'add' 
                  ? 'bg-green-500/20 hover:bg-green-500/40 border-green-500/30' 
                  : 'bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/30'
                } text-white border
              `}
              onClick={handleSaveNewSkin}
            >
              {actionType === 'add' ? (
                <>
                  <Plus size={16} className="mr-2" />
                  Adicionar ao Inventário
                </>
              ) : (
                <>
                  <DollarSign size={16} className="mr-2" />
                  Registrar Venda
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkinTable;
