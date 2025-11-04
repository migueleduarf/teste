/* ============================================ */
/* APPLE JUICE - E-COMMERCE DE TECNOLOGIA */
/* Arquivo JavaScript Principal */
/* ============================================ */

/* 
 * ÍNDICE DO CÓDIGO:
 * 
 * 1. ESTADO GLOBAL (linhas 1-20)
 * 2. BANCO DE DADOS DE PRODUTOS (linhas 20-400)
 * 3. SISTEMA DE PROMOÇÕES DINÂMICAS (linhas 400-600)
 * 4. FUNÇÕES DE INICIALIZAÇÃO (linhas 600-800)
 * 5. RENDERIZAÇÃO DE PÁGINAS (linhas 800-1500)
 * 6. SISTEMA DE CARRINHO (linhas 1500-1700)
 * 7. SISTEMA DE USUÁRIO/LOGIN (linhas 1700-2100)
 * 8. FUNCIONALIDADES DE UI (linhas 2100-2211)
 */

/* ============================================ */
/* 1. ESTADO GLOBAL */
/* ============================================ */
/* 
 * Estas variáveis armazenam o estado atual do aplicativo.
 * Elas são modificadas conforme o usuário navega e interage com o site.
 */

let currentPage = 'home';           // Página atual sendo exibida ('home', 'gaming', 'promotions', etc)
let cartItems = [];                 // Array com os produtos no carrinho de compras
let favorites = [];                 // Array com IDs dos produtos favoritos do usuário
let searchTerm = '';                // Termo de busca digitado pelo usuário
let selectedCategory = 'Todos';     // Categoria de produtos selecionada
let currentUser = null;             // Objeto com dados do usuário logado (ou null se não logado)
let theme = 'light';                // Tema atual ('light' ou 'dark')
let products = [];                  // Array final de produtos (após aplicar promoções)

/* ============================================ */
/* 2. BANCO DE DADOS DE PRODUTOS */
/* ============================================ */
/*
 * Este array contém TODOS os produtos da loja.
 * Cada produto tem as seguintes propriedades:
 * 
 * - id: Número único que identifica o produto
 * - name: Nome descritivo do produto
 * - price: Preço atual (com desconto se houver)
 * - originalPrice: Preço original antes do desconto
 * - image: URL da imagem do produto (Unsplash)
 * - rating: Avaliação de 0 a 5 estrelas
 * - reviews: Número de avaliações que o produto recebeu
 * - category: Categoria do produto (Gaming, Home Office, etc)
 * 
 * IMPORTANTE: Este é o array BASE. As promoções dinâmicas são aplicadas
 * depois pela função applyDynamicPromotions() criando o array 'products'
 */

const baseProducts = [
  /* ========== CATEGORIA: GAMING ========== */
  {
    id: 1,
    name: "Placa de Vídeo RTX 4080 Super - 16GB GDDR6X",
    price: 6999.99,
    originalPrice: 8999.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljcyUyMGNhcmQlMjBnYW1pbmd8ZW58MXx8fHwxNzU5NDQxNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 267,
    category: "Gaming"
  },
  {
    id: 2,
    name: "Processador AMD Ryzen 7 7800X3D - 8 Cores/16 Threads",
    price: 3199.99,
    originalPrice: 3999.99,
    image: "https://images.unsplash.com/photo-1555617981-dac675c97c8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9jZXNzb3IlMjBhbWQlMjByeXplbnxlbnwxfHx8fDE3NTk0NDE1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 198,
    category: "Gaming"
  },
  {
    id: 3,
    name: "Monitor 4K 32\" IPS - 144Hz HDR Gaming",
    price: 2499.99,
    originalPrice: 3299.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25pdG9yJTIwZ2FtaW5nJTIwNGt8ZW58MXx8fHwxNzU5NDQxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 342,
    category: "Gaming"
  },
  {
    id: 4,
    name: "PC Gamer Completo - RTX 4070 Ti + Ryzen 9",
    price: 9999.99,
    originalPrice: 12999.99,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwY3xlbnwxfHx8fDE3NTk0NDE1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 412,
    category: "Gaming"
  },
  
  // Home Office
  {
    id: 5,
    name: "Cadeira Gamer Ergonômica - Suporte Lombar Premium",
    price: 1299.99,
    originalPrice: 1799.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGFpcnxlbnwxfHx8fDE3NTk0NDE1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 189,
    category: "Home Office"
  },
  {
    id: 6,
    name: "Mesa Gamer LED RGB - Altura Ajustável",
    price: 899.99,
    originalPrice: 1299.99,
    image: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBkZXNrfGVufDF8fHx8MTc1OTQ0MTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 156,
    category: "Home Office"
  },
  {
    id: 7,
    name: "Notebook Ultrabook - i7 11ª Gen, 16GB RAM",
    price: 4599.99,
    originalPrice: 5999.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3B8ZW58MXx8fHwxNzU5NDQxNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 301,
    category: "Home Office"
  },
  {
    id: 8,
    name: "Webcam Full HD 1080p - Microfone Integrado",
    price: 349.99,
    originalPrice: 499.99,
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW18ZW58MXx8fHwxNzU5NDQxNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    reviews: 278,
    category: "Home Office"
  },
  
  // Uso Profissional
  {
    id: 9,
    name: "Workstation Dell Precision - Xeon + 64GB RAM",
    price: 15999.99,
    originalPrice: 19999.99,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3RhdGlvbiUyMGNvbXB1dGVyfGVufDF8fHx8MTc1OTQ0MTUyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 89,
    category: "Uso Profissional"
  },
  {
    id: 10,
    name: "Monitor Profissional 27\" 4K - Calibração de Cores",
    price: 3299.99,
    originalPrice: 4499.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25pdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1OTQ0MTUzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 143,
    category: "Uso Profissional"
  },
  {
    id: 11,
    name: "Servidor Rack HP - Dual Xeon, 128GB RAM",
    price: 24999.99,
    originalPrice: 29999.99,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrfGVufDF8fHx8MTc1OTQ0MTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 67,
    category: "Uso Profissional"
  },
  {
    id: 12,
    name: "Plotter HP DesignJet - Impressão Profissional A0",
    price: 18999.99,
    originalPrice: 22999.99,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcmludGVyfGVufDF8fHx8MTc1OTQ0MTUzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 54,
    category: "Uso Profissional"
  },
  
  // Acessórios
  {
    id: 13,
    name: "Hub USB-C 7 em 1 - HDMI 4K + Ethernet",
    price: 249.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2IlMjBodWJ8ZW58MXx8fHwxNzU5NDQxNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 512,
    category: "Acessórios"
  },
  {
    id: 14,
    name: "Suporte Monitor Articulado - Duplo",
    price: 349.99,
    originalPrice: 499.99,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25pdG9yJTIwYXJtfGVufDF8fHx8MTc1OTQ0MTUzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 287,
    category: "Acessórios"
  },
  {
    id: 15,
    name: "Mousepad XL Gamer - 900x400mm RGB",
    price: 129.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VzZXBhZCUyMGdhbWVyfGVufDF8fHx8MTc1OTQ0MTU0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 623,
    category: "Acessórios"
  },
  {
    id: 16,
    name: "Fone Headset Gamer - 7.1 Surround + Microfone",
    price: 449.99,
    originalPrice: 699.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc1OTQ0MTU0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 891,
    category: "Acessórios"
  },
  
  // Periféricos
  {
    id: 17,
    name: "Teclado Mecânico RGB - Switches Cherry MX Blue",
    price: 649.99,
    originalPrice: 899.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNsYWRvJTIwbWVjYW5pY28lMjByZ2J8ZW58MXx8fHwxNzU5NDQxNTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 523,
    category: "Periféricos"
  },
  {
    id: 18,
    name: "Mouse Gamer RGB - 16000 DPI + 7 Botões",
    price: 299.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NTk0NDE1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 734,
    category: "Periféricos"
  },
  {
    id: 19,
    name: "Impressora Multifuncional HP - Tanque de Tinta",
    price: 1099.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVyfGVufDF8fHx8MTc1OTQ0MTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 412,
    category: "Periféricos"
  },
  {
    id: 20,
    name: "Joystick Xbox Series X - Wireless Bluetooth",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTk0NDE1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 856,
    category: "Periféricos"
  },
  
  // Componentes
  {
    id: 21,
    name: "SSD NVMe 2TB - PCIe Gen 4 7000MB/s",
    price: 999.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzc2QlMjBkcml2ZXxlbnwxfHx8fDE3NTk0NDE1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 567,
    category: "Componentes"
  },
  {
    id: 22,
    name: "Memória RAM DDR5 32GB - 6000MHz RGB",
    price: 899.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW0lMjBtZW1vcnl8ZW58MXx8fHwxNzU5NDQxNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 423,
    category: "Componentes"
  },
  {
    id: 23,
    name: "Fonte 850W 80 Plus Gold - Modular Full",
    price: 749.99,
    originalPrice: 999.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHN1cHBseXxlbnwxfHx8fDE3NTk0NDE1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 387,
    category: "Componentes"
  },
  {
    id: 24,
    name: "Placa Mãe B650 - AM5 DDR5 PCIe 5.0",
    price: 1299.99,
    originalPrice: 1699.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXJib2FyZHxlbnwxfHx8fDE3NTk0NDE1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 298,
    category: "Componentes"
  },
  {
    id: 25,
    name: "Water Cooler 360mm RGB - Sistema de Refrigeração",
    price: 799.99,
    originalPrice: 1099.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29saW5nJTIwc3lzdGVtfGVufDF8fHx8MTc1OTQ0MTU1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 456,
    category: "Componentes"
  }
];

