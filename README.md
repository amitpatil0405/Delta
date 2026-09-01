# DELTAFOX — Options Trading & Market Intelligence Platform

> **Where Risk Meets Reward, Intelligently.**
> Systematic Options Trading • Market Intelligence • Risk Management

---

## 🦊 Overview

**DELTAFOX** is a premium, institutional-grade options trading, market intelligence, and quantitative analysis web application. Designed with modern fintech visual architecture, cinematic 3D visual environments, and real-time options analytics.

---

## ✨ Key Features

1. **Cinematic 3D Hero Viewport**
   - Interactive 3D metallic low-poly DeltaFox emblem built with **Three.js / React Three Fiber**.
   - Reactive to cursor tracking and scroll-driven transformations.
   - Smooth horizontal live market ticker displaying **NIFTY 50, BANK NIFTY, SENSEX, NIFTY IT, NIFTY FIN SERVICE, NIFTY MIDCAP 100**.

2. **Real-Time Market Terminal & Cards**
   - 3D cursor-tilt glassmorphism cards.
   - Live prices, percentage change, day high/low, open, previous close, and sparkline trends.
   - Dynamic IST market status indicator (PRE-MARKET, MARKET OPEN, POST-MARKET, MARKET CLOSED).

3. **Interactive Charting & Sector-Wise Stock Watchlist**
   - Multi-timeframe interactive chart (`1D`, `1W`, `1M`, `3M`, `1Y`) supporting Area, Line, and Volume modes via **Recharts**.
   - Sector-wise watchlist (Indices, Energy, IT, Banking, FMCG/Auto) with Admin Stock Addition form.
   - Centralized state management — adding a stock instantly updates Watchlist, Options Chain, and Chart selectors.

4. **Institutional Options Chain**
   - Full options chain view: Calls & Puts Open Interest (OI), Change in OI, Volume, IV, LTP, Bid/Ask.
   - **ATM Strike Highlighting** with light-orange accent background.
   - Dynamic Put-Call Ratio (PCR) and Max Pain calculation.
   - Animated OI distribution bars for Call vs Put open interest.

5. **3D Options Strategies & Payoff Profiles**
   - 8 systematic options strategies: *Short Strangle, Iron Condor, Bull Put Spread, Bear Call Spread, Covered Call, Cash Secured Put, Long Straddle, Long Strangle*.
   - Horizontal gallery selector with interactive animated payoff curve diagrams highlighting profit/risk zones and breakeven levels.

6. **Market Sentiment & Verified News**
   - Quantitative sentiment dashboard: India VIX, FII/DII Net Flows, Advance/Decline ratio, and Market Breadth.
   - Filterable Market News feed with real timestamps and category tabs.

7. **Portfolio & Trading Journal**
   - Current Financial Year isolation (**FY 2024-25** & **FY 2025-26**).
   - Up to 200 trade records supported per financial year.
   - Strict P&L integrity: Open trades show `₹0.00` P&L until closed with exit price and manual P&L confirmation.
   - Cumulative P&L curve chart and win rate analytics.

8. **Founder & About DeltaFox**
   - Story of founder **Amit Patil** (Options Strategist).
   - Modern glassmorphism presentation with custom founder photo asset (`my_pic.jpg`) and brand emblem (`logo.png`).

9. **Contact & Regulatory Disclaimer**
   - Validated contact form.
   - Full SEBI / Financial disclaimer compliance footer.

---

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **3D Graphics & Animations:** Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Framer Motion
- **Styling:** Tailwind CSS v4, Glassmorphism backdrop filters
- **Charting:** Recharts
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/deltafox.git
cd deltafox

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build Production Bundle

```bash
npm run build
```

---

## 🔑 Environment & API Configuration

DeltaFox features clean abstraction for market and news data services:

Create a `.env` file in the project root:

```env
# Optional External API Keys (Defaults to baseline market quotes if omitted)
VITE_MARKET_API_URL=
VITE_NEWS_API_KEY=
```

---

## 🌐 GitHub Pages Deployment

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Push repository to GitHub on `main` branch.
2. In GitHub Repository Settings, navigate to **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. The deployment pipeline will automatically build and publish the site.

---

## 🛡️ License & Compliance

© DELTAFOX. Educational and market intelligence platform. Options trading involves risk.
