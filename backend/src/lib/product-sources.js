async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 10000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LetMeFind/1.0',
        Accept: 'application/json,text/plain,*/*',
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

async function fetchDummyJsonProducts(query) {
  const endpoint = `https://dummyjson.com/products/search?q=${encodeURIComponent(query || 'desk')}`;
  const payload = await fetchJson(endpoint);
  return (payload.products || []).map(normalizeDummyProduct);
}

async function fetchFeaturedProducts() {
  const payload = await fetchJson('https://dummyjson.com/products?limit=3');
  return (payload.products || []).map(normalizeDummyProduct);
}

async function fetchProductMatches(query) {
  const searchResults = await fetchDummyJsonProducts(query);
  const featured = searchResults.length >= 3 ? [] : await fetchFeaturedProducts();
  const merged = [...searchResults, ...featured].filter((product, index, array) => {
    return array.findIndex((candidate) => candidate.id === product.id) === index;
  });

  const fallback = merged.length
    ? merged
    : [
        {
          id: 0,
          name: 'Demo Product',
          price: '$0',
          usdPrice: 0,
          rating: 0,
          ratingLabel: 'Puan 0.0',
          category: 'Demo',
          description: 'Kaynak boş olduğunda gösterilen örnek ürün.',
          source: 'DummyJSON',
          image: '',
          url: 'https://dummyjson.com',
        },
      ];

  return Object.assign(fallback, { sources: ['DummyJSON', 'TCMB Daily Exchange Rates'] });
}

module.exports = {
  fetchProductMatches,
};
