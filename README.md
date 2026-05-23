# LetMeFind - Enterprise Product Discovery Platform

[Watch LetMeFind Demo Video (MP4)](media/letmefind_demo_youtube.mp4)


## Overview

LetMeFind is a sophisticated product discovery platform that guides users through a structured 4-stage journey from initial search to final comparison decision. Each stage progressively reveals data and insights, optimizing for decision-making clarity.

### Smart Prompt Understanding

The built-in AI engine is highly capable of understanding even the shortest or vaguest user prompts. It automatically analyzes, contextualizes, and expands these brief inputs to deliver highly accurate product recommendations and insights without requiring complex search queries.

![Smart Prompt Understanding Preview](media/letmefind_ab_preview.gif)

## 🎯 Features

✨ **Stage-Based Architecture**
- **Discovery Stage (discovery.html):** User search input with smart suggestion chips
- **Thinking Stage (thinking.html):** AI-powered query analysis and pattern extraction
- **Results Stage (results.html):** Live product grid with AI-matching analysis and filters
- **Comparison Stage (comparison.html):** Side-by-side product comparison with Gemini-powered insights

🔄 **Real-Time Data Integration**
- **Products:** DummyJSON API with furniture category prioritization
- **Exchange Rates:** Exchangerate.host (real-time USD/EUR → TRY) + TCMB fallback
- **AI Chat:** Google Gemini API via secure backend proxy

📱 **Responsive Design**
- Tailwind CSS responsive breakpoints (320px mobile → 1280px wide)
- Mobile-first architecture with adaptive layouts
- Touch-friendly buttons and interactive elements
- Tested across iOS, Android, tablet, and desktop

## 📁 Project Structure

```
/home/ali/Projeler/LetMeFind/
├── index.html                      # Root redirect → discovery.html
├── discovery.html                  # Stage 1: Search interface
├── thinking.html                   # Stage 2: Analysis loading state
├── results.html                    # Stage 3: Product results grid
├── comparison.html                 # Stage 4: Comparison & Gemini
├── stage.js                        # Shared UI controller
├── .env                            # Environment (GEMINI_API_KEY)
├── package.json                    # npm scripts & metadata
├── README.md                       # This file
├── DESIGN.md                       # UI/UX design tokens
├── ARCHITECTURE.md                 # Technical deep dive
└── backend/
    └── src/
        ├── server.js               # HTTP server & routing
        └── lib/
            ├── services.js         # Data transformation
            ├── product-sources.js  # DummyJSON wrapper
            ├── tcmb.js            # Exchange rate fetcher
            └── gemini.js          # Gemini proxy
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation & Setup

```bash
git clone https://github.com/myz21/LetMeFind

cd LetMeFind

Get api key from gemini and rapidapi (both are free).
Make sure that you have subscribed to Real-Time Amazon Data api from rapidapi (its free).


# Create .env (if not exists)
echo "GEMINI_API_KEY=your_key_here" > .env
echo "RAPIDAPI_KEY=your_key_here" > .env

# Start backend
npm run dev

# Visit http://localhost3000:3000
```

### Configuration (.env)

```env
GEMINI_API_KEY=AIzaSy...    # Your Google Gemini API key
RAPIDAPI_KEY=aAIzaSy...     # Your Rapid Api Key
PORT=3000                   # Backend port (default)
NODE_ENV=development        # or 'production'
```

## 🔄 Stage Flow

```
Stage 1: DISCOVERY (discovery.html)
    User types search query
    ↓ Clicks search button
Stage 2: THINKING (thinking.html)
    AI analyzes query (< 1s)
Stage 3: RESULTS (results.html)
    Shows 3 best-matched products
    User selects filters
    ↓ Clicks "KARŞILAŞTIRMAYA GEÇ"
Stage 4: COMPARISON (comparison.html)
    Side-by-side product comparison
    Gemini chat overlay for insights
