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
    float: '0.0089',
    wear: 'Factory New',
    purchase_price: 2500,
    current_price: 4650.75,
    profitLoss: 2150.75,
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR4tuzq4GIlPL6J6iEqWdF7ddOhuDG_Zi7jAW1_xBqMG_yIY_GJwc_ZQvT_1e5wefmjZ-5v5_BnSRqsnRwt3iOmB3kgEsaPOc-m7XAHpIXf31e',
    trend: 'up',
    acquired_at: '2023-06-15',
    notes: 'Rare collector item, highly desired pattern'
  },
  {
    id: 2,
    name: 'AK-47 | Fire Serpent',
    float: '0.1523',
    wear: 'Field-Tested',
    purchase_price: 750,
    current_price: 685.25,
    profitLoss: -64.75,
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-3hpSOm8j4OrzZgiUFu8By27iT9NWm2VK1_EE-Y273cIOQdFQ-Nw2C_FPqwL--jJO9u8nXiSw0A9nbvQ',
    trend: 'down',
    acquired_at: '2023-04-22',
    notes: 'Good sticker placement'
  },
  {
    id: 3,
    name: 'Butterfly Knife | Fade',
    float: '0.0325',
    wear: 'Factory New',
    purchase_price: 1800,
    current_price: 2340.50,
    profitLoss: 540.50,
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPL5NqnEk29u5cB1g_zMu9zx0FHg_hY-YWr0I4SQJwM-ZAqE_lS3k-jmgZC4uJrMzHA3siZ0s3nUzwv3308Za-dsm7XAHnW9Vj5c',
    trend: 'up',
    acquired_at: '2023-05-03',
    notes: '95% fade pattern - 0.03 float value'
  },
  {
    id: 4,
    name: 'M4A4 | Howl',
    float: '0.0710',
    wear: 'Minimal Wear',
    purchase_price: 3100,
    current_price: 3520.25, 
    profitLoss: 420.25,
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09--m5CbkuXLMLrdmlRd4cJ5nqeUpoqs0Aaw_0VlZW_7I9CQcVU8YVnQ8lO7lOjt15S1tZWczHVi7yAn-z-DyPKUvH6D',
    trend: 'up',
    acquired_at: '2023-03-11',
    notes: 'Contraband item - discontinued'
  },
  {
    id: 5,
    name: 'Glock-18 | Fade',
    float: '0.0103',
    wear: 'Factory New',
    purchase_price: 570,
    current_price: 675.50,
    profitLoss: 105.50,
    image: 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3cy9D_8-JnIWKge66YrrQwGpTsZ0m27DMm4qsixji-UFlZWryZ9eVIwE2ZF6D_gK3w-_v0Z_p7snXiSw0QsSV2p8',
    trend: 'up',
    acquired_at: '2023-01-24',
    notes: 'Full fade with good float'
  }
];
