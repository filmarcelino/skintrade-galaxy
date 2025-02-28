import { Skin } from './types';

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
export const SAMPLE_SKINS: Skin[] = [
  {
    id: 1,
    name: "AWP | Dragon Lore",
    float: "0.0420",
    wear: "Factory New",
    purchasePrice: 1200,
    currentPrice: 1560.75,
    profitLoss: 360.75,
    trend: "up",
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5Mx2gv3--Y3nj1H6qBJvZmn3cIKQcQQ-ZlzW_wO8xLvr1JS06ZnLnHFjuSQn7XnUyxK2hgYMMLLJ95kbcA"
  },
  {
    id: 2,
    name: "M4A4 | Howl",
    float: "0.0103",
    wear: "Factory New",
    purchasePrice: 900,
    currentPrice: 1350,
    profitLoss: 450,
    trend: "up",
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09-vloWZh-L6OITck29Y_chOhujT8om73wXkrkFoZGyldYSddwI-YguBrFe_kLzq08-i_MOe5SL2eY4"
  },
  {
    id: 3,
    name: "Glock-18 | Fade",
    float: "0.0085",
    wear: "Factory New",
    purchasePrice: 500,
    currentPrice: 405.5,
    profitLoss: -94.5,
    trend: "down",
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJkIGZnLryMrfdqWdY781lteXA54vwxgzj-RA-ZjilJITAJFQ_NwzQ_wW7w7u9gp7vtJucwXMwvCQ8pSGKDlVCsJ4"
  },
  {
    id: 4,
    name: "AK-47 | Fire Serpent",
    float: "0.1584",
    wear: "Field-Tested",
    purchasePrice: 350,
    currentPrice: 425,
    profitLoss: 75,
    trend: "up",
    image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV0924gYKChMj4OrzZglRd6dd2j6fC9t3x3wHjrxI5YGH7cteQclA_Yw3Y_FbqxOzugcO77ZjInHQ16SkhsXrcn0G3n1gSOQVVQs9z"
  }
];
