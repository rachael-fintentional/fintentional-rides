# Fintentional Rides v2.0

The true cost of that car you're eyeing. Built with the **Fintentional Framework**.

Analyzes loan payments, dealer add-ons, smarter alternatives, true cost of ownership, and lifetime financial impact — powered by AI with real-time web search.

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Fintentional Rides v2.0"
git remote add origin https://github.com/YOUR_USERNAME/fintentional-rides.git
git push -u origin main
```

### 2. Import in Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import the GitHub repo
- Vercel auto-detects Vite — no config changes needed

### 3. Add your API key
In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

> **Note:** The web search tool (`web_search_20250305`) is used for real-time pricing lookups. Make sure your Anthropic plan supports tool use.

### 4. Deploy
Vercel deploys automatically on push. That's it.

## Local Development

```bash
npm install
npm run dev
```

For the API function locally, you can use the [Vercel CLI](https://vercel.com/docs/cli):
```bash
npm i -g vercel
vercel env pull        # pulls env vars from your Vercel project
vercel dev             # runs both Vite + serverless functions locally
```

## Project Structure

```
├── api/
│   └── analyze.js        # Vercel serverless function (proxies to Anthropic API)
├── src/
│   ├── App.jsx            # Main React application (Fintentional Rides v2.0)
│   └── main.jsx           # React entry point
├── index.html             # HTML shell
├── package.json
├── vercel.json            # Vercel config (60s function timeout for web search)
└── vite.config.js
```

## How It Works

1. User enters car details + household income
2. Frontend sends the analysis prompt to `/api/analyze`
3. Serverless function forwards to Anthropic API with your secret key
4. Claude searches the web for real pricing, then returns structured JSON
5. All financial math (loan payments, affordability, lifetime compounding) is computed **client-side** for reliability

## The Fintentional Framework

> "Your budget app tracks every latte. It has zero opinion on whether your next car is a $50,000 mistake."

This tool doesn't tell you what to buy. It shows you the full picture so you can make a conscious choice — not a default one.