/* ============================================ */
/* 3. SISTEMA DE PROMOÇÕES DINÂMICAS */
/* ============================================ */
/*
 * Este sistema faz as promoções mudarem automaticamente baseado em:
 * - Hora do dia (manhã, tarde, noite, madrugada)
 * - Dia da semana (segunda, terça, etc)
 * - Dia do mês (para criar variação)
 * 
 * As funções trabalham juntas para decidir quais produtos
 * devem estar em promoção e quais são best sellers
 */

/**
 * Obtém as promoções baseadas no horário e dia atual
 * 
 * @returns {Object} Objeto com informações sobre as promoções:
 *   - seed: Número único baseado na data (para gerar promoções consistentes)
 *   - timeBasedPromos: Categorias em promoção pelo horário
 *   - weeklyPromos: Categorias em promoção pelo dia da semana
 *   - hour: Hora atual (0-23)
 *   - dayOfWeek: Dia da semana (0=domingo, 1=segunda, ...)
 */
function getTimeBasedPromotions() {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const dayOfMonth = now.getDate();
  
  const seed = dayOfMonth * 100 + Math.floor(hour / 6);
  
  const timeBasedPromos = {
    earlyMorning: hour >= 0 && hour < 6 ? ['Gaming'] : [],
    morning: hour >= 6 && hour < 12 ? ['Home Office'] : [],
    afternoon: hour >= 12 && hour < 18 ? ['Uso Profissional'] : [],
    evening: hour >= 18 ? ['Acessórios'] : []
  };
  
  const weeklyPromos = {
    monday: dayOfWeek === 1 ? ['Gaming'] : [],
    tuesday: dayOfWeek === 2 ? ['Home Office'] : [],
    wednesday: dayOfWeek === 3 ? ['Uso Profissional'] : [],
    thursday: dayOfWeek === 4 ? ['Acessórios'] : [],
    friday: dayOfWeek === 5 ? ['Gaming', 'Home Office', 'Uso Profissional', 'Acessórios'] : [],
    weekend: (dayOfWeek === 0 || dayOfWeek === 6) ? ['Gaming'] : []
  };
  
  return {
    seed,
    timeBasedPromos: Object.values(timeBasedPromos).flat(),
    weeklyPromos: Object.values(weeklyPromos).flat(),
    hour,
    dayOfWeek
  };
}

/**
 * Decide se um produto específico deve estar em promoção
 * 
 * Usa um algoritmo pseudo-aleatório para manter consistência:
 * - Mesmo produto terá mesma resposta durante o mesmo período
 * - Muda automaticamente quando muda hora/dia
 * 
 * @param {number} productId - ID do produto
 * @param {string} category - Categoria do produto
 * @returns {boolean} true se deve estar em promoção, false caso contrário
 */
function shouldBeOnSale(productId, category) {
  const promoData = getTimeBasedPromotions();
  const { seed, timeBasedPromos, weeklyPromos, hour, dayOfWeek } = promoData;
  
  // Gera número "aleatório" entre 0 e 1, mas consistente para mesmo produto/dia/hora
  const random = ((productId * seed * 9301 + 49297) % 233280) / 233280;
  
  // Chance base de 60% de estar em promoção
  let saleChance = 0.6;
  
  // Se a categoria está em promo��ão pelo horário, aumenta 20%
  if (timeBasedPromos.includes(category)) {
    saleChance += 0.2;
  }
  
  // Se a categoria está em promoção pelo dia da semana, aumenta 15%
  if (weeklyPromos.includes(category)) {
    saleChance += 0.15;
  }
  
  // SEXTA-FEIRA: Mega promoção! 95% de chance
  if (dayOfWeek === 5) {
    saleChance = 0.95;
  }
  
  // FIM DE SEMANA: Gaming em super promoção! 90% de chance
  if ((dayOfWeek === 0 || dayOfWeek === 6) && category === 'Gaming') {
    saleChance = 0.9;
  }
  
  // Compara o número aleatório com a chance calculada
  return random < saleChance;
}

/**
 * Decide se um produto deve ser marcado como "Best Seller"
 * 
 * @param {number} productId - ID do produto
 * @param {string} category - Categoria do produto
 * @returns {boolean} true se deve ser best seller
 */
function shouldBeBestSeller(productId, category) {
  const promoData = getTimeBasedPromotions();
  const { seed, hour } = promoData;
  
  // Gera número "aleatório" consistente (diferente do usado em promoções)
  const random = ((productId * seed * 7919 + 11731) % 233280) / 233280;
  
  // Chance base de 30% de ser best seller
  let bestsellerChance = 0.3;
  
  // Produtos com ID baixo (mais antigos) têm mais chance de serem best sellers
  if (productId <= 20) bestsellerChance += 0.2;
  
  // Horário nobre (18h-22h): aumenta vendas, mais best sellers
  if (hour >= 18 && hour <= 22) {
    bestsellerChance += 0.1;
  }
  
  return random < bestsellerChance;
}

/**
 * Aplica todas as promoções dinâmicas aos produtos
 * 
 * Esta função:
 * 1. Pega o array base de produtos
 * 2. Para cada produto, decide se está em promoção
 * 3. Decide se é best seller
 * 4. Retorna novo array com as flags isOnSale e isBestSeller
 * 
 * @returns {Array} Array de produtos com promoções aplicadas
 */
function applyDynamicPromotions() {
  return baseProducts.map(product => ({
    ...product,  // Copia todas as propriedades do produto
    isOnSale: shouldBeOnSale(product.id, product.category),
    isBestSeller: shouldBeBestSeller(product.id, product.category)
  }));
}

/**
 * Obtém informações sobre a promoção atual baseada no horário e dia
 * 
 * @returns {Object} Objeto com informações da promoção:
 *   - title: Título da promoção
 *   - description: Descrição da promoção
 *   - badge: Badge/etiqueta da promoção
 *   - discount: Percentual de desconto
 *   - color: Classe de cor CSS para o banner
 */
function getCurrentPromoInfo() {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  // SEXTA-FEIRA: Mega Promoção
  if (dayOfWeek === 5) {
    return {
      title: '🔥 MEGA SEXTA-FEIRA!',
      description: 'Descontos de até 50% em TODAS as categorias!',
      badge: 'Black Friday',
      discount: 'Até 50%',
      color: 'bg-gradient-to-r from-red-800 to-red-900'
    };
  }
  
  // FIM DE SEMANA: Gaming em destaque
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      title: '🎮 WEEKEND GAMER!',
      description: 'Promoções especiais em produtos Gaming!',
      badge: 'Gaming Weekend',
      discount: 'Até 40%',
      color: 'bg-gradient-to-r from-purple-800 to-indigo-800'
    };
  }
  
  // Promoções por período do dia
  if (hour >= 0 && hour < 6) {
    return {
      title: '🌙 MADRUGADA DE OFERTAS!',
      description: 'Descontos especiais para quem não dorme!',
      badge: 'Noite Adentro',
      discount: 'Até 35%',
      color: 'bg-gradient-to-r from-blue-900 to-purple-900'
    };
  }
  
  if (hour >= 6 && hour < 12) {
    return {
      title: '☀️ BOM DIA COM ECONOMIA!',
      description: 'Comece o dia com ofertas em Home Office!',
      badge: 'Manhã Produtiva',
      discount: 'Até 30%',
      color: 'bg-gradient-to-r from-orange-600 to-yellow-600'
    };
  }
  
  if (hour >= 12 && hour < 18) {
    return {
      title: '🏢 TARDE PROFISSIONAL!',
      description: 'Equipamentos profissionais com descontos incríveis!',
      badge: 'Profissional',
      discount: 'Até 35%',
      color: 'bg-gradient-to-r from-cyan-700 to-blue-700'
    };
  }
  
  // Noite (18h-23h59)
  return {
    title: '🌆 NOITE DE TECNOLOGIA!',
    description: 'Acessórios e periféricos em promoção!',
    badge: 'Boa Noite',
    discount: 'Até 30%',
    color: 'bg-gradient-to-r from-red-700 to-red-800'
  };
}

