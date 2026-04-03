export interface Portfolio {
  cash_balance: number;
  credit_score: number;
  total_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  onboarding_completed: boolean;
  lessons_completed: string[];
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

export interface Venture {
  id: string;
  business_id: string;
  name: string;
  category: string;
  emoji: string;
  invested_amount: number;
  ownership_pct: number;
  monthly_revenue: number;
  monthly_expenses: number;
  total_income_collected: number;
  last_collection_date: number;
  loan_taken: number;
  level: number;
  status: 'active' | 'sold' | 'bankrupt';
}

export interface Loan {
  id: string;
  tier: 1 | 2;
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
  loans: Loan[];
  trades: Trade[];
  last_update: number;
}
