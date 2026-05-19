// Real product data sources configuration
const PRODUCT_SOURCES = {
  // RapidAPI Amazon Real-Time Product Search
  amazon: {
    enabled: Boolean(process.env.RAPIDAPI_KEY),
    baseUrl: 'https://real-time-amazon-data.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  },
  // eBay API via RapidAPI  
  ebay: {
    enabled: Boolean(process.env.RAPIDAPI_KEY),
    baseUrl: 'https://ebay-product-search.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'ebay-product-search.p.rapidapi.com'
    }
  },
  // Fallback to DummyJSON for development
  dummy: {
    enabled: true,
    baseUrl: 'https://dummyjson.com/products'
  }
};

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LetMeFind/1.0',
        Accept: 'application/json,text/plain,*/*',
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeAmazonProduct(product) {
  return {
    id: product.asin || product.product_id || `amz_${Date.now()}`,
    name: product.product_title || product.title || 'Amazon Product',
    price: product.product_price || product.price || '$0',
    usdPrice: parseFloat(String(product.product_price || product.price || '0').replace(/[^0-9.]/g, '')) || null,
    rating: product.product_star_rating || product.rating || 0,
    ratingLabel: `Puan ${Number(product.product_star_rating || product.rating || 0).toFixed(1)}`,
    category: product.product_category || 'General',
    description: product.product_description || product.about_product || 'No description available',
    source: 'Amazon',
    image: product.product_photo || product.image || '',
    url: product.product_url || `https://amazon.com/dp/${product.asin}`,
  };
}

function normalizeEbayProduct(product) {
  return {
    id: product.itemId || product.id || `ebay_${Date.now()}`,
    name: product.title || 'eBay Product',
    price: product.price?.value ? `$${product.price.value}` : product.price || '$0',
    usdPrice: parseFloat(product.price?.value || product.price || 0),
    rating: product.feedbackScore ? Math.min(product.feedbackScore / 20, 5) : 0, // Convert to 5-star scale
    ratingLabel: `Puan ${(product.feedbackScore ? Math.min(product.feedbackScore / 20, 5) : 0).toFixed(1)}`,
    category: product.primaryCategory?.categoryName || 'General',
    description: product.shortDescription || product.subtitle || 'No description available',
    source: 'eBay',
    image: product.image?.imageUrl || product.galleryURL || '',
    url: product.viewItemURL || product.itemWebUrl || 'https://ebay.com',
  };
}

function normalizeDummyProduct(product) {
  return {
    id: product.id,
    name: `${product.brand ? `${product.brand} ` : ''}${product.title}`.trim(),
    price: `$${product.price}`,
    usdPrice: Number(product.price) || null,
    rating: product.rating,
    ratingLabel: `Puan ${Number(product.rating || 0).toFixed(1)}`,
    category: product.category,
    description: product.description,
    source: 'DummyJSON',
    image: product.thumbnail,
    url: `https://dummyjson.com/products/${product.id}`,
  };
}

async function fetchAmazonProducts(query) {
  if (!PRODUCT_SOURCES.amazon.enabled) {
    throw new Error('Amazon API not configured');
  }

  try {
    const searchUrl = `${PRODUCT_SOURCES.amazon.baseUrl}/search`;
    const payload = await fetchJson(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...PRODUCT_SOURCES.amazon.headers,
      },
      body: JSON.stringify({
        query: query,
        page: '1',
        country: 'US',
        sort_by: 'RELEVANCE',
        product_condition: 'ALL'
      }),
    });

    return (payload.data?.products || []).slice(0, 10).map(normalizeAmazonProduct);
  } catch (error) {
    console.warn('Amazon API failed:', error.message);
    return [];
  }
}

async function fetchEbayProducts(query) {
  if (!PRODUCT_SOURCES.ebay.enabled) {
    throw new Error('eBay API not configured');
  }

  try {
    const searchUrl = `${PRODUCT_SOURCES.ebay.baseUrl}/search?q=${encodeURIComponent(query)}&limit=10`;
    const payload = await fetchJson(searchUrl, {
      headers: PRODUCT_SOURCES.ebay.headers,
    });

    return (payload.items || []).map(normalizeEbayProduct);
  } catch (error) {
    console.warn('eBay API failed:', error.message);
    return [];
  }
}

