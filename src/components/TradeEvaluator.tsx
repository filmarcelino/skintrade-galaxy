
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Zap, X, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_SKINS } from '@/lib/constants';

type TradeItem = {
  id: number;
  name: string;
  image: string;
  value: number;
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

  const handleAddItem = (side: 'your' | 'their') => {
    setAddingFor(side);
  };

  const selectItem = (itemId: number) => {
    const selectedSkin = SAMPLE_SKINS.find(skin => skin.id === itemId);
    if (!selectedSkin) return;
    
    const newItem = {
      id: selectedSkin.id,
      name: selectedSkin.name,
      image: selectedSkin.image,
      value: selectedSkin.currentPrice,
    };
    
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
          value: item.value
        })),
        theirItems: theirItems.map(item => ({
          name: item.name,
          value: item.value
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
              content: `Avalie esta proposta de troca de skins do CS2: ${JSON.stringify(tradeDescription)}`
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
                  <div key={item.id} className="flex items-center justify-between bg-black/30 rounded-xl p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-white/70">R${item.value.toFixed(2)}</div>
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
                  <div key={item.id} className="flex items-center justify-between bg-black/30 rounded-xl p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-white/70">R${item.value.toFixed(2)}</div>
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
          <p>{evaluationResult}</p>
        </div>
      )}
    </div>
  );
};

export default TradeEvaluator;