/**
 * Calcula o tempo restante até a próxima mudança de promoção
 * 
 * @returns {string|null} String com tempo formatado ou null
 */
function getTimeLeft() {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  // Se for sexta-feira, conta até o fim do dia
  if (dayOfWeek === 5) {
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight - now;
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hoursLeft}h ${minutesLeft}m`;
  }
  
  // Se for fim de semana, conta até segunda-feira
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const monday = new Date();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 2;
    monday.setDate(monday.getDate() + daysUntilMonday);
    monday.setHours(0, 0, 0, 0);
    const diff = monday - now;
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    return `${hoursLeft}h`;
  }
  
  // Calcula tempo até a próxima faixa horária (6h, 12h, 18h, 00h)
  let nextChange;
  if (hour < 6) {
    nextChange = 6;
  } else if (hour < 12) {
    nextChange = 12;
  } else if (hour < 18) {
    nextChange = 18;
  } else {
    nextChange = 24;
  }
  
  const hoursLeft = nextChange - hour;
  const minutesLeft = 59 - now.getMinutes();
  
  if (hoursLeft > 0) {
    return `${hoursLeft}h ${minutesLeft}m`;
  } else {
    return `${minutesLeft}m`;
  }
}

/**
 * Filtra os produtos baseado na categoria selecionada e termo de busca
 * 
 * @returns {Array} Array de produtos filtrados
 */
function getFilteredProducts() {
  let filtered = products;
  
  // Filtra por categoria se não for "Todos"
  if (selectedCategory !== 'Todos') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  
  // Filtra por termo de busca
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );
  }
  
  return filtered;
}

/**
 * Calcula estatísticas das promoções atuais
 * 
 * @returns {Object} Objeto com estatísticas:
 *   - totalProducts: Total de produtos
 *   - onSale: Total de produtos em promoção
 *   - bestSellers: Total de best sellers
 *   - avgDiscount: Desconto médio
 */
function getPromoStats() {
  const onSaleProducts = products.filter(p => p.isOnSale);
  const bestSellers = products.filter(p => p.isBestSeller);
  
  // Calcula desconto médio
  let totalDiscount = 0;
  onSaleProducts.forEach(p => {
    if (p.originalPrice > p.price) {
      const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100;
      totalDiscount += discount;
    }
  });
  
  const avgDiscount = onSaleProducts.length > 0 
    ? Math.round(totalDiscount / onSaleProducts.length) 
    : 0;
  
  return {
    totalProducts: products.length,
    onSale: onSaleProducts.length,
    bestSellers: bestSellers.length,
    avgDiscount: avgDiscount
  };
}

/**
 * Renderiza as estatísticas de promoções
 * 
 * @param {Object} stats - Objeto com estatísticas
 * @returns {string} HTML das estatísticas
 */
function renderPromoStats(stats) {
  return `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 p-4 rounded-lg text-center border border-red-200 dark:border-red-800/30">
        <div class="text-3xl font-bold text-red-800 dark:text-red-400">${stats.totalProducts}</div>
        <div class="text-sm text-muted-foreground mt-1">Total de Produtos</div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-800/30">
        <div class="text-3xl font-bold text-orange-800 dark:text-orange-400">${stats.onSale}</div>
        <div class="text-sm text-muted-foreground mt-1">Em Promoção</div>
      </div>
      
      <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 p-4 rounded-lg text-center border border-yellow-200 dark:border-yellow-800/30">
        <div class="text-3xl font-bold text-yellow-800 dark:text-yellow-400">${stats.bestSellers}</div>
        <div class="text-sm text-muted-foreground mt-1">Best Sellers</div>
      </div>
      
      <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-4 rounded-lg text-center border border-green-200 dark:border-green-800/30">
        <div class="text-3xl font-bold text-green-800 dark:text-green-400">${stats.avgDiscount}%</div>
        <div class="text-sm text-muted-foreground mt-1">Desconto Médio</div>
      </div>
    </div>
  `;
}


// Initialize
function init() {
  console.log('🚀 Iniciando Apple Juice...');
  
  try {
    // Preenche o objeto SIDEBARS após o DOM ter sido carregado.
    SIDEBARS = {
      'cart-sidebar': {
        sidebar: document.getElementById('cart-sidebar'),
        overlay: document.getElementById('cart-overlay'),
      },
      'user-panel': {
        sidebar: document.getElementById('user-panel'),
        overlay: document.getElementById('user-panel-overlay'),
      }
    };

    // Carrega as configurações e renderiza o conteúdo
    console.log('📋 Carregando tema...');
    loadTheme();
    
    console.log('👤 Carregando usuário...');
    loadUser();
    
    console.log('🛍️ Inicializando produtos...');
    initializeProducts();
    
    console.log('🎨 Renderizando página...');
    renderPage();
    
    // Anexa os event listeners aos elementos da UI
    console.log('🔗 Anexando event listeners...');
    initializeEventListeners();

    console.log('⏰ Iniciando timer de promoções...');
    startPromoTimer();
    
    // Initialize Lucide icons
    console.log('✨ Inicializando ícones...');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
      console.log('✅ Ícones Lucide carregados!');
    } else {
      console.warn('⚠️ Lucide não está disponível!');
    }
    
    console.log('✅ Inicialização completa! Site pronto!');
  } catch (error) {
    console.error('❌ ERRO na inicialização:', error);
  }
}

function loadUser() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUserStatus();
    } catch (e) {
      console.error('Error loading user:', e);
      localStorage.removeItem('currentUser');
    }
  }
}

function initializeProducts() {
  products = applyDynamicPromotions();
}

function startPromoTimer() {
  // Update promotions every minute
  setInterval(() => {
    initializeProducts();
    if (currentPage === 'home') {
      const heroSection = document.querySelector('.bg-gradient-to-r');
      if (heroSection) {
        // Re-render just the hero section with updated promo info
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          renderHomePage(mainContent);
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      }
    } else if (currentPage === 'promotions') {
      renderPage();
    }
  }, 60 * 1000); // Update every minute
  
  // Also update every 6 hours for major promo changes
  setInterval(() => {
    initializeProducts();
    renderPage();
  }, 6 * 60 * 60 * 1000); // Update every 6 hours
}

// Theme Management
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme = savedTheme;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme();
}

function applyTheme() {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// Navigation
function navigateTo(page) {
  currentPage = page;
  renderPage();
  closeMobileMenu();
  toggleCart(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Update page title
  const pageTitles = {
    'home': 'Apple Juice - E-commerce de Tecnologia',
    'gaming': 'Gaming - Apple Juice',
    'home-office': 'Home Office - Apple Juice',
    'professional': 'Uso Profissional - Apple Juice',
    'accessories': 'Acessórios - Apple Juice',
    'peripherals': 'Periféricos - Apple Juice',
    'components': 'Componentes - Apple Juice',
    'promotions': 'Promoções - Apple Juice',
    'checkout': 'Checkout - Apple Juice'
  };
  
  document.title = pageTitles[page] || pageTitles['home'];
}

function renderPage() {
  const mainContent = document.getElementById('main-content');
  
  switch (currentPage) {
    case 'home':
      renderHomePage(mainContent);
      break;
    case 'gaming':
      renderCategoryPage(mainContent, 'Gaming');
      break;
    case 'home-office':
      renderCategoryPage(mainContent, 'Home Office');
      break;
    case 'professional':
      renderCategoryPage(mainContent, 'Uso Profissional');
      break;
    case 'accessories':
      renderCategoryPage(mainContent, 'Acessórios');
      break;
    case 'peripherals':
      renderCategoryPage(mainContent, 'Periféricos');
      break;
    case 'components':
      renderCategoryPage(mainContent, 'Componentes');
      break;
    case 'promotions':
      renderPromotionsPage(mainContent);
      break;
    case 'checkout':
      renderCheckoutPage(mainContent);
      break;
    default:
      renderHomePage(mainContent);
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Home Page Components
function renderHomePage(container) {
  container.innerHTML = `
    ${renderHeroSection()}
    ${renderCategorySection()}
    ${renderFeaturedProducts()}
    ${renderNewsletter()}
    ${renderFooter()}
  `;
}

function renderHeroSection() {
  const promoInfo = getCurrentPromoInfo();
  const timeLeft = getTimeLeft();
  
  return `
    <section class="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl lg:text-6xl font-bold mb-6">
              <span class="text-always-black">Bem-vindo à</span>
              <span class="text-red-800"> Apple Juice</span>
            </h1>
            <p class="text-xl text-muted-foreground mb-8">
              Sua loja especializada em peças de PC, gaming, home office e acessórios tecnológicos. 
              Encontre os melhores produtos com preços incríveis!
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button onclick="scrollToProducts()" class="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-colors">
                Ver Produtos
              </button>
              <button onclick="scrollToNewsletter()" class="border border-border bg-background text-foreground px-6 py-3 rounded-lg transition-colors hover:bg-muted">
                Promoções do Dia
              </button>
            </div>
            
            <div class="mt-12 flex items-center space-x-8 text-sm text-muted-foreground">
              <div class="flex items-center">
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">✓</span>
                Frete Grátis acima de R$ 299
              </div>
              <div class="flex items-center">
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">✓</span>
                Parcelamento em até 12x
              </div>
              <div class="flex items-center">
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">✓</span>
                Garantia estendida
              </div>
            </div>
          </div>
          
          <div class="relative">
            <img 
              src="https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc1OTQ0MTUwOXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Setup Gaming Professional"
              class="rounded-lg shadow-2xl w-full h-auto"
              onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwVjIwME0xNTAgMTUwSDE1MCIgc3Ryb2tlPSIjOUIwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'"
            />
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCategorySection() {
  const categoryImages = {
    gaming: 'https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc2MDUzMTk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    homeOffice: 'https://images.unsplash.com/photo-1614598389565-8d56eddd2f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwZGVza3xlbnwxfHx8fDE3NjA2MTE3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    professional: 'https://images.unsplash.com/photo-1760348213351-76638ffff25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NjA2MTE3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    accessories: 'https://images.unsplash.com/photo-1678852524356-08188528aed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwNjExNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    peripherals: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    components: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500'
  };

  return `
    <section id="categorias" class="py-16 bg-gray-50 dark:bg-gray-900/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-foreground mb-4">Nossas Categorias</h2>
          <p class="text-lg text-muted-foreground">Encontre exatamente o que você precisa em nossas categorias especializadas</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onclick="navigateTo('gaming')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.gaming}" alt="Gaming" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="gamepad-2" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Gaming</h3>
              <p class="text-muted-foreground text-sm mb-3">Placas de vídeo, periféricos e componentes para gamers</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">150+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('home-office')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.homeOffice}" alt="Home Office" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="home" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Home Office</h3>
              <p class="text-muted-foreground text-sm mb-3">Monitores, webcams e equipamentos para trabalho remoto</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">200+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('professional')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.professional}" alt="Uso Profissional" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="briefcase" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Uso Profissional</h3>
              <p class="text-muted-foreground text-sm mb-3">Workstations, servidores e equipamentos corporativos</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">80+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('accessories')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.accessories}" alt="Acessórios" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="headphones" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Acessórios</h3>
              <p class="text-muted-foreground text-sm mb-3">Cabos, suportes, periféricos e muito mais</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">300+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('peripherals')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.peripherals}" alt="Periféricos" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="keyboard" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Periféricos</h3>
              <p class="text-muted-foreground text-sm mb-3">Teclados, mouses, impressoras</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">250+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('components')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
              <img src="${categoryImages.components}" alt="Componentes" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <i data-lucide="cpu" class="w-6 h-6 text-white"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Componentes</h3>
              <p class="text-muted-foreground text-sm mb-3">SSDs, RAMs, placas mãe</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">180+ produtos</span>
                <span class="text-red-600 text-sm font-medium group-hover:text-red-800">Ver produtos →</span>
              </div>
            </div>
          </div>
          
          <div onclick="navigateTo('promotions')" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
            <div class="p-8 text-center">
              <div class="text-red-800 mb-4">
                <i data-lucide="tag" class="w-16 h-16 mx-auto"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Promoções</h3>
              <p class="text-muted-foreground text-sm mb-3">Ofertas especiais do dia</p>
              <span class="inline-block bg-red-800 text-white px-4 py-2 rounded-full text-sm font-medium">Ver ofertas →</span>
            </div>
          </div>
          
          <div onclick="scrollToNewsletter()" class="card cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 bg-gradient-to-r from-red-600 to-red-800 text-white">
            <div class="p-8 text-center">
              <div class="mb-4">
                <i data-lucide="percent" class="w-16 h-16 mx-auto"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Ofertas VIP</h3>
              <p class="opacity-90 text-sm mb-3">Receba descontos exclusivos</p>
              <span class="inline-block bg-white text-red-800 px-4 py-2 rounded-full text-sm font-medium">Cadastre-se →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFeaturedProducts() {
  const filteredProducts = getFilteredProducts();
  const promoStats = getPromoStats();
  
  return `
    <section id="produtos" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        ${selectedCategory === 'Todos' && !searchTerm ? renderPromoStats(promoStats) : ''}
        
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-foreground mb-4">
            ${selectedCategory === 'Todos' ? 'Produtos em Destaque' : `Categoria: ${selectedCategory}`}
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            ${searchTerm ? `Resultados para "${searchTerm}"` : 'Confira nossa seleção especial de produtos com os melhores preços e qualidade garantida'}
          </p>
          ${filteredProducts.length > 0 ? `
            <p class="text-sm text-muted-foreground/70 mt-2">
              ${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}
            </p>
          ` : ''}
        </div>

        ${filteredProducts.length === 0 ? `
          <div class="text-center py-12">
            <h3 class="text-xl font-semibold text-foreground mb-4">
              Nenhum produto encontrado
            </h3>
            <p class="text-muted-foreground mb-6">
              Tente ajustar sua busca ou explorar outras categorias
            </p>
            <button onclick="scrollToCategories()" class="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition-colors">
              Ver Categorias
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${filteredProducts.map(product => renderProductCard(product)).join('')}
          </div>

          <div class="text-center mt-12">
            <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-lg transition-colors">
              Voltar ao Topo
            </button>
          </div>
        `}
      </div>
    </section>
  `;
}

function renderProductCard(product) {
  const isFavorite = favorites.includes(product.id);
  
  return `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <div class="relative">
        <img 
          src="${product.image}" 
          alt="${product.name}"
          class="product-image"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzBWMTMwTTEyMCAxMDBIMTgwIiBzdHJva2U9IiM5QjAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4='"
        />
        ${product.isOnSale ? '<div class="badge badge-sale absolute top-2 left-2">OFERTA</div>' : ''}
        ${product.isBestSeller ? '<div class="badge badge-bestseller absolute top-2 right-2">BEST SELLER</div>' : ''}
        
        <button 
          onclick="event.stopPropagation(); toggleFavorite(${product.id})" 
          class="absolute bottom-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <i data-lucide="heart" class="w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}"></i>
        </button>
      </div>
      
      <div class="p-4">
        <div class="category-badge">${product.category}</div>
        
        <h3 class="font-semibold text-foreground mb-2 mt-6">${product.name}</h3>
        
        <div class="star-rating mb-2">
          ${renderStars(product.rating)}
          <span class="text-sm text-muted-foreground ml-2">(${product.reviews})</span>
        </div>
        
        <div class="flex items-center gap-2 mb-4">
          <span class="price-current">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          ${product.isOnSale ? `<span class="price-original">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
        </div>
        
        <button 
          onclick="event.stopPropagation(); addToCart(${product.id})" 
          class="w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg transition-colors"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i data-lucide="star" class="star w-4 h-4"></i>';
  }
  
  if (hasHalfStar) {
    starsHtml += '<i data-lucide="star" class="star star-half w-4 h-4"></i>';
  }
  
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i data-lucide="star" class="star star-empty w-4 h-4"></i>';
  }
  
  return starsHtml;
}

/**
 * Obtém informações sobre a próxima mudança de promoção
 * 
 * @returns {Object} Informação sobre próxima promoção
 */
function getNextPromoChange() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  let nextPromoType = '';
  
  // Determinar próxima mudança
  if (hour < 6) {
    nextPromoType = 'Manhã (6h-12h)';
  } else if (hour < 12) {
    nextPromoType = 'Tarde (12h-18h)';
  } else if (hour < 18) {
    nextPromoType = 'Noite (18h-0h)';
  } else {
    nextPromoType = 'Madrugada (0h-6h)';
  }
  
  return {
    nextPromoType,
    isWeekend: day === 0 || day === 6
  };
}

function renderNewsletter() {
  const nextPromo = getNextPromoChange();
  const timeLeft = getTimeLeft();
  
  return `
    <section id="newsletter" class="py-16 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-800 dark:to-red-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center mb-6">
          <div class="bg-white/20 rounded-full p-3 mr-4">
            <i data-lucide="gift" class="w-8 h-8 text-white"></i>
          </div>
          <div class="text-left">
            <h2 class="text-3xl font-bold text-white mb-2">
              Receba Ofertas Exclusivas
            </h2>
            <p class="text-red-100">
              Seja o primeiro a saber sobre promoções, lançamentos e descontos especiais
            </p>
          </div>
        </div>

        <div class="bg-background rounded-lg p-8 shadow-xl border border-border">
          <form onsubmit="subscribeNewsletter(event)">
            <div class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <div class="relative flex-1">
                <i data-lucide="mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"></i>
                <input 
                  type="email" 
                  id="newsletter-email"
                  placeholder="Seu melhor e-mail"
                  class="pl-10 pr-4 py-3 text-base w-full border border-border rounded-lg bg-background"
                  required
                />
              </div>
              <button 
                type="submit"
                class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Inscrever-se
              </button>
            </div>
          </form>
          
          <div class="mt-6 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div class="flex items-center">
              <span class="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">✓</span>
              Ofertas exclusivas
            </div>
            <div class="flex items-center">
              <span class="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">✓</span>
              Sem spam
            </div>
            <div class="flex items-center">
              <span class="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">✓</span>
              Cancele quando quiser
            </div>
          </div>
        </div>

        ${timeLeft ? `
          <div class="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="flex items-center justify-center gap-3 text-white">
              <i data-lucide="clock" class="w-5 h-5 text-yellow-300"></i>
              <span class="text-sm">
                <strong>Próxima mudança:</strong> ${nextPromo.nextPromoType} em ${timeLeft}
              </span>
            </div>
          </div>
        ` : ''}

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
          <div>
            <div class="text-2xl font-bold">50K+</div>
            <div class="text-red-100">Clientes satisfeitos</div>
          </div>
          <div>
            <div class="text-2xl font-bold">100+</div>
            <div class="text-red-100">Produtos disponíveis</div>
          </div>
          <div>
            <div class="text-2xl font-bold">24/7</div>
            <div class="text-red-100">Suporte técnico</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="bg-muted border-t border-border py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <div class="bg-red-800 text-white p-2 rounded-lg mr-3">
                <i data-lucide="apple" class="w-6 h-6"></i>
              </div>
              <span class="text-xl font-bold text-foreground">Apple Juice</span>
            </div>
            <p class="text-muted-foreground mb-4">
              Sua loja especializada em tecnologia com os melhores preços e qualidade garantida.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-muted-foreground hover:text-foreground">
                <i data-lucide="facebook" class="w-5 h-5"></i>
              </a>
              <a href="#" class="text-muted-foreground hover:text-foreground">
                <i data-lucide="twitter" class="w-5 h-5"></i>
              </a>
              <a href="#" class="text-muted-foreground hover:text-foreground">
                <i data-lucide="instagram" class="w-5 h-5"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-foreground mb-4">Categorias</h4>
            <ul class="space-y-2">
              <li><a href="#" onclick="navigateTo('gaming')" class="text-muted-foreground hover:text-foreground">Gaming</a></li>
              <li><a href="#" onclick="navigateTo('home-office')" class="text-muted-foreground hover:text-foreground">Home Office</a></li>
              <li><a href="#" onclick="navigateTo('professional')" class="text-muted-foreground hover:text-foreground">Profissional</a></li>
              <li><a href="#" onclick="navigateTo('accessories')" class="text-muted-foreground hover:text-foreground">Acessórios</a></li>
              <li><a href="#" onclick="navigateTo('peripherals')" class="text-muted-foreground hover:text-foreground">Periféricos</a></li>
              <li><a href="#" onclick="navigateTo('components')" class="text-muted-foreground hover:text-foreground">Componentes</a></li>
              <li><a href="#" onclick="navigateTo('promotions')" class="text-muted-foreground hover:text-foreground text-red-600">🔥 Promoções</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-foreground mb-4">Suporte</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Central de Ajuda</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Contato</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Garantia</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Trocas e Devoluções</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-foreground mb-4">Empresa</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Sobre Nós</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Termos de Uso</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Privacidade</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground">Trabalhe Conosco</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-border mt-8 pt-8 text-center">
          <p class="text-muted-foreground">
            © 2024 Apple Juice. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  `;
}

// Category Page
function renderCategoryPage(container, category) {
  const categoryProducts = products.filter(p => p.category === category);
  
  container.innerHTML = `
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center mb-8">
          <button onclick="navigateTo('home')" class="flex items-center text-muted-foreground hover:text-foreground mr-4">
            <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
            Voltar
          </button>
          <h1 class="text-3xl font-bold text-foreground">${category}</h1>
        </div>
        
        ${categoryProducts.length === 0 ? `
          <div class="text-center py-12">
            <h3 class="text-xl font-semibold text-foreground mb-4">
              Nenhum produto encontrado nesta categoria
            </h3>
            <p class="text-muted-foreground mb-6">
              Explore outras categorias ou volte para a página inicial
            </p>
            <button onclick="navigateTo('home')" class="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition-colors">
              Voltar para Início
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${categoryProducts.map(product => renderProductCard(product)).join('')}
          </div>
        `}
      </div>
    </div>
    ${renderFooter()}
  `;
}

// Promotions Page
function renderPromotionsPage(container) {
  const promoInfo = getCurrentPromoInfo();
  const onSaleProducts = products.filter(p => p.isOnSale);
  const bestSellerProducts = products.filter(p => p.isBestSeller);
  const timeLeft = getTimeLeft();
  
  container.innerHTML = `
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center mb-8">
          <button onclick="navigateTo('home')" class="flex items-center text-muted-foreground hover:text-foreground mr-4">
            <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
            Voltar
          </button>
          <h1 class="text-3xl font-bold text-foreground">Promoções Ativas</h1>
        </div>
        
        <!-- Banner de Promoção Atual -->
        <div class="${promoInfo.color} text-white rounded-xl p-8 mb-12 shadow-lg">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="flex-1 mb-4 md:mb-0">
              <h2 class="text-3xl font-bold mb-2">${promoInfo.title}</h2>
              <p class="text-lg opacity-90">${promoInfo.description}</p>
            </div>
            <div class="flex flex-col items-center gap-3">
              <span class="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-lg">
                ${promoInfo.badge}
              </span>
              <span class="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-xl">
                ${promoInfo.discount}
              </span>
              ${timeLeft ? `
                <span class="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  ⏰ Termina em ${timeLeft}
                </span>
              ` : ''}
            </div>
          </div>
        </div>
        
        <!-- Produtos em Oferta -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-foreground mb-6">🔥 Produtos em Oferta</h2>
          ${onSaleProducts.length === 0 ? `
            <p class="text-muted-foreground text-center py-8">Nenhum produto em oferta no momento</p>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${onSaleProducts.slice(0, 9).map(product => renderProductCard(product)).join('')}
            </div>
          `}
        </div>
        
        <!-- Best Sellers -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-foreground mb-6">⭐ Mais Vendidos</h2>
          ${bestSellerProducts.length === 0 ? `
            <p class="text-muted-foreground text-center py-8">Nenhum best seller no momento</p>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${bestSellerProducts.slice(0, 9).map(product => renderProductCard(product)).join('')}
            </div>
          `}
        </div>
        
        <!-- Estatísticas de Promoções -->
        <div class="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-8 shadow-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-4xl font-bold mb-2">${onSaleProducts.length}</div>
              <div class="text-lg opacity-90">Produtos em Promoção</div>
              <div class="text-sm opacity-75 mt-1">
                ${products.length > 0 ? `${Math.round((onSaleProducts.length / products.length) * 100)}%` : '0%'} do catálogo
              </div>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">${bestSellerProducts.length}</div>
              <div class="text-lg opacity-90">Best Sellers</div>
              <div class="text-sm opacity-75 mt-1">Mais vendidos agora</div>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">${promoInfo.discount}</div>
              <div class="text-lg opacity-90">Desconto Máximo</div>
              <div class="text-sm opacity-75 mt-1">Nas melhores ofertas</div>
            </div>
          </div>
          <div class="text-center mt-6 text-sm opacity-90">
            🔄 Promoções atualizadas dinamicamente • Aproveite antes que acabe!
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// Checkout Page
function renderCheckoutPage(container) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  container.innerHTML = `
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center mb-8">
          <button onclick="navigateTo('home')" class="flex items-center text-muted-foreground hover:text-foreground mr-4">
            <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
            Voltar
          </button>
          <h1 class="text-3xl font-bold text-foreground">Finalizar Compra</h1>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div class="card mb-6">
              <h2 class="text-xl font-semibold mb-4">Dados de Entrega</h2>
              <form id="checkout-form" onsubmit="processCheckout(event)">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">Nome Completo</label>
                    <input type="text" required class="w-full p-3 border border-border rounded-lg">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">E-mail</label>
                    <input type="email" required class="w-full p-3 border border-border rounded-lg">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">CEP</label>
                    <input type="text" required class="w-full p-3 border border-border rounded-lg">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">Endereço</label>
                    <input type="text" required class="w-full p-3 border border-border rounded-lg">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">Cidade</label>
                      <input type="text" required class="w-full p-3 border border-border rounded-lg">
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">Estado</label>
                      <select required class="w-full p-3 border border-border rounded-lg">
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h2 class="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div class="space-y-4">
                ${cartItems.map(item => `
                  <div class="flex items-center justify-between py-2 border-b border-border">
                    <div>
                      <h4 class="font-medium">${item.name}</h4>
                      <p class="text-sm text-muted-foreground">Qtd: ${item.quantity}</p>
                    </div>
                    <span class="font-semibold">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                `).join('')}
                
                <div class="border-t border-border pt-4">
                  <div class="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span class="text-red-800">R$ ${total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  form="checkout-form"
                  class="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg transition-colors mt-4"
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Event Handlers


function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cartItems.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  updateCartCount();
  renderCart();
  showToast(`${product.name} adicionado ao carrinho!`, 'success');
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  const item = cartItems.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    updateCartCount();
    renderCart();
  }
}

function updateCartCount() {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function renderCart() {
  const cartItemsElement = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  
  if (!cartItemsElement || !cartTotalElement) return;
  
  if (cartItems.length === 0) {
    cartItemsElement.innerHTML = `
      <div class="text-center py-8">
        <p class="text-muted-foreground">Seu carrinho está vazio</p>
      </div>
    `;
    cartTotalElement.textContent = 'R$ 0,00';
    return;
  }
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartItemsElement.innerHTML = cartItems.map(item => `
    <div class="sidebar-item">
      <img src="${item.image}" alt="${item.name}" class="sidebar-item-image"
           onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNiAyNFY0OE0yNCAzNkg0OCIgc3Ryb2tlPSIjOUIwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'">
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start gap-2">
          <h4 class="font-semibold text-foreground truncate pr-2">${item.name}</h4>
          <button onclick="removeFromCart(${item.id})" class="sidebar-item-button hover:bg-red-100 dark:hover:bg-red-900/50">
            <i data-lucide="trash-2" class="w-4 h-4 text-red-600"></i>
          </button>
        </div>
        <p class="text-sm text-muted-foreground mt-1">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-2">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="sidebar-item-button">
              <i data-lucide="minus" class="w-4 h-4"></i>
            </button>
            <span class="w-10 text-center font-medium">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="sidebar-item-button">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
          <span class="font-bold text-lg text-primary">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  `).join('');
  
  cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    showToast('Produto removido dos favoritos', 'info');
  } else {
    favorites.push(productId);
    showToast('Produto adicionado aos favoritos', 'success');
  }
  
  // Update UI
  if (currentPage === 'home') {
    const productsSection = document.getElementById('produtos');
    if (productsSection) {
      productsSection.innerHTML = renderFeaturedProducts();
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
}


function updateUserStatus() {
  const indicator = document.getElementById('user-status-indicator');
  if (indicator) {
    if (currentUser) {
      indicator.classList.remove('hidden');
    } else {
      indicator.classList.add('hidden');
    }
  }
}

function updateUserPanel() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;

  if (currentUser) {
    // User is logged in
    content.innerHTML = `
      <div class="space-y-6">
        <!-- User Profile -->
        <div class="text-center pb-6 border-b border-border">
          <div class="w-24 h-24 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span class="text-4xl text-white font-bold">${currentUser.avatar}</span>
          </div>
          <h3 class="text-2xl font-semibold mb-1">${currentUser.name}</h3>
          <p class="text-sm text-muted-foreground">${currentUser.email}</p>
          <p class="text-xs text-muted-foreground mt-2">Membro desde ${currentUser.joined}</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-muted rounded-xl border border-border">
            <div class="text-3xl font-bold text-primary">${currentUser.orders?.length || 0}</div>
            <div class="text-xs text-muted-foreground mt-1">Pedidos</div>
          </div>
          <div class="text-center p-4 bg-muted rounded-xl border border-border">
            <div class="text-3xl font-bold text-primary">${favorites.length}</div>
            <div class="text-xs text-muted-foreground mt-1">Favoritos</div>
          </div>
          <div class="text-center p-4 bg-muted rounded-xl border border-border">
            <div class="text-3xl font-bold text-primary">${cartItems.length}</div>
            <div class="text-xs text-muted-foreground mt-1">Carrinho</div>
          </div>
        </div>

        <!-- Menu Options -->
        <div class="space-y-2 pt-4 border-t border-border">
          <button onclick="showUserOrders()" class="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div class="flex items-center gap-4">
              <i data-lucide="package" class="w-6 h-6 text-primary"></i>
              <span class="font-semibold text-lg">Meus Pedidos</span>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-muted-foreground"></i>
          </button>
          
          <button onclick="showUserFavorites()" class="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div class="flex items-center gap-4">
              <i data-lucide="heart" class="w-6 h-6 text-primary"></i>
              <span class="font-semibold text-lg">Favoritos</span>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-muted-foreground"></i>
          </button>
          
          <button onclick="showUserSettings()" class="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div class="flex items-center gap-4">
              <i data-lucide="settings" class="w-6 h-6 text-primary"></i>
              <span class="font-semibold text-lg">Configurações</span>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-muted-foreground"></i>
          </button>
        </div>

        <!-- Logout Button -->
        <div class="pt-4 border-t border-border">
          <button onclick="handleLogout()" class="w-full sidebar-footer-button flex items-center justify-center gap-2">
            <i data-lucide="log-out" class="w-5 h-5"></i>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    `;
  } else {
    // User is not logged in
    content.innerHTML = `
      <div class="space-y-6">
        <!-- Login Prompt -->
        <div class="text-center pt-8 pb-4">
          <div class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <i data-lucide="user-x" class="w-12 h-12 text-muted-foreground"></i>
          </div>
          <h3 class="text-2xl font-semibold mb-2">Acesse sua Conta</h3>
          <p class="text-sm text-muted-foreground">Faça login para ter uma experiência completa</p>
        </div>
        
        <!-- Login Form -->
        <form onsubmit="handleQuickLogin(event)" class="space-y-4 px-4">
          <div>
            <label class="block text-sm font-medium mb-2">E-mail</label>
            <input type="email" id="quick-login-email" required class="w-full p-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Senha</label>
            <input type="password" id="quick-login-password" required class="w-full p-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <button type="submit" class="w-full sidebar-footer-button">
            Entrar
          </button>
        </form>
        
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            Não tem conta? 
            <button onclick="showRegisterPanel()" class="text-primary hover:underline font-semibold">Registre-se</button>
          </p>
        </div>
      </div>
    `;
  }
  
  // Re-initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function handleQuickLogin(event) {
  event.preventDefault();
  const email = document.getElementById('quick-login-email').value;
  const password = document.getElementById('quick-login-password').value;
  
  // Simulate login
  currentUser = { 
    email, 
    name: email.split('@')[0],
    joined: new Date().toLocaleDateString('pt-BR'),
    orders: [],
    avatar: email.charAt(0).toUpperCase()
  };
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  showToast(`Bem-vindo, ${currentUser.name}!`, 'success');
  updateUserStatus();
  updateUserPanel();
}

function showUserOrders() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="space-y-4">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900 mb-4">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold mb-4">Meus Pedidos</h3>
      
      ${currentUser?.orders && currentUser.orders.length > 0 ? `
        ${currentUser.orders.map(order => `
          <div class="p-4 border border-border rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-medium">Pedido #${order.id}</p>
                <p class="text-sm text-muted-foreground">${order.date}</p>
              </div>
              <span class="badge badge-${order.status === 'delivered' ? 'bestseller' : 'sale'}">${order.status}</span>
            </div>
            <p class="text-sm mb-2">${order.items} itens</p>
            <p class="font-bold text-red-800">R$ ${order.total.toFixed(2)}</p>
          </div>
        `).join('')}
      ` : `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="package" class="w-8 h-8 text-muted-foreground"></i>
          </div>
          <p class="text-muted-foreground">Você ainda não fez nenhum pedido</p>
          <button onclick="navigateTo('home'); toggleUserPanel(false);" class="mt-4 bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition-colors">
            Começar a Comprar
          </button>
        </div>
      `}
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showUserFavorites() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  
  content.innerHTML = `
    <div class="space-y-4">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900 mb-4">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold mb-4">Meus Favoritos</h3>
      
      ${favoriteProducts.length > 0 ? `
        <div class="space-y-3">
          ${favoriteProducts.map(product => `
            <div class="flex gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer" onclick="openProductModal(${product.id}); toggleUserPanel(false);">
              <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">${product.name}</p>
                <p class="text-sm text-red-800 font-bold">R$ ${product.price.toFixed(2)}</p>
              </div>
              <button onclick="event.stopPropagation(); toggleFavorite(${product.id}); setTimeout(() => showUserFavorites(), 100);" class="p-2">
                <i data-lucide="x" class="w-4 h-4 text-muted-foreground"></i>
              </button>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="heart" class="w-8 h-8 text-muted-foreground"></i>
          </div>
          <p class="text-muted-foreground">Você ainda não tem favoritos</p>
          <button onclick="navigateTo('home'); toggleUserPanel(false);" class="mt-4 bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition-colors">
            Explorar Produtos
          </button>
        </div>
      `}
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showUserSettings() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="space-y-4">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900 mb-4">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold mb-4">Configurações</h3>
      
      <div class="space-y-3">
        <div class="p-4 border border-border rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">Tema</span>
            <button onclick="toggleTheme()" class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              ${theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
          <p class="text-sm text-muted-foreground">Alterar entre modo claro e escuro</p>
        </div>
        
        <div class="p-4 border border-border rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">Notificações</span>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="opacity-0 w-0 h-0" checked onchange="showToast('Configuração de notificações atualizada', 'info')">
              <span class="absolute cursor-pointer inset-0 bg-red-800 rounded-full transition-all"></span>
            </label>
          </div>
          <p class="text-sm text-muted-foreground">Receber notificações de promoções</p>
        </div>
        
        <div class="p-4 border border-border rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">E-mail</span>
            <span class="text-sm text-muted-foreground">${currentUser.email}</span>
          </div>
          <button onclick="showToast('Função em desenvolvimento', 'info')" class="text-sm text-red-800 hover:underline">
            Alterar e-mail
          </button>
        </div>
        
        <div class="p-4 border border-border rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">Senha</span>
            <span class="text-sm text-muted-foreground">••••••••</span>
          </div>
          <button onclick="showToast('Função em desenvolvimento', 'info')" class="text-sm text-red-800 hover:underline">
            Alterar senha
          </button>
        </div>
      </div>
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showUserAddress() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="space-y-4">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900 mb-4">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold mb-4">Meus Endereços</h3>
      
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="map-pin" class="w-8 h-8 text-muted-foreground"></i>
        </div>
        <p class="text-muted-foreground mb-4">Você ainda não cadastrou nenhum endereço</p>
        <button onclick="showToast('Função em desenvolvimento', 'info')" class="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition-colors">
          Adicionar Endereço
        </button>
      </div>
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showUserHelp() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="space-y-4">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900 mb-4">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold mb-4">Ajuda & Suporte</h3>
      
      <div class="space-y-3">
        <button onclick="showToast('Abrindo central de ajuda...', 'info')" class="w-full text-left p-4 border border-border rounded-lg hover:bg-muted transition-colors">
          <div class="flex items-center gap-3">
            <i data-lucide="book-open" class="w-5 h-5 text-red-800"></i>
            <div>
              <p class="font-medium">Central de Ajuda</p>
              <p class="text-sm text-muted-foreground">Perguntas frequentes e tutoriais</p>
            </div>
          </div>
        </button>
        
        <button onclick="showToast('Abrindo chat...', 'info')" class="w-full text-left p-4 border border-border rounded-lg hover:bg-muted transition-colors">
          <div class="flex items-center gap-3">
            <i data-lucide="message-circle" class="w-5 h-5 text-red-800"></i>
            <div>
              <p class="font-medium">Chat ao Vivo</p>
              <p class="text-sm text-muted-foreground">Fale com nosso suporte</p>
            </div>
          </div>
        </button>
        
        <button onclick="showToast('Abrindo e-mail...', 'info')" class="w-full text-left p-4 border border-border rounded-lg hover:bg-muted transition-colors">
          <div class="flex items-center gap-3">
            <i data-lucide="mail" class="w-5 h-5 text-red-800"></i>
            <div>
              <p class="font-medium">E-mail</p>
              <p class="text-sm text-muted-foreground">contato@applejuice.com.br</p>
            </div>
          </div>
        </button>
        
        <button onclick="showToast('Ligando...', 'info')" class="w-full text-left p-4 border border-border rounded-lg hover:bg-muted transition-colors">
          <div class="flex items-center gap-3">
            <i data-lucide="phone" class="w-5 h-5 text-red-800"></i>
            <div>
              <p class="font-medium">Telefone</p>
              <p class="text-sm text-muted-foreground">(11) 1234-5678</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function showRegisterPanel() {
  const content = document.getElementById('user-panel-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="space-y-6">
      <button onclick="updateUserPanel()" class="flex items-center gap-2 text-red-800 hover:text-red-900">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
        <span>Voltar</span>
      </button>
      
      <h3 class="text-xl font-semibold">Criar Conta</h3>
      
      <form onsubmit="handleRegister(event)" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nome Completo</label>
          <input type="text" id="register-name" required class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-800">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">E-mail</label>
          <input type="email" id="register-email" required class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-800">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Senha</label>
          <input type="password" id="register-password" required class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-800">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Confirmar Senha</label>
          <input type="password" id="register-password-confirm" required class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-red-800">
        </div>
        <button type="submit" class="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg transition-colors">
          Criar Conta
        </button>
      </form>
      
      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          Já tem conta? 
          <button onclick="updateUserPanel()" class="text-red-800 hover:underline font-medium">Faça login</button>
        </p>
      </div>
    </div>
  `;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;
  
  if (password !== passwordConfirm) {
    showToast('As senhas não coincidem', 'error');
    return;
  }
  
  // Simulate registration
  currentUser = { 
    email, 
    name,
    joined: new Date().toLocaleDateString('pt-BR'),
    orders: [],
    avatar: name.charAt(0).toUpperCase()
  };
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  showToast(`Bem-vindo, ${currentUser.name}!`, 'success');
  updateUserStatus();
  updateUserPanel();
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const content = document.getElementById('product-modal-content');
  
  if (!modal || !title || !content) return;
  
  title.textContent = product.name;
  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img 
          src="${product.image}" 
          alt="${product.name}"
          class="w-full h-64 object-cover rounded-lg"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgODBWMTc2TTE1MiAxMjhIMjQ4IiBzdHJva2U9IiM5QjAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4='"
        />
      </div>
      <div>
        <div class="mb-4">
          <span class="badge badge-sale">${product.category}</span>
          ${product.isOnSale ? '<span class="badge badge-sale ml-2">OFERTA</span>' : ''}
          ${product.isBestSeller ? '<span class="badge badge-bestseller ml-2">BEST SELLER</span>' : ''}
        </div>
        
        <div class="star-rating mb-4">
          ${renderStars(product.rating)}
          <span class="text-sm text-muted-foreground ml-2">(${product.reviews} avaliações)</span>
        </div>
        
        <div class="flex items-center gap-4 mb-6">
          <span class="text-3xl font-bold text-red-800">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          ${product.isOnSale ? `<span class="text-xl text-muted-foreground line-through">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
        </div>
        
        <div class="space-y-4">
          <button 
            onclick="addToCart(${product.id}); closeProductModal();" 
            class="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg transition-colors"
          >
            Adicionar ao Carrinho
          </button>
          
          <button 
            onclick="toggleFavorite(${product.id})" 
            class="w-full border border-border bg-background text-foreground py-3 rounded-lg transition-colors hover:bg-muted"
          >
            ${favorites.includes(product.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </button>
        </div>
        
        <div class="mt-6 text-sm text-muted-foreground">
          <p><strong>Categoria:</strong> ${product.category}</p>
          <p><strong>Avaliação:</strong> ${product.rating}/5 (${product.reviews} avaliações)</p>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function subscribeNewsletter(event) {
  event.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  
  if (email) {
    showToast('Inscrição realizada com sucesso!', 'success');
    document.getElementById('newsletter-email').value = '';
  }
}

function processCheckout(event) {
  event.preventDefault();
  
  // Simulate checkout process
  setTimeout(() => {
    showToast('Pedido realizado com sucesso!', 'success');
    cartItems = [];
    updateCartCount();
    navigateTo('home');
  }, 1000);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 p-1">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Use a short timeout to allow the element to be added to the DOM before adding the 'show' class
  setTimeout(() => {
    toast.classList.add('show');
  }, 500);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, 5000);
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Scroll functions
function scrollToProducts() {
  const productsSection = document.getElementById('produtos');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToNewsletter() {
  const newsletterSection = document.getElementById('newsletter');
  if (newsletterSection) {
    newsletterSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToCategories() {
  const categoriesSection = document.getElementById('categorias');
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ============================================ */
/* FUNÇÕES DE UI - PAINÉIS E MODAIS */
/* ============================================ */

/**
 * Anexa os event listeners aos elementos de UI interativos
 */
function initializeEventListeners() {
  // Botão para abrir o painel do usuário
  const userPanelButton = document.getElementById('user-panel-button');
  if (userPanelButton) {
    userPanelButton.addEventListener('click', () => toggleUserPanel());
  }

  // Botão para fechar o painel do usuário
  const userPanelCloseButton = document.getElementById('user-panel-close-button');
  if (userPanelCloseButton) {
    userPanelCloseButton.addEventListener('click', () => toggleUserPanel());
  }

  // Botão para abrir o carrinho
  const cartButton = document.getElementById('cart-button');
  if (cartButton) {
    cartButton.addEventListener('click', () => toggleCart());
  }

  // Botão para fechar o carrinho
  const cartCloseButton = document.getElementById('cart-close-button');
  if (cartCloseButton) {
    cartCloseButton.addEventListener('click', () => toggleCart());
  }

  // Overlay do carrinho (clicar fora fecha o painel)
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => toggleCart(false));
  }

  // Overlay do painel de usuário (clicar fora fecha o painel)
  const userPanelOverlay = document.getElementById('user-panel-overlay');
  if (userPanelOverlay) {
    userPanelOverlay.addEventListener('click', () => toggleUserPanel(false));
  }
}

// O objeto SIDEBARS será preenchido na função init(), após o DOM ser carregado.
let SIDEBARS = {};

/**
 * Centraliza a lógica de bloqueio de rolagem da página.
 * Bloqueia o scroll se qualquer painel estiver aberto, e libera se todos estiverem fechados.
 */
function updateBodyScroll() {
  const isAnySidebarOpen = Object.values(SIDEBARS).some(
    ({ sidebar }) => sidebar && !sidebar.classList.contains('translate-x-full')
  );
  document.body.style.overflow = isAnySidebarOpen ? 'hidden' : '';
}

/**
 * Função genérica para abrir e fechar qualquer painel lateral.
 * Garante que apenas um painel possa estar aberto por vez.
 *
 * @param {string} panelId - O ID do painel a ser manipulado (e.g., 'cart-sidebar').
 * @param {boolean} [forceState] - Força um estado específico (true para abrir, false para fechar).
 */
function toggleSidebar(panelId, forceState) {
  const target = SIDEBARS[panelId];
  if (!target || !target.sidebar || !target.overlay) {
    console.error(`[toggleSidebar] Painel com ID "${panelId}" não encontrado.`);
    return;
  }

  const isOpen = !target.sidebar.classList.contains('translate-x-full');
  const shouldOpen = forceState === undefined ? !isOpen : forceState;

  // Se a intenção é abrir um painel, primeiro fecha todos os outros.
  if (shouldOpen) {
    for (const id in SIDEBARS) {
      if (id !== panelId) {
        const otherPanel = SIDEBARS[id];
        otherPanel.sidebar.classList.add('translate-x-full');
        otherPanel.overlay.classList.add('hidden');
      }
    }
  }

  // Abre ou fecha o painel alvo.
  if (shouldOpen) {
    target.sidebar.classList.remove('translate-x-full');
    target.overlay.classList.remove('hidden');
    // Caso especial: atualiza o conteúdo do painel de usuário ao abrir.
    if (panelId === 'user-panel') {
      updateUserPanel();
    }
  } else {
    target.sidebar.classList.add('translate-x-full');
    target.overlay.classList.add('hidden');
  }

  // Atualiza o estado de rolagem da página no final de qualquer operação.
  updateBodyScroll();
}

/**
 * Wrapper para manter compatibilidade com chamadas existentes a toggleCart.
 * @param {boolean} [forceState] - Opcional. Força o estado do painel.
 */
function toggleCart(forceState) {
  toggleSidebar('cart-sidebar', forceState);
}

/**
 * Wrapper para manter compatibilidade com chamadas existentes a toggleUserPanel.
 * @param {boolean} [forceState] - Opcional. Força o estado do painel.
 */
function toggleUserPanel(forceState) {
  toggleSidebar('user-panel', forceState);
}

/**
 * Alterna o menu mobile
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

/**
 * Alterna entre modo claro e escuro
 */
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  if (newTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  theme = newTheme;
  localStorage.setItem('theme', newTheme);
  
  // Atualiza ícone do tema
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  showToast(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`, 'info');
}

/**
 * Função de busca de produtos
 * @param {string} term - Termo de busca
 */
function handleSearch(term) {
  searchTerm = term.toLowerCase();
  
  // Se estamos na home, filtra os produtos
  if (currentPage === 'home') {
    renderProducts(getFilteredProducts());
  }
  
  // Se o termo não está vazio e não estamos na home, vai para home com busca
  if (term && currentPage !== 'home') {
    navigateTo('home');
  }
}

/**
 * Alterna modal de login (legacy, não usado atualmente)
 */
function toggleLogin() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.toggle('hidden');
  }
}

