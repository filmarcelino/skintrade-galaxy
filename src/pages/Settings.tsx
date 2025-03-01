
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings2,
  Bell,
  PaletteIcon,
  User,
  Shield,
  Save,
  LogOut,
  Lock,
  Wallet,
  Globe
} from 'lucide-react';

const Settings = () => {
  const { t, language, setLanguage } = useI18n();
  const { toast: uiToast } = useToast();
  
  const [form, setForm] = useState({
    displayName: 'User',
    email: 'user@example.com',
    currency: 'USD',
    language: language,
    theme: 'dark',
    notifications: {
      priceAlerts: true,
      marketUpdates: false,
      trades: true,
      news: false
    },
    privacy: {
      publicProfile: false,
      shareStats: true
    }
  });
  
  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle nested form changes
  const handleNestedChange = (parentField: string, field: string, value: any) => {
    setForm(prev => {
      const updatedForm = { ...prev };
      updatedForm[parentField as keyof typeof prev] = {
        ...prev[parentField as keyof typeof prev],
        [field]: value
      };
      return updatedForm;
    });
  };
  
  // Handle language change
  const handleLanguageChange = (value: string) => {
    handleChange('language', value);
    setLanguage(value as LanguageCode);
  };
  
  // Handle form submission
  const handleSaveSettings = () => {
    // In a real app, we would save to Supabase here
    console.log('Saving settings:', form);
    
    // Show success notification
    toast.success(t('settingsSaved', 'Settings saved successfully'));
    uiToast({
      title: t('success', 'Success'),
      description: t('settingsSaved', 'Settings saved successfully'),
      variant: 'default'
    });
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // In a real app with auth, we would call supabase.auth.signOut()
      console.log('Logging out');
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="pt-4 pb-8">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {t('settings', 'Settings')}
            </h1>
            <p className="text-white/60 max-w-2xl">
              {t('settingsDescription', 'Customize your experience and manage your account settings.')}
            </p>
          </div>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6 bg-black/30 border border-white/10">
              <TabsTrigger value="account">
                <User size={16} className="mr-2" />
                {t('account')}
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <PaletteIcon size={16} className="mr-2" />
                {t('appearance')}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell size={16} className="mr-2" />
                {t('notifications')}
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield size={16} className="mr-2" />
                {t('privacy')}
              </TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  {t('profileInformation')}
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">{t('displayName')}</Label>
                      <Input 
                        id="displayName" 
                        value={form.displayName} 
                        onChange={(e) => handleChange('displayName', e.target.value)}
                        className="bg-black/40 border-white/10 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input 
                        id="email" 
                        value={form.email} 
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-black/40 border-white/10 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-white/10" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t('language')}</Label>
                      <Select 
                        value={form.language} 
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="bg-black/40 border-white/10">
                          <SelectValue placeholder={t('selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t('currency')}</Label>
                      <Select 
                        value={form.currency} 
                        onValueChange={(value) => handleChange('currency', value)}
                      >
                        <SelectTrigger className="bg-black/40 border-white/10">
                          <SelectValue placeholder={t('selectCurrency')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="BRL">BRL (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock size={20} className="text-blue-400" />
                  {t('securitySettings')}
                </h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                  >
                    {t('changePassword')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                  >
                    {t('enableTwoFactor')}
                  </Button>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Wallet size={20} className="text-blue-400" />
                  {t('connectedAccounts')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Globe size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Steam</div>
                        <div className="text-xs text-white/60">Connected</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('disconnect')}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                  >
                    {t('connectSteam')}
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <PaletteIcon size={20} className="text-purple-400" />
                  {t('themeSettings')}
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer ${form.theme === 'dark' ? 'border-blue-500' : 'border-white/10'}`}
                      onClick={() => handleChange('theme', 'dark')}
                    >
                      <div className="bg-gray-900 h-24 rounded-lg mb-2"></div>
                      <p className="text-center font-medium">{t('darkTheme')}</p>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer ${form.theme === 'light' ? 'border-blue-500' : 'border-white/10'}`}
                      onClick={() => handleChange('theme', 'light')}
                    >
                      <div className="bg-gray-100 h-24 rounded-lg mb-2"></div>
                      <p className="text-center font-medium">{t('lightTheme')}</p>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer ${form.theme === 'system' ? 'border-blue-500' : 'border-white/10'}`}
                      onClick={() => handleChange('theme', 'system')}
                    >
                      <div className="bg-gradient-to-r from-gray-900 to-gray-100 h-24 rounded-lg mb-2"></div>
                      <p className="text-center font-medium">{t('systemTheme')}</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings2 size={20} className="text-purple-400" />
                  {t('displaySettings')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactMode">{t('compactMode')}</Label>
                    <Switch id="compactMode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">{t('animations')}</Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highContrast">{t('highContrast')}</Label>
                    <Switch id="highContrast" />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-yellow-400" />
                  {t('notificationPreferences')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="priceAlerts" className="text-base">{t('priceAlerts')}</Label>
                      <p className="text-sm text-white/60">{t('priceAlertsDescription')}</p>
                    </div>
                    <Switch 
                      id="priceAlerts" 
                      checked={form.notifications.priceAlerts}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'priceAlerts', checked)}
                    />
                  </div>
                  
                  <Separator className="my-2 bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketUpdates" className="text-base">{t('marketUpdates')}</Label>
                      <p className="text-sm text-white/60">{t('marketUpdatesDescription')}</p>
                    </div>
                    <Switch 
                      id="marketUpdates" 
                      checked={form.notifications.marketUpdates}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'marketUpdates', checked)}
                    />
                  </div>
                  
                  <Separator className="my-2 bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="trades" className="text-base">{t('tradNotifications')}</Label>
                      <p className="text-sm text-white/60">{t('tradeNotificationsDescription')}</p>
                    </div>
                    <Switch 
                      id="trades" 
                      checked={form.notifications.trades}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'trades', checked)}
                    />
                  </div>
                  
                  <Separator className="my-2 bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="news" className="text-base">{t('newsUpdates')}</Label>
                      <p className="text-sm text-white/60">{t('newsUpdatesDescription')}</p>
                    </div>
                    <Switch 
                      id="news" 
                      checked={form.notifications.news}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'news', checked)}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-green-400" />
                  {t('privacySettings')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile" className="text-base">{t('publicProfile')}</Label>
                      <p className="text-sm text-white/60">{t('publicProfileDescription')}</p>
                    </div>
                    <Switch 
                      id="publicProfile" 
                      checked={form.privacy.publicProfile}
                      onCheckedChange={(checked) => handleNestedChange('privacy', 'publicProfile', checked)}
                    />
                  </div>
                  
                  <Separator className="my-2 bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareStats" className="text-base">{t('shareStats')}</Label>
                      <p className="text-sm text-white/60">{t('shareStatsDescription')}</p>
                    </div>
                    <Switch 
                      id="shareStats" 
                      checked={form.privacy.shareStats}
                      onCheckedChange={(checked) => handleNestedChange('privacy', 'shareStats', checked)}
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock size={20} className="text-red-400" />
                  {t('dataManagement')}
                </h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                  >
                    {t('exportData')}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full md:w-auto"
                  >
                    {t('deleteAccount')}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSaveSettings}
            >
              <Save size={16} className="mr-2" />
              {t('saveSettings')}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
