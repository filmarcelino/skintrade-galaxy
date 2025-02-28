
export type LanguageCode = 'en' | 'es' | 'pt-br';

export const LANGUAGES = {
  en: 'English',
  es: 'Español',
  'pt-br': 'Português (BR)'
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export type Translation = {
  [key: string]: string;
};

export type Translations = {
  [key in LanguageCode]: Translation;
};

export const TRANSLATIONS: Translations = {
  en: {
    // Navbar
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
    inventory: 'Inventory',
    analytics: 'Analytics',
    settings: 'Settings',
    login: 'Login with Steam',
    
    // Credits section
    aiCredits: 'AI Credits',
    buyCredits: 'Buy Credits',
    analyzeMarket: 'Analyze Market',
    
    // Skin table
    skinInventory: 'Skin Inventory',
    name: 'Name',
    float: 'Float',
    wear: 'Wear',
    purchasePrice: 'Purchase Price',
    currentPrice: 'Current Price',
    profitLoss: 'Profit/Loss',
    trend: 'Trend',
    actions: 'Actions',
    
    // Trade evaluator
    tradeEvaluator: 'Trade Evaluator',
    yourItems: 'Your Items',
    theirItems: 'Their Items',
    addItem: 'Add Item',
    evaluateTrade: 'Evaluate Trade (1 Credit)',
    tradeResult: 'Trade Result',
    
    // Marketplace
    marketplaceTitle: 'Marketplace',
    comingSoon: 'Coming Soon',
    getNotified: 'Get notified when we launch',
    emailPlaceholder: 'Your email address',
    notifyMe: 'Notify Me',
    
    // Footer
    copyright: '© 2025 Clutch Studios. All rights reserved.',
    terms: 'Terms',
    privacy: 'Privacy',
    support: 'Support',
  },
  es: {
    // Navbar
    dashboard: 'Tablero',
    marketplace: 'Mercado',
    inventory: 'Inventario',
    analytics: 'Análisis',
    settings: 'Ajustes',
    login: 'Iniciar con Steam',
    
    // Credits section
    aiCredits: 'Créditos IA',
    buyCredits: 'Comprar Créditos',
    analyzeMarket: 'Analizar Mercado',
    
    // Skin table
    skinInventory: 'Inventario de Skins',
    name: 'Nombre',
    float: 'Float',
    wear: 'Desgaste',
    purchasePrice: 'Precio de Compra',
    currentPrice: 'Precio Actual',
    profitLoss: 'Ganancia/Pérdida',
    trend: 'Tendencia',
    actions: 'Acciones',
    
    // Trade evaluator
    tradeEvaluator: 'Evaluador de Intercambios',
    yourItems: 'Tus Items',
    theirItems: 'Sus Items',
    addItem: 'Agregar Item',
    evaluateTrade: 'Evaluar Intercambio (1 Crédito)',
    tradeResult: 'Resultado del Intercambio',
    
    // Marketplace
    marketplaceTitle: 'Mercado',
    comingSoon: 'Próximamente',
    getNotified: 'Recibe una notificación cuando lancemos',
    emailPlaceholder: 'Tu dirección de email',
    notifyMe: 'Notificarme',
    
    // Footer
    copyright: '© 2025 Clutch Studios. Todos los derechos reservados.',
    terms: 'Términos',
    privacy: 'Privacidad',
    support: 'Soporte',
  },
  'pt-br': {
    // Navbar
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
    inventory: 'Inventário',
    analytics: 'Análises',
    settings: 'Configurações',
    login: 'Entrar com Steam',
    
    // Credits section
    aiCredits: 'Créditos IA',
    buyCredits: 'Comprar Créditos',
    analyzeMarket: 'Analisar Mercado',
    
    // Skin table
    skinInventory: 'Inventário de Skins',
    name: 'Nome',
    float: 'Float',
    wear: 'Desgaste',
    purchasePrice: 'Preço de Compra',
    currentPrice: 'Preço Atual',
    profitLoss: 'Lucro/Prejuízo',
    trend: 'Tendência',
    actions: 'Ações',
    
    // Trade evaluator
    tradeEvaluator: 'Avaliador de Trocas',
    yourItems: 'Seus Itens',
    theirItems: 'Itens Deles',
    addItem: 'Adicionar Item',
    evaluateTrade: 'Avaliar Troca (1 Crédito)',
    tradeResult: 'Resultado da Troca',
    
    // Marketplace
    marketplaceTitle: 'Marketplace',
    comingSoon: 'Em Breve',
    getNotified: 'Seja notificado quando lançarmos',
    emailPlaceholder: 'Seu endereço de email',
    notifyMe: 'Notifique-me',
    
    // Footer
    copyright: '© 2025 Clutch Studios. Todos os direitos reservados.',
    terms: 'Termos',
    privacy: 'Privacidade',
    support: 'Suporte',
  },
};

// Example skin data for the table
export const SAMPLE_SKINS = [
  {
    id: 1,
    name: 'AWP | Dragon Lore',
    image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_dragon_lore_light_large.05c5f86a8304700b4239847b96615b4ef698db42.png',
    float: 0.0621,
    wear: 'Factory New',
    purchasePrice: 1250.50,
    currentPrice: 1560.75,
    profitLoss: 310.25,
    trend: 'up',
  },
  {
    id: 2,
    name: 'AK-47 | Asiimov',
    image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_asiimov_light_large.665fc3b83c8046398787a57d2ef7a9d938244820.png',
    float: 0.2814,
    wear: 'Field-Tested',
    purchasePrice: 87.30,
    currentPrice: 94.50,
    profitLoss: 7.20,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Karambit | Fade',
    image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_am_fade_light_large.895032ab09350f3aeccaf3a3c0cc3b535d64afa6.png',
    float: 0.0082,
    wear: 'Factory New',
    purchasePrice: 975.00,
    currentPrice: 1120.00,
    profitLoss: 145.00,
    trend: 'up',
  },
  {
    id: 4,
    name: 'Glock-18 | Fade',
    image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_glock_aa_fade_light_large.61edcc69a1a940551233f9f3ef17eee51746f343.png',
    float: 0.0325,
    wear: 'Factory New',
    purchasePrice: 430.00,
    currentPrice: 405.50,
    profitLoss: -24.50,
    trend: 'down',
  },
  {
    id: 5,
    name: 'M4A4 | Howl',
    image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_m4a1_cu_m4a1_howl_light_large.c64a9fc6bb61b91af92e83fc61f2cc901f477370.png',
    float: 0.0512,
    wear: 'Factory New',
    purchasePrice: 1890.00,
    currentPrice: 2340.00,
    profitLoss: 450.00,
    trend: 'up',
  },
];