```

### State Persistence

Each stage saves data to `sessionStorage` as `letmefind_context`:
- Survives browser navigation within session
- Lost on page refresh (by design)
- Contains: query, items[], exchange rates, analysis, comparison data

## 📡 API Reference

### GET /api/search?q=furniture

**Response Example:**
```json
{
  "query": "furniture",
  "items": [
    {
      "id": 1,
      "name": "Furniture Co. Bedside Table African Cherry",
      "price": "$299.99",
      "usdPrice": 299.99,
      "rating": 2.9,
      "ratingLabel": "Puan 2.9",
      "category": "furniture",
      "description": "Stylish bedside table...",
      "image": "https://...",
      "source": "DummyJSON",
      "url": "https://dummyjson.com/products/1"
    }
  ],
  "exchange": {
    "usdTry": 45.45,
    "eurTry": 52.88,
    "source": "exchangerate.host"
  },
  "analysis": {
    "chips": ["category: ürün", "width: esnek", "color: nötr"],
    "tokens": ["furniture", "table", "modern"],
    "summary": "Query indicates product search..."
  },
  "comparison": [...],
  "summary": "AI-generated insights..."
}
```

### POST /api/chat

**Request:**
```json
{
  "message": "Should I buy this table?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "response": "Based on your search for furniture...",
  "role": "assistant"
}
```

### GET /api/health

**Response:**
```json
{
  "status": "ok",
  "service": "letmefind-backend",
  "geminiEnabled": true,
  "uptime": 1234.56
}
```

## 🎨 Responsive Design

| Breakpoint | Device | Tested |
|-----------|--------|--------|
| 320px | Mobile (iPhone SE) | ✅ |
| 768px | Tablet (iPad) | ✅ |
| 1024px | Laptop | ✅ |
| 1280px | Desktop | ✅ |

All pages render correctly at each breakpoint with no dummy data showing.

## 🔧 Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6+, ~650 lines in stage.js)
- **Tailwind CSS** CDN (responsive utilities)
- **Material Symbols** (icon font)
- **SessionStorage** (state persistence)

### Backend
- **Node.js** 20.19.2
- **Express-like** routing (custom implementation)
- **Fetch API** for data sources

### Data Sources
- **Products:** https://dummyjson.com/products/category/furniture
- **Exchange Rates:** 
  - Primary: https://api.exchangerate.host/latest
  - Fallback: TCMB XML daily rates
- **AI:** Google Gemini 1.5 Flash (backend-proxied)

## 🐛 Known Issues

- Tailwind CDN warning in production (use CLI for deployment)
- DummyJSON has rate limits (~100 req/min)
- Gemini requires API key (fallback message without it)
- Exchange rates updated daily (not real-time intraday)

## ✅ Checklist: Completed Tasks

- [x] 4-stage progressive disclosure UI
- [x] Real furniture product data from DummyJSON
- [x] Live exchange rates (exchangerate.host + TCMB)
- [x] Responsive design (mobile → desktop)
- [x] Semantic file naming (code*.html → discovery/thinking/results/comparison)
- [x] Gemini API integration with backend proxy
- [x] No dummy data showing on pages
- [x] Branding consistency (LetMeFind spelling)
- [x] SessionStorage state persistence
- [x] Architecture documentation

## 📚 Additional Documentation

- [DESIGN.md](DESIGN.md) - Color palette, typography, component patterns
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical deep dive, data flow diagrams
- [/1, /2, /3, /4 folders](.) - Original design mockups (reference only)

## 🎓 Development Notes

### Key Functions in stage.js

```javascript
renderStage1()              // Search input + chips
renderStage2(payload)       // Analysis display + auto-advance
renderStage3(payload)       // Product grid + filters
renderStage4(payload)       // Comparison table + Gemini
fetchPayload(query)         // GET /api/search
openGeminiPanel()           // Fixed chat overlay
saveContext(data)           // Save to sessionStorage
loadContext()               // Load from sessionStorage
```

### Debugging

```bash
# Backend logs
tail -f /tmp/backend.log

# Browser console (F12)
# → Network tab: API timings
# → Console tab: JS errors
# → Application tab: sessionStorage contents

# Health check
curl http://localhost:3000/api/health

# Test search
curl "http://localhost:3000/api/search?q=furniture" | jq .
```

## 🚢 Deployment Notes

Before production:
1. Install Tailwind CSS CLI (replace CDN)
2. Add rate limiting middleware
3. Set up API key rotation for Gemini
4. Configure CORS for external domains
5. Add error tracking (Sentry, LogRocket)
6. Enable gzip compression on backend

## 📝 License

Proprietary - LetMeFind Project

---

**Version:** 1.0.0 (4-Stage Production Ready)  
**Last Updated:** May 19, 2026
