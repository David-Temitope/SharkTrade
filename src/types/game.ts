export interface Portfolio {
  cash_balance: number;
  credit_score: number;
  total_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  onboarding_completed: boolean;
  lessons_completed: string[];
  payback_status: number; // For loan progression
}

export interface Trade {
  id: string;
  asset_id: string;
  symbol: string;
  type: 'buy' | 'sell';
  asset_type: 'crypto' | 'stock';
  quantity: number;
  price: number;
  total_value: number;
  pnl: number;
  timestamp: number;
  trader_id?: string; // ID of NPC if it was an NPC trade
}

export interface Holding {
  asset_id: string;
  symbol: string;
  quantity: number;
  avg_buy_price: number;
}

export interface StockHolding extends Holding {
  total_dividends_received: number;
  last_dividend_date: number | null;
}

export interface Staff {
  id: string;
  name: string;
  role: string; // Accountant, HR, Manager, etc.
  skill_level: number; // 1-100
  base_pay: number; // per hour
  current_pay: number;
  employer_id: string | null; // Venture ID or NPC ID
}

export interface Venture {
  id: string;
  business_id: string;
  name: string;
  category: string;
  emoji: string;
  invested_amount: number;
  ownership_pct: number;
  monthly_revenue: number; // Base revenue
  monthly_expenses: number; // Base expenses
  total_income_collected: number;
  last_collection_date: number;
  loan_taken: number;
  level: number;
  status: 'active' | 'sold' | 'bankrupt';
  type: 'business' | 'company';
  ceo_id: string | null; // User or NPC ID
  staff_ids: string[];
  total_shares: number; // Total shares issued (e.g., 1,000,000)
  shares_available: number; // Percentage of shares on public market (0-100)
}

export interface NPC {
  id: string;
  name: string;
  net_worth: number;
  cash_balance: number;
  owned_venture_ids: string[];
  crypto_holdings: Record<string, number>;
  stock_holdings: Record<string, number>;
  personality: 'aggressive' | 'conservative' | 'balanced';
}

export interface Auction {
  id: string;
  venture_id: string;
  highest_bidder_id: string | null;
  highest_bid: number;
  end_time: number;
  status: 'active' | 'ended';
}

export interface Loan {
  id: string;
  principal: number;
  interest_rate: number;
  total_owed: number;
  amount_repaid: number;
  status: 'active' | 'repaid' | 'overdue';
  due_date: number;
  last_penalty_date: number | null;
}

export interface GameState {
  portfolio: Portfolio;
  crypto_holdings: Holding[];
  stock_holdings: StockHolding[];
  ventures: Venture[];
  npcs: NPC[];
  staff: Staff[];
  auctions: Auction[];
  loans: Loan[];
  trades: Trade[];
  last_update: number;
}
