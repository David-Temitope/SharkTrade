# Capital Alpha

**Capital Alpha** is a high-stakes, mobile-first financial simulation engine designed to teach and challenge users in the world of aggressive wealth building. It goes beyond simple paper trading by simulating a living, breathing economy where every action—from hiring a cleaner to taking a shark loan—impacts your trajectory toward becoming an industrial tycoon.

---

## 🎯 Core Purpose & Philosophy
The core purpose of Capital Alpha is to provide a "gamified" sandbox for financial literacy and strategic business management. Unlike traditional trading apps, it bridges the gap between **Market Trading** (Stocks/Crypto) and **Corporate Management** (Ventures/Staffing). The game forces players to manage liquidity, credit risk, and human capital simultaneously.

---

## 🚀 Key Features

### 1. Unified Empire Dashboard
*   **Real-time Portfolio Tracking**: Monitor Cash Balance, Total P&L, and Win Rates.
*   **Credit Score System**: A dynamic score that dictates your access to capital.
*   **Global Order Flow**: A live feed of market activity, showing both User and NPC trades.

### 2. High-Fidelity Market Simulation
*   **Deterministic Pricing**: Markets update every 30 seconds using a seeded random engine for fairness and predictability.
*   **Market Impact Engine**: Large trades (User or NPC) physically move the market price, simulating real-world supply and demand.
*   **Hybrid Assets**: Trade volatile Cryptocurrencies (BTC, ETH, SOL) or stable Corporate Stocks (ATEC, STIX).

### 3. Ventures & Corporate Ownership
*   **Business Acquisitions**: Buy local businesses or take over massive corporations.
*   **Public Offerings**: Companies are listed on the stock market; ownership is tracked via share percentages.
*   **Passive Income**: Businesses generate revenue based on "Skill Multipliers" derived from your staff.

### 4. Advanced Staffing System
*   **Professional NPC Roster**: 160+ unique NPCs with specialized roles (Accountants, HR, Managers, Security, Marketers, Salesmen, Cleaners, Stockers).
*   **Skill-Driven Revenue**: The hourly profit of your ventures is directly tied to the average skill level of your employees.
*   **Employer Competition**: NPCs don't just sit there—they can be poached or hired by rival NPC corporations.

### 5. Shark Bank & Loan Progression
*   **Tiered Borrowing**: Start with a $5,000 "Starter" loan and work your way up to a $1,000,000 "Tycoon" line.
*   **Repayment Discipline**: Early payments boost your `payback_status`, unlocking lower interest rates and higher limits.
*   **Simple Interest Penalties**: Late payments accrue 3% simple interest per hour on the original principal.

### 6. The Auction House
*   **Corporate Takeovers**: When a CEO leaves or a company goes bankrupt, a 30-minute auction is triggered.
*   **Bidding Wars**: Compete against aggressive NPCs in real-time to win majority control of businesses.

---

## 🛠 Technical Stack
*   **Frontend**: React 18, Vite, TypeScript.
*   **State Management**: Zustand with `persist` middleware for local-first data.
*   **Styling**: Tailwind CSS with a "Deep Navy & Gold" luxury theme.
*   **Animations**: Framer Motion for smooth UI transitions and haptic-like feedback.
*   **Charts**: Recharts for performance-oriented market data visualization.

---

## 🧠 AI Coding Tool Prompt Sequence
*Use these prompts sequentially to rebuild Capital Alpha piece-by-piece.*

### Phase 1: Foundation & Core Engine
> "Build a React + TypeScript + Vite project with Tailwind CSS. Create a Zustand store called `gameStore` to manage a player's `Portfolio` (cash, credit score, pnl). Implement a deterministic market engine in a `marketEngine.ts` file that uses a seeded random function to generate prices for 5 crypto assets every 30 seconds. Prices should be calculated based on a base value + time-based noise."

### Phase 2: Trading Interface & Charts
> "Create a 'Trade' page with a list of assets. Use `recharts` to build a price history chart that supports 1H, 1D, and 1W timeframes. Add 'Buy' and 'Sell' functionality that updates the Zustand store, subtracts/adds cash, and records the trade in a `trades` array. Ensure the UI uses a dark-themed 'Deep Navy' background with 'Gold' accents."

### Phase 3: Banking & Credit System
> "Implement a 'Shark Bank' page. Create a tiered loan system where users start with a $5,000 limit. Add logic to track `payback_status`. If a user pays back early, increment the status; if late, apply a 3% hourly interest penalty. Display a dynamic Credit Score based on total successful repayments."

### Phase 4: Ventures & Staffing
> "Build a 'Ventures' module. Define a `Staff` type with roles like 'Manager' and 'Accountant' and a `skill_level` (1-100). Create a system where businesses generate hourly revenue. The revenue formula must be: `(Base Revenue * (Average Staff Skill / 50)) - Expenses`. Allow users to hire from a pool of 20 randomized NPCs."

### Phase 5: NPCs & Auctions
> "Add an `npcs` array to the store. Create a background interval that simulates NPC trades—these trades should use a `getMarketImpact` function to slightly move asset prices for everyone. Implement an `Auction` system: when a venture is 'CEO-less', start a 30-minute timer where NPCs and the User can bid cash for ownership."

### Phase 6: Global Polish & Refinement
> "Refine the UI using `framer-motion` for page transitions. Add a 'Market Ticker' to the dashboard that scrolls through live prices. Ensure all numbers use 'JetBrains Mono' for a professional financial aesthetic. Implement a 'Lessons' section where users can complete 'financial literacy' tasks to earn small cash bonuses."

---

## 🌐 Transitioning to Global Multiplayer
*To move from a local NPC-driven world to a shared global state where all users interact in one world, follow this high-level architectural roadmap:*

### 1. Centralized Authority (The Backend)
The current `Zustand + localStorage` approach must be moved to a server (e.g., Node.js or Go). The server becomes the "Source of Truth" for all market prices and ownership records, preventing clients from "cheating" by modifying local state.

### 2. Real-Time Synchronization (WebSockets)
Replace the client-side `setInterval` for market prices with a **WebSocket** (or Server-Sent Events) stream. The server calculates the "Global Ticker" once and broadcasts it to all connected players simultaneously.

### 3. Global Order Book
When a user places a trade, it is sent to the server's **Matchmaker**. If two users are trading the same stock, their orders can be matched. The "Market Impact" is then calculated globally, so if a "Whale" (a wealthy player) sells a huge amount of Bitcoin, every other player sees the price drop on their screen in real-time.

### 4. Competitive Auctions & Bidding
Auctions move from being "local events" to "Global Room Events." When a business goes up for sale, the server opens a room. Every player's bid is sent to the server, validated for sufficient funds, and broadcasted. This creates a true "Human vs. Human" competitive environment.

### 5. Shared Labor Market
Instead of a local pool of NPCs, the "Staff" becomes a global resource. If one player hires a top-tier "Manager," that NPC is no longer available for other players to hire, creating a strategic "War for Talent" across the entire player base.

### 6. Persistence Strategy
Replace `persist` middleware with a database (PostgreSQL/MongoDB). User portfolios, ventures, and trade histories are stored centrally, allowing players to log in from any device and see their same "Capital Alpha" empire.
