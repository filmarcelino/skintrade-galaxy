
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
    
    // Skin Modal
    addSkin: 'Add Skin',
    editSkin: 'Edit Skin',
    sellSkin: 'Sell Skin',
    skinDetails: 'Skin Details',
    floatValue: 'Float Value',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    skinAdded: 'Skin Added',
    skinEdited: 'Skin Edited',
    skinDeleted: 'Skin Deleted',
    skinSold: 'Skin Sold',
    addToInventory: 'Add to Inventory',
    sellFromInventory: 'Sell from Inventory',
    inspectInGame: 'Inspect in Game',
    pattern: 'Pattern Index',
    stickers: 'Stickers',
    rarity: 'Rarity',
    collection: 'Collection',
    
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
    
    // Skin Modal
    addSkin: 'Añadir Skin',
    editSkin: 'Editar Skin',
    sellSkin: 'Vender Skin',
    skinDetails: 'Detalles de Skin',
    floatValue: 'Valor de Float',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    skinAdded: 'Skin Añadida',
    skinEdited: 'Skin Editada',
    skinDeleted: 'Skin Eliminada',
    skinSold: 'Skin Vendida',
    addToInventory: 'Añadir al Inventario',
    sellFromInventory: 'Vender del Inventario',
    inspectInGame: 'Inspeccionar en Juego',
    pattern: 'Índice de Patrón',
    stickers: 'Pegatinas',
    rarity: 'Rareza',
    collection: 'Colección',
    
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
    
    // Skin Modal
    addSkin: 'Adicionar Skin',
    editSkin: 'Editar Skin',
    sellSkin: 'Vender Skin',
    skinDetails: 'Detalhes da Skin',
    floatValue: 'Valor de Float',
    saveChanges: 'Salvar Alterações',
    cancel: 'Cancelar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    skinAdded: 'Skin Adicionada',
    skinEdited: 'Skin Editada',
    skinDeleted: 'Skin Excluída',
    skinSold: 'Skin Vendida',
    addToInventory: 'Adicionar ao Inventário',
    sellFromInventory: 'Vender do Inventário',
    inspectInGame: 'Inspecionar no Jogo',
    pattern: 'Índice de Padrão',
    stickers: 'Adesivos',
    rarity: 'Raridade',
    collection: 'Coleção',
    
    // Footer
    copyright: '© 2025 Clutch Studios. Todos os direitos reservados.',
    terms: 'Termos',
    privacy: 'Privacidade',
    support: 'Suporte',
  },
};

// Export the sample skins data with both new and legacy property names and proper trend typing
export const SAMPLE_SKINS = [
  {
    id: 1,
    name: "AWP | Dragon Lore",
    float: "0.0132",
    wear: "Factory New",
    purchase_price: 1567.23,
    current_price: 1895.00,
    purchasePrice: 1567.23, // Legacy property
    currentPrice: 1895.00,  // Legacy property
    profitLoss: 327.77,
    trend: "up" as const,
    image: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/130fx97f/image.png",
    acquired_at: "2023-06-08T12:00:00.000Z",
    notes: "Rare skin from Operation Cobblestone",
    popularity: "High",
    pattern: "661",
    stickers: "None",
    rarity: "Covert",
    collection: "The Cobblestone Collection"
  },
  {
    id: 2,
    name: "AK-47 | Fire Serpent",
    float: "0.1523",
    wear: "Field-Tested",
    purchase_price: 750,
    current_price: 685.25,
    purchasePrice: 750,
    currentPrice: 685.25,
    profitLoss: -64.75,
    image: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/130fx97f/image.png",
    trend: "down" as const,
    acquired_at: "2023-04-22",
    notes: "Good sticker placement",
    popularity: "Medium",
    pattern: "215",
    stickers: "Titan (Holo) | Katowice 2014",
    rarity: "Covert",
    collection: "The Bravo Collection"
  },
  {
    id: 3,
    name: "Butterfly Knife | Fade",
    float: "0.0325",
    wear: "Factory New",
    purchase_price: 1800,
    current_price: 2340.50,
    purchasePrice: 1800,
    currentPrice: 2340.50,
    profitLoss: 540.50,
    image: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPL5NqnEk29u5cB1g_zMu9zx0FHg_hY-YWr0I4SQJwM-ZAqE_lS3k-jmgZC4uJrMzHA3siZ0s3nUzwv3308Za-dsm7XAHnW9Vj5c/130fx97f/image.png",
    trend: "up" as const,
    acquired_at: "2023-05-03",
    notes: "95% fade pattern - 0.03 float value",
    popularity: "High",
    pattern: "763",
    stickers: "None",
    rarity: "Covert",
    collection: "The Arms Deal Collection"
  },
  {
    id: 4,
    name: "M4A4 | Howl",
    float: "0.0710",
    wear: "Minimal Wear",
    purchase_price: 3100,
    current_price: 3520.25,
    purchasePrice: 3100,
    currentPrice: 3520.25,
    profitLoss: 420.25,
    image: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09--m5CbkuXLMLrdmlRd4cJ5nqeUpoqs0Aaw_0VlZW_7I9CQcVU8YVnQ8lO7lOjt15S1tZWczHVi7yA/130fx97f/image.png",
    trend: "up" as const,
    acquired_at: "2023-03-11",
    notes: "Contraband item - discontinued",
    popularity: "High",
    pattern: "429",
    stickers: "Crown (Foil)",
    rarity: "Contraband",
    collection: "The Huntsman Collection"
  },
  {
    id: 5,
    name: "Glock-18 | Fade",
    float: "0.0103",
    wear: "Factory New",
    purchase_price: 570,
    current_price: 675.50,
    purchasePrice: 570,
    currentPrice: 675.50,
    profitLoss: 105.50,
    image: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0uL3cy9D_8-JnIWKge66YrrQwGpTsZ0m27DMm4qsixji-UFlZWryZ9eVIwE2ZF6D_gK3w-_v0Z_p7snXiSw0QsSV2p8/130fx97f/image.png",
    trend: "up" as const,
    acquired_at: "2023-01-24",
    notes: "Full fade with good float",
    popularity: "High",
    pattern: "917",
    stickers: "None",
    rarity: "Restricted",
    collection: "The Assault Collection"
  }
];
