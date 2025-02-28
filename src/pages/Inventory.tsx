
import { I18nProvider, useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useInventory } from '@/hooks/useInventory';
import { InventorySummary } from '@/components/inventory/InventorySummary';
import { RecentActivity } from '@/components/inventory/RecentActivity';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { SkinDetailDialog } from '@/components/inventory/SkinDetailDialog';
import { SkinFormDialog } from '@/components/inventory/SkinFormDialog';

const Inventory = () => {
  const { t } = useI18n();
  const {
    skinsData,
    isLoading,
    isError,
    error,
    loadedImages,
    setLoadedImages,
    selectedSkin,
    setSelectedSkin,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editSkinData,
    setEditSkinData,
    isAddSellDialogOpen,
    setIsAddSellDialogOpen,
    newSkinData,
    setNewSkinData,
    saleData,
    setSaleData,
    actionType,
    totalValue,
    totalProfit,
    profitPercentage,
    handleOpenSkinDetails,
    handleEditSkin,
    handleDeleteSkin,
    handleSaveSkinEdit,
    handleOpenAddSellDialog,
    handleSaveNewSkin,
    handleSellSkin,
    handleInspect
  } = useInventory();

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
            <InventorySummary 
              skinsData={skinsData}
              totalValue={totalValue}
              totalProfit={totalProfit}
              profitPercentage={profitPercentage}
            />
            
            {/* Recent Activity */}
            <RecentActivity />
            
            {/* Inventory Table */}
            <InventoryTable 
              skinsData={skinsData}
              isLoading={isLoading}
              isError={isError}
              error={error}
              loadedImages={loadedImages}
              setLoadedImages={setLoadedImages}
              handleOpenSkinDetails={handleOpenSkinDetails}
              handleEditSkin={handleEditSkin}
              handleDeleteSkin={handleDeleteSkin}
              handleOpenAddSellDialog={handleOpenAddSellDialog}
              handleInspect={handleInspect}
            />
          </div>
        </main>
        
        <Footer />
        
        {/* Skin Detail Modal */}
        <SkinDetailDialog 
          selectedSkin={selectedSkin}
          setSelectedSkin={setSelectedSkin}
          handleEditSkin={handleEditSkin}
          handleDeleteSkin={handleDeleteSkin}
          handleInspect={handleInspect}
        />
        
        {/* Add/Edit/Sell Skin Dialog */}
        <SkinFormDialog 
          isOpen={isAddSellDialogOpen || isEditDialogOpen}
          onClose={() => {
            setIsAddSellDialogOpen(false);
            setIsEditDialogOpen(false);
          }}
          actionType={isEditDialogOpen ? 'edit' : actionType}
          selectedSkin={selectedSkin}
          newSkinData={newSkinData}
          setNewSkinData={setNewSkinData}
          editSkinData={editSkinData}
          setEditSkinData={setEditSkinData}
          saleData={saleData}
          setSaleData={setSaleData}
          handleSaveNewSkin={handleSaveNewSkin}
          handleSaveSkinEdit={handleSaveSkinEdit}
          handleSellSkin={handleSellSkin}
        />
      </div>
    </I18nProvider>
  );
};

export default Inventory;
