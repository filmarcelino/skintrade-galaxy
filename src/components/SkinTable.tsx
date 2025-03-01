
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
  Loader2
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
  
  // Carregar skins do Supabase
  useEffect(() => {
    const loadSkins = async () => {
      try {
        setLoading(true);
        
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Se não houver sessão, usar dados de amostra
          setSkins(SAMPLE_SKINS.map(skin => ({
            id: skin.id,
            name: skin.name,
            float: skin.float,
            wear: skin.wear,
            purchase_price: skin.purchasePrice,
            current_price: skin.currentPrice,
            image: skin.image,
            trend: skin.trend
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
          trend: skin.trend || 'up',
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
          float: skin.float,
          wear: skin.wear,
          purchase_price: skin.purchasePrice,
          current_price: skin.currentPrice,
          image: skin.image,
          trend: skin.trend
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

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t('skinInventory')}</h2>
          <p className="text-white/70 text-sm">View your skins, track prices, and manage your collection.</p>
        </div>
        
        <div className="relative">
          <Input 
            className="pl-10 bg-black/20 border-white/10 focus:border-blue-400/50 w-full md:w-64"
            placeholder="Search skins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
                    className={`transition-colors hover:bg-white/5 ${
                      index === filteredSkins.length - 1 ? 'last-row' : ''
                    }`}
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
                    <td className="text-right">
                      <div className="flex items-center justify-end">
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
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/10 flex items-center gap-2">
                              <Edit size={14} />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-white/10 flex items-center gap-2"
                              onClick={() => handleDeleteSkin(skin.id, skin.name)}
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
    </div>
  );
};

export default SkinTable;
