
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Zap, X } from 'lucide-react';
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

  const evaluateTrade = () => {
    const yourValue = calculateTotalValue(yourItems);
    const theirValue = calculateTotalValue(theirItems);
    const difference = theirValue - yourValue;
    
    let result;
    if (Math.abs(difference) < 10) {
      result = `This trade is fair with nearly equal value (difference: $${Math.abs(difference).toFixed(2)}).`;
    } else if (difference > 0) {
      result = `This trade is in your favor by $${difference.toFixed(2)}. You're receiving more value than you're giving.`;
    } else {
      result = `This trade is not in your favor by $${Math.abs(difference).toFixed(2)}. You're giving more value than you're receiving.`;
    }
    
    toast({
      title: 'Trade evaluated',
      description: 'The AI has analyzed your trade.',
      variant: 'default',
    });
    
    setEvaluationResult(result);
    setIsEvaluated(true);
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">{t('tradeEvaluator')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{t('yourItems')}</h3>
            <div className="text-sm text-white/70">
              Total: ${calculateTotalValue(yourItems).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-lg min-h-52 p-4">
            {yourItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/50">
                No items added
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {yourItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-black/30 rounded-md p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-md overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-white/70">${item.value.toFixed(2)}</div>
                      </div>
                    </div>
                    <button
                      className="text-white/70 hover:text-white p-1"
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
            className="w-full bg-white/5 hover:bg-white/10 border-white/10"
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
              Total: ${calculateTotalValue(theirItems).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-lg min-h-52 p-4">
            {theirItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/50">
                No items added
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {theirItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-black/30 rounded-md p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/50 rounded-md overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-white/70">${item.value.toFixed(2)}</div>
                      </div>
                    </div>
                    <button
                      className="text-white/70 hover:text-white p-1"
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
            className="w-full bg-white/5 hover:bg-white/10 border-white/10"
            onClick={() => handleAddItem('their')}
          >
            <Plus size={16} className="mr-2" /> {t('addItem')}
          </Button>
        </div>
      </div>
      
      {/* Item selection dialog */}
      {addingFor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#14141f] border border-white/10 rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Select an item</h3>
              <button 
                className="text-white/70 hover:text-white"
                onClick={() => setAddingFor(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {SAMPLE_SKINS.map(skin => (
                <div 
                  key={skin.id} 
                  className="flex items-center justify-between bg-black/30 hover:bg-black/50 transition-colors p-3 rounded-md cursor-pointer"
                  onClick={() => selectItem(skin.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/50 rounded-md overflow-hidden flex items-center justify-center">
                      <img src={skin.image} alt={skin.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <div className="font-medium">{skin.name}</div>
                      <div className="text-sm text-white/70">${skin.currentPrice.toFixed(2)}</div>
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
          className="neon-button w-full"
          onClick={evaluateTrade}
          disabled={yourItems.length === 0 || theirItems.length === 0}
        >
          <Zap size={16} className="mr-2" /> {t('evaluateTrade')}
        </Button>
      </div>
      
      {/* Evaluation result */}
      {isEvaluated && evaluationResult && (
        <div className="mt-4 p-4 rounded-lg border border-neon-blue/30 bg-neon-blue/5 animate-fade-in">
          <div className="font-medium mb-1">{t('tradeResult')}</div>
          <p>{evaluationResult}</p>
        </div>
      )}
    </div>
  );
};

export default TradeEvaluator;