async function fetchDummyJsonProducts(query) {
  // Detect category from query
  const isFurnitureQuery = /sofa|table|chair|desk|cabinet|shelf|bed|wardrobe|furniture|mobilya|masa|koltuk|karyola/i.test(query);
  const isLaptopQuery = /laptop|computer|notebook|bilgisayar/i.test(query);
  const isPhoneQuery = /phone|mobile|telefon|iphone|samsung/i.test(query);
  const isBeautyQuery = /beauty|makeup|cosmetic|güzellik|makyaj/i.test(query);
  
  let categoryProducts = [];
  
  if (isFurnitureQuery) {
    // Get furniture category
    const categoryPayload = await fetchJson('https://dummyjson.com/products/category/furniture?limit=10');
    categoryProducts = (categoryPayload.products || []).map(normalizeDummyProduct);
  } else if (isLaptopQuery) {
    // Get laptops category
    const categoryPayload = await fetchJson('https://dummyjson.com/products/category/laptops?limit=10');
    categoryProducts = (categoryPayload.products || []).map(normalizeDummyProduct);
  } else if (isPhoneQuery) {
    // Get smartphones category
    const categoryPayload = await fetchJson('https://dummyjson.com/products/category/smartphones?limit=10');
    categoryProducts = (categoryPayload.products || []).map(normalizeDummyProduct);
  } else if (isBeautyQuery) {
    // Get beauty category
    const categoryPayload = await fetchJson('https://dummyjson.com/products/category/beauty?limit=10');
    categoryProducts = (categoryPayload.products || []).map(normalizeDummyProduct);
  } else {
    // Default search for other categories
    const endpoint = `https://dummyjson.com/products/search?q=${encodeURIComponent(query || 'product')}`;
    const payload = await fetchJson(endpoint);
    categoryProducts = (payload.products || []).map(normalizeDummyProduct);
  }
  
  // If we have category products, try to filter by specific query terms
  if (categoryProducts.length > 0) {
    const queryLower = query.toLowerCase();
    const matched = categoryProducts.filter(p => 
      p.name.toLowerCase().includes(queryLower) || 
      p.description.toLowerCase().includes(queryLower) ||
      // Add some fuzzy matching for Turkish queries
      (queryLower.includes('günlük') && p.description.toLowerCase().includes('daily')) ||
      (queryLower.includes('oyun') && p.description.toLowerCase().includes('gaming'))
    );
    
    // Return matched results if found, otherwise return all category products
    return matched.length > 0 ? matched : categoryProducts;
  }
  
  return categoryProducts;
}

async function fetchProductMatches(query) {
  const results = [];
  const sources = [];

  console.log(`Searching for: "${query}"`);

  // Try real APIs first if configured
  if (PRODUCT_SOURCES.amazon.enabled) {
    try {
      console.log('Trying Amazon API...');
      const amazonProducts = await fetchAmazonProducts(query);
      results.push(...amazonProducts);
      if (amazonProducts.length > 0) sources.push('Amazon');
      console.log(`Amazon returned ${amazonProducts.length} products`);
    } catch (error) {
      console.warn('Amazon search failed:', error.message);
    }
  } else {
    console.log('Amazon API disabled (no RAPIDAPI_KEY)');
  }

  if (PRODUCT_SOURCES.ebay.enabled && results.length < 5) {
    try {
      console.log('Trying eBay API...');
      const ebayProducts = await fetchEbayProducts(query);
      results.push(...ebayProducts);
      if (ebayProducts.length > 0) sources.push('eBay');
      console.log(`eBay returned ${ebayProducts.length} products`);
    } catch (error) {
      console.warn('eBay search failed:', error.message);
    }
  } else {
    console.log('eBay API disabled or skipped');
  }

  // Fallback to DummyJSON if no real results or for development
  if (results.length < 3) {
    try {
      console.log('Trying DummyJSON fallback...');
      const dummyProducts = await fetchDummyJsonProducts(query);
      console.log(`DummyJSON returned ${dummyProducts.length} products`);
      results.push(...dummyProducts);
      if (dummyProducts.length > 0) sources.push('DummyJSON');
    } catch (error) {
      console.error('DummyJSON search failed:', error.message);
      console.error('Error details:', error);
    }
  }

  console.log(`Total results before deduplication: ${results.length}`);

  // Remove duplicates by ID
  const uniqueResults = results.filter((product, index, array) => {
    return array.findIndex((candidate) => candidate.id === product.id) === index;
  });

  console.log(`Results after deduplication: ${uniqueResults.length}`);

  // Ensure we have at least some results
  const finalResults = uniqueResults.length > 0 ? uniqueResults : [
    {
      id: 'fallback_1',
      name: 'Hiçbir veri kaynağından sonuç alınamadı',
      price: '$0',
      usdPrice: 0,
      rating: 0,
      ratingLabel: 'Puan 0.0',
      category: 'Error',
      description: 'API anahtarlarını kontrol edin.',
      source: 'Fallback',
      image: '',
      url: '#',
    },
  ];

  console.log(`Final results: ${finalResults.length}, Sources: ${sources.join(', ')}`);

  // Add sources metadata
  return Object.assign(finalResults.slice(0, 10), { 
    sources: sources.length > 0 ? sources : ['Fallback'] 
  });
}

module.exports = {
  fetchProductMatches,
  PRODUCT_SOURCES,
};