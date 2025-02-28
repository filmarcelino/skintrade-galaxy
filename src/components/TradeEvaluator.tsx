
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
                        <div className="relative w-8 h-8">
                          {!loadedImages[item.id] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className={`w-full h-full object-contain ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          />
                        </div>
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
                        <div className="relative w-8 h-8">
                          {!loadedImages[item.id] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className={`w-full h-full object-contain ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`} 
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          />
                        </div>
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
                      <div className="relative w-10 h-10">
                        {!loadedImages[skin.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img 
                          src={skin.image} 
                          alt={skin.name} 
                          className={`w-full h-full object-contain ${loadedImages[skin.id] ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [skin.id]: true }))}
                        />
                      </div>
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