/**
 * Fecha o menu mobile
 */
function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.add('hidden');
  }
}

/**
 * Processa o login do usuário
 */
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  
  if (!email || !password) {
    showToast('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  // Simulate login
  currentUser = { 
    email, 
    name: email.split('@')[0],
    joined: new Date().toLocaleDateString('pt-BR'),
    orders: [],
    avatar: email.charAt(0).toUpperCase()
  };
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  showToast(`Bem-vindo, ${currentUser.name}!`, 'success');
  updateUserStatus();
  updateUserPanel();
}

/**
 * Faz logout do usuário
 */
function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showToast('Logout realizado com sucesso!', 'success');
  updateUserStatus();
  toggleUserPanel(false);
}

/**
 * Processa o checkout
 */
function handleCheckout() {
  if (cartItems.length === 0) {
    showToast('Seu carrinho está vazio!', 'error');
    return;
  }
  
  navigateTo('checkout');
  toggleCart(false);
}

/* ============================================ */
/* INICIALIZAÇÃO DO APLICATIVO */
/* ============================================ */
/*
 * Quando a página termina de carregar (DOM pronto),
 * a função init() é executada automaticamente.
 * 
 * A função init() faz toda a configuração inicial:
 * - Carrega tema salvo
 * - Carrega dados do usuário
 * - Aplica promoções dinâmicas
 * - Renderiza a página inicial
 * - Inicializa os ícones
 * - Remove a tela de loading
 */

console.log('📦 Script Apple Juice carregado! Aguardando DOM...');

// Aguarda o HTML carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM carregado! Iniciando aplicação...');
  init();
  console.log('✅ Aplicação inicializada com sucesso!');
});

console.log('🔄 Event listener DOMContentLoaded registrado!');
