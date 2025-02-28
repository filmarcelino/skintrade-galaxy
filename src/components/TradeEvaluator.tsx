
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Zap, X, Loader, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_SKINS } from '@/lib/constants';
import { supabase } from "@/integrations/supabase/client";

type TradeItem = {
  id: number;
  name: string;
  image: string;
  value: number;
  marketTrend?: 'up' | 'down' | 'stable';
  popularity?: 'high' | 'medium' | 'low';
};

const TradeEvaluator = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [yourItems, setYourItems] = useState<TradeItem[]>([]);
  const [theirItems, setTheirItems] = useState<TradeItem[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<'your' | 'their' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<Record<number, any>>({});

  const handleAddItem = (side: 'your' | 'their') => {
    setAddingFor(side);
  };

  const fetchSteamMarketData = async (appId: string, marketHashName: string) => {
    try {
      const encodedName = encodeURIComponent(marketHashName);
      const endpoint = `ISteamEconomy/GetAssetPrices/v1`;
      const params = new URLSearchParams({
        appid: appId,
        currency: 'BRL',
        market_hash_name: encodedName
      });

      const { data, error } = await supabase.functions.invoke('steam-api', {
        query: { endpoint, ...Object.fromEntries(params) }
      });

      if (error) {
        console.error('Erro ao buscar dados do mercado:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do mercado:', error);
      return null;
    }
  };

  const enrichItemWithMarketData = async (item: TradeItem): Promise<TradeItem> => {
    try {
      // Simular dados de mercado para o item
      // Em uma implementação real, usaríamos a API do Steam
      const randomTrend = Math.random();
      const randomPopularity = Math.random();
      
      return {
        ...item,
        marketTrend: randomTrend > 0.66 ? 'up' : (randomTrend > 0.33 ? 'stable' : 'down'),
        popularity: randomPopularity > 0.66 ? 'high' : (randomPopularity > 0.33 ? 'medium' : 'low'),
      };
    } catch (error) {
      console.error('Erro ao enriquecer item com dados de mercado:', error);
      return item;
    }
  };

  const selectItem = async (itemId: number) => {
    const selectedSkin = SAMPLE_SKINS.find(skin => skin.id === itemId);
    if (!selectedSkin) return;
    
    let newItem = {
      id: selectedSkin.id,
      name: selectedSkin.name,
      image: selectedSkin.image,
      value: selectedSkin.currentPrice,
    };
    
    // Enriquecer o item com dados de mercado
    newItem = await enrichItemWithMarketData(newItem);
    
    if (addingFor === 'your') {
      setYourItems([...yourItems, newItem]);
    } else {
      setTheirItems([...theirItems, newItem]);
    }
    
    setAddingFor(null);
  };

  const removeItem = (side: 'your' | 'their', id: number) => {
    if (side === 'your') {
      setYourItems(yourItems.filter(item => item.id !== id));
    } else {
      setTheirItems(theirItems.filter(item => item.id !== id));
    }
  };

  const calculateTotalValue = (items: TradeItem[]) => {
    return items.reduce((sum, item) => sum + item.value, 0);
  };

  const evaluateTrade = async () => {
    setIsLoading(true);
    const yourValue = calculateTotalValue(yourItems);
    const theirValue = calculateTotalValue(theirItems);
    
    try {
      // Format the trade data for OpenAI analysis
      const tradeDescription = {
        yourItems: yourItems.map(item => ({
          name: item.name,
          value: item.value,
          marketTrend: item.marketTrend,
          popularity: item.popularity
        })),
        theirItems: theirItems.map(item => ({
          name: item.name,
          value: item.value,
          marketTrend: item.marketTrend,
          popularity: item.popularity
        })),
        yourTotal: yourValue,
        theirTotal: theirValue
      };

      // Request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de trocas de skins de CS2. Avalie a troca considerando o valor total, raridade, liquidez de mercado e tendências de preço. Forneça uma análise concisa em português.'
            },
            {
              role: 'user',
              content: `Avalie esta proposta de troca de skins do CS2, incluindo tendências de mercado e popularidade: ${JSON.stringify(tradeDescription)}`
            }
          ],
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error('Erro na chamada da API');
      }

      const data = await response.json();
      const result = data.choices[0].message.content;

      toast({
        title: 'Troca avaliada pela IA',
        description: 'A IA analisou sua proposta de troca.',
        variant: 'default',
      });
      
      setEvaluationResult(result);
      setIsEvaluated(true);
    } catch (error) {
      console.error('Erro ao avaliar troca:', error);
      toast({
        title: 'Erro ao avaliar',
        description: 'Não foi possível completar a análise de IA.',
        variant: 'destructive',
      });
      
      // Fallback to basic analysis if AI fails
      const difference = theirValue - yourValue;
      let fallbackResult;
      if (Math.abs(difference) < 10) {
        fallbackResult = `Esta troca é justa com valores quase iguais (diferença: R$${Math.abs(difference).toFixed(2)}).`;
      } else if (difference > 0) {
        fallbackResult = `Esta troca é favorável para você em R$${difference.toFixed(2)}. Você está recebendo mais valor do que está dando.`;
      } else {
        fallbackResult = `Esta troca não é favorável para você em R$${Math.abs(difference).toFixed(2)}. Você está dando mais valor do que está recebendo.`;
      }
      
      setEvaluationResult(fallbackResult);
      setIsEvaluated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp size={14} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return null;
  };

  const getPopularityBadge = (popularity?: 'high' | 'medium' | 'low') => {
    if (!popularity) return null;
    
    const colors = {
      high: 'bg-green-500/20 text-green-500',
      medium: 'bg-yellow-500/20 text-yellow-500',
      low: 'bg-red-500/20 text-red-500'
    };
    
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${colors[popularity]}`}>
        {popularity}
      </span>
    );
  };

  return (
    <div className="glass-card p-6 animate-fade-in rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">{t('tradeEvaluator')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{t('yourItems')}</h3>
            <div className="text-sm text-white/70">
              Total: R${calculateTotalValue(yourItems).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-xl min-h-52 p-4">
            {yourItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/50">
                Nenhum item adicionado
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {yourItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-black/30 hover:bg-black/40 transition-colors rounded-xl p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-1">
                          {item.name} {getTrendIcon(item.marketTrend)}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-xs text-white/70">R${item.value.toFixed(2)}</div>
                          {getPopularityBadge(item.popularity)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                      onClick={() => removeItem('your', item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 border-white/10 rounded-xl"
            onClick={() => handleAddItem('your')}
          >
            <Plus size={16} className="mr-2" /> {t('addItem')}
          </Button>
        </div>
        
        {/* Their items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{t('theirItems')}</h3>
            <div className="text-sm text-white/70">
              Total: R${calculateTotalValue(theirItems).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-xl min-h-52 p-4">
            {theirItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/50">
                Nenhum item adicionado
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {theirItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-black/30 hover:bg-black/40 transition-colors rounded-xl p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-1">
                          {item.name} {getTrendIcon(item.marketTrend)}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-xs text-white/70">R${item.value.toFixed(2)}</div>
                          {getPopularityBadge(item.popularity)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                      onClick={() => removeItem('their', item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 border-white/10 rounded-xl"
            onClick={() => handleAddItem('their')}
          >
            <Plus size={16} className="mr-2" /> {t('addItem')}
          </Button>
        </div>
      </div>
      
      {/* Item selection dialog */}
      {addingFor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#14141f] border border-white/10 rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Selecione um item</h3>
              <button 
                className="text-white/70 hover:text-white rounded-full p-1 hover:bg-white/10"
                onClick={() => setAddingFor(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {SAMPLE_SKINS.map(skin => (
                <div 
                  key={skin.id} 
                  className="flex items-center justify-between bg-black/30 hover:bg-black/50 transition-colors p-3 rounded-xl cursor-pointer"
                  onClick={() => selectItem(skin.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={skin.image} alt={skin.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <div className="font-medium">{skin.name}</div>
                      <div className="text-sm text-white/70">R${skin.currentPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  <Plus size={16} className="text-white/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Evaluation button */}
      <div className="mt-6">
        <Button 
          className="neon-button w-full rounded-xl"
          onClick={evaluateTrade}
          disabled={yourItems.length === 0 || theirItems.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" /> Analisando...
            </>
          ) : (
            <>
              <Zap size={16} className="mr-2" /> {t('evaluateTrade')}
            </>
          )}
        </Button>
      </div>
      
      {/* Evaluation result */}
      {isEvaluated && evaluationResult && (
        <div className="mt-4 p-4 rounded-xl border border-neon-blue/30 bg-neon-blue/5 animate-fade-in">
          <div className="font-medium mb-1">{t('tradeResult')}</div>
          <p className="text-sm">{evaluationResult}</p>
          
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs text-white/70">
              <AlertCircle size={12} /> 
              <span>A análise inclui valor, demanda do mercado e tendências de preço.</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <TrendingUp size={12} className="text-green-500" /> 
              <span>Tendência de alta: item com valor crescente</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <TrendingDown size={12} className="text-red-500" /> 
              <span>Tendência de queda: item com valor decrescente</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeEvaluator;
