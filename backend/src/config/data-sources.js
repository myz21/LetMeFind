// Data source configuration and management
const DATA_SOURCE_CONFIG = {
  // Priority order for data sources (first available will be used)
  priority: ['amazon', 'ebay', 'dummy'],
  
  // Minimum results before trying next source
  minResults: 3,
  
  // Maximum results to return
  maxResults: 10,
  
  // Timeout for each API call (ms)
  timeout: 15000,
  
  // Retry configuration
  retry: {
    attempts: 2,
    delay: 1000,
  },
  
  // Source-specific settings
  sources: {
    amazon: {
      name: 'Amazon',
      enabled: Boolean(process.env.RAPIDAPI_KEY),
      rateLimit: 100, // requests per minute
      categories: {
        furniture: 'Home & Kitchen',
        electronics: 'Electronics',
        clothing: 'Clothing, Shoes & Jewelry',
        books: 'Books',
        sports: 'Sports & Outdoors'
      }
    },
    ebay: {
      name: 'eBay',
      enabled: Boolean(process.env.RAPIDAPI_KEY),
      rateLimit: 200,
      categories: {
        furniture: 'Home & Garden',
        electronics: 'Consumer Electronics',
        clothing: 'Clothing, Shoes & Accessories',
        collectibles: 'Collectibles',
        automotive: 'eBay Motors'
      }
    },
    dummy: {
      name: 'DummyJSON',
      enabled: true,
      rateLimit: 100,
      categories: {
        furniture: 'furniture',
        electronics: 'smartphones',
        beauty: 'beauty',
        groceries: 'groceries'
      }
    }
  }
};

function getEnabledSources() {
  return DATA_SOURCE_CONFIG.priority.filter(sourceKey => 
    DATA_SOURCE_CONFIG.sources[sourceKey].enabled
  );
}

function getSourceConfig(sourceKey) {
  return DATA_SOURCE_CONFIG.sources[sourceKey];
}

function detectCategory(query) {
  const queryLower = query.toLowerCase();
  
  // Furniture keywords
  if (/sofa|table|chair|desk|cabinet|shelf|bed|wardrobe|furniture|mobilya|masa|koltuk|karyola/i.test(query)) {
    return 'furniture';
  }
  
  // Electronics keywords
  if (/laptop|computer|phone|tablet|headphone|speaker|tv|camera|gaming/i.test(query)) {
    return 'electronics';
  }
  
  // Clothing keywords
  if (/shirt|pants|dress|shoes|jacket|clothing|fashion|wear/i.test(query)) {
    return 'clothing';
  }
  
  // Books keywords
  if (/book|novel|textbook|magazine|reading/i.test(query)) {
    return 'books';
  }
  
  // Sports keywords
  if (/sport|fitness|exercise|gym|outdoor|bike|ball/i.test(query)) {
    return 'sports';
  }
  
  return 'general';
}

module.exports = {
  DATA_SOURCE_CONFIG,
  getEnabledSources,
  getSourceConfig,
  detectCategory,
};