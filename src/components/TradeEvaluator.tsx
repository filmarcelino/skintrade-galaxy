
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { SAMPLE_SKINS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Plus, ChevronsRight, Check, X, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TradeEvaluator = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [yourItems, setYourItems] = useState<typeof SAMPLE_SKINS>([]);
  const [theirItems, setTheirItems] = useState<typeof SAMPLE_SKINS>([]);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const addRandomSkinToYours = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_SKINS.length);
    const selectedSkin = SAMPLE_SKINS[randomIndex];
    setYourItems([...yourItems, selectedSkin]);
  };

  const addRandomSkinToTheirs = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_SKINS.length);
    const selectedSkin = SAMPLE_SKINS[randomIndex];
    setTheirItems([...theirItems, selectedSkin]);
  };

  const removeSkinFromYours = (id: number) => {
    setYourItems(yourItems.filter(item => item.id !== id));
  };

  const removeSkinFromTheirs = (id: number) => {
    setTheirItems(theirItems.filter(item => item.id !== id));
  };

  const evaluateTrade = () => {
    if (yourItems.length === 0 || theirItems.length === 0) {
      toast({
        title: "Cannot Evaluate",
        description: "Please add at least one item to each side of the trade",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);

    // Calculate total values
    const yourTotalValue = yourItems.reduce((sum, item) => sum + item.currentPrice, 0);
    const theirTotalValue = theirItems.reduce((sum, item) => sum + item.currentPrice, 0);
    const valueDifference = theirTotalValue - yourTotalValue;
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      let result;
      if (valueDifference > 50) {
        result = "This trade is highly favorable for you! The items you're receiving are worth significantly more than what you're giving up.";
      } else if (valueDifference > 10) {
        result = "This trade is slightly in your favor. You're getting a bit more value than you're giving up.";
      } else if (valueDifference > -10) {
        result = "This trade is roughly equal in value. Neither side has a significant advantage.";
      } else if (valueDifference > -50) {
        result = "This trade is slightly unfavorable for you. You're giving up more value than you're receiving.";
      } else {
        result = "This trade is unfavorable for you. The items you're giving up are worth significantly more than what you're receiving.";
      }
      
      setEvaluationResult(result);
      setIsEvaluating(false);
      
      toast({
        title: "Trade Evaluated",
        description: "AI has analyzed your trade offer",
      });
    }, 2000);
  };

  const resetTrade = () => {
    setYourItems([]);
    setTheirItems([]);
    setEvaluationResult(null);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#8B5CF6"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M16 3h5v5"></path>
          <path d="M8 3H3v5"></path>
          <path d="M21 16v5h-5"></path>
          <path d="M3 16v5h5"></path>
          <path d="M21 11.5V8h-8v8h3.5"></path>
          <path d="M8 11.5V8"></path>
          <path d="M12.5 16H8v-4.5"></path>
        </svg>
        {t('tradeEvaluator')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-white/90">{t('yourItems')}</h3>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 bg-white/5 hover:bg-white/10 border-white/10"
              onClick={addRandomSkinToYours}
            >
              <Plus size={14} className="mr-2" />
              {t('addItem')}
            </Button>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 min-h-[200px] border border-white/5">
            {yourItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/40 text-sm">
                Add items to your side of the trade
              </div>
            ) : (
              <div className="space-y-2">
                {yourItems.map((item) => (
                  <div 
                    key={`your-${item.id}-${Math.random()}`} 
                    className="flex items-center justify-between bg-white/5 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-8 h-8 object-contain"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(0, 170, 255, 0.5))' }}
                        />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium truncate max-w-[120px]">{item.name}</div>
                        <div className="text-xs text-white/50">${item.currentPrice.toFixed(2)}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-white/40 hover:text-white/90 hover:bg-white/10"
                      onClick={() => removeSkinFromYours(item.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-right text-sm text-white/70">
            Total: ${yourItems.reduce((sum, item) => sum + item.currentPrice, 0).toFixed(2)}
          </div>
        </div>
        
        {/* Their Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-white/90">{t('theirItems')}</h3>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 bg-white/5 hover:bg-white/10 border-white/10"
              onClick={addRandomSkinToTheirs}
            >
              <Plus size={14} className="mr-2" />
              {t('addItem')}
            </Button>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 min-h-[200px] border border-white/5">
            {theirItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/40 text-sm">
                Add items to their side of the trade
              </div>
            ) : (
              <div className="space-y-2">
                {theirItems.map((item) => (
                  <div 
                    key={`their-${item.id}-${Math.random()}`} 
                    className="flex items-center justify-between bg-white/5 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-8 h-8 object-contain"
                          style={{ filter: 'drop-shadow(0 0 2px rgba(0, 170, 255, 0.5))' }}
                        />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium truncate max-w-[120px]">{item.name}</div>
                        <div className="text-xs text-white/50">${item.currentPrice.toFixed(2)}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-white/40 hover:text-white/90 hover:bg-white/10"
                      onClick={() => removeSkinFromTheirs(item.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-right text-sm text-white/70">
            Total: ${theirItems.reduce((sum, item) => sum + item.currentPrice, 0).toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Evaluation Controls */}
      <div className="mt-6 flex items-center justify-between">
        <Button 
          variant="outline"
          className="bg-white/5 hover:bg-white/10 border-white/10"
          onClick={resetTrade}
        >
          Reset Trade
        </Button>
        
        <Button 
          onClick={evaluateTrade}
          disabled={isEvaluating || (yourItems.length === 0 || theirItems.length === 0)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Evaluating...
            </>
          ) : (
            <>
              <Brain size={16} className="mr-2" />
              {t('evaluateTrade')}
            </>
          )}
        </Button>
      </div>
      
      {/* Evaluation Result */}
      {evaluationResult && (
        <div className="mt-6">
          <h3 className="font-medium text-white/90 mb-2">{t('tradeResult')}</h3>
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <p className="text-white/90">{evaluationResult}</p>
            
            <div className="mt-4 flex justify-end">
              {theirItems.reduce((sum, item) => sum + item.currentPrice, 0) > 
               yourItems.reduce((sum, item) => sum + item.currentPrice, 0) ? (
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center text-sm font-medium">
                  <Check size={14} className="mr-1" />
                  Favorable Trade
                </div>
              ) : (
                <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full flex items-center text-sm font-medium">
                  <X size={14} className="mr-1" />
                  Unfavorable Trade
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeEvaluator;
