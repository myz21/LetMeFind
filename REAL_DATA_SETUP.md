# Real Product Data Setup Guide

This guide explains how to configure LetMeFind with real product data sources instead of DummyJSON.

## Available Data Sources

### 1. Amazon (via RapidAPI) - **Recommended**
- **Coverage**: Millions of products across all categories
- **Data Quality**: High (official product data)
- **Cost**: ~$0.01 per request
- **Setup Time**: 5 minutes

### 2. eBay (via RapidAPI)
- **Coverage**: Auction + Buy-It-Now items
- **Data Quality**: Good (varies by seller)
- **Cost**: ~$0.005 per request
- **Setup Time**: 5 minutes

### 3. Multiple Sources (Recommended for Production)
- **Strategy**: Try Amazon first, fallback to eBay, then DummyJSON
- **Benefits**: Higher success rate, diverse pricing
- **Cost**: Variable based on usage

## Quick Setup (5 minutes)

### Step 1: Get RapidAPI Key
1. Go to [RapidAPI.com](https://rapidapi.com)
2. Sign up for free account
3. Subscribe to these APIs:
   - **Real-Time Amazon Data** (500 free requests/month)
   - **eBay Product Search** (1000 free requests/month)
4. Copy your RapidAPI key from dashboard

### Step 2: Configure Environment
```bash
# Update your .env file
echo "RAPIDAPI_KEY=your_actual_rapidapi_key_here" >> .env
```

### Step 3: Test the Setup
```bash
# Start the backend
npm run dev

# Test with real data
curl "http://localhost:3000/api/search?q=laptop" | jq .
```

You should see products from Amazon/eBay instead of DummyJSON!

## Advanced Configuration

### Custom Source Priority
Edit `backend/src/config/data-sources.js`:

```javascript
const DATA_SOURCE_CONFIG = {
  // Try Amazon first, then eBay, then DummyJSON fallback
  priority: ['amazon', 'ebay', 'dummy'],
  
  // Get at least 3 results before trying next source
  minResults: 3,
  
  // Return max 10 products total
  maxResults: 10,
};
```

### Category Mapping
Different sources use different category names:

```javascript
categories: {
  furniture: {
    amazon: 'Home & Kitchen',
    ebay: 'Home & Garden',
    dummy: 'furniture'
  }
}
```

### Rate Limiting
Each source has different limits:
- **Amazon**: 100 requests/minute
- **eBay**: 200 requests/minute  
- **DummyJSON**: 100 requests/minute

## API Costs (Monthly Estimates)

| Usage Level | Amazon Cost | eBay Cost | Total |
|-------------|-------------|-----------|-------|
| Development (1K requests) | Free | Free | $0 |
| Small Business (10K) | $100 | $50 | $150 |
| Medium Business (100K) | $1,000 | $500 | $1,500 |

## Alternative Data Sources

### Free Options
1. **Open Product Data** - Limited categories
2. **Barcode Lookup API** - Good for specific products
3. **Web Scraping** - Legal considerations required

### Premium Options
1. **Amazon Product Advertising API** - Official, requires approval
2. **Google Shopping API** - Comprehensive, higher cost
3. **Shopify API** - For Shopify stores

## Troubleshooting

### "No products found" Error
```bash
# Check API key configuration
curl -H "X-RapidAPI-Key: YOUR_KEY" \
  "https://real-time-amazon-data.p.rapidapi.com/search" \
  -d '{"query":"laptop"}'
```

### Rate Limit Exceeded
- Upgrade RapidAPI plan
- Implement caching (Redis recommended)
- Add request queuing

### Poor Search Results
- Adjust query preprocessing in `product-sources.js`
- Add synonym mapping
- Implement fuzzy matching

## Production Recommendations

### 1. Caching Strategy
```javascript
// Add Redis caching for 1 hour
const cacheKey = `products:${query}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... fetch from APIs ...

await redis.setex(cacheKey, 3600, JSON.stringify(results));
```

### 2. Error Handling
```javascript
// Graceful degradation
try {
  return await fetchAmazonProducts(query);
} catch (error) {
  console.warn('Amazon failed, trying eBay...');
  return await fetchEbayProducts(query);
}
```

### 3. Monitoring
- Track API response times
- Monitor error rates by source
- Set up alerts for API failures

## Security Notes

- **Never commit API keys** to version control
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor usage for unusual patterns

## Next Steps

1. **Set up your RapidAPI key** (5 minutes)
2. **Test with real queries** (2 minutes)
3. **Configure source priorities** (optional)
4. **Add caching for production** (recommended)
5. **Monitor usage and costs** (ongoing)

---

**Need help?** Check the logs in `backend/src/lib/product-sources.js` for detailed error messages.

**Want more sources?** Edit the configuration files to add new APIs following the same pattern.