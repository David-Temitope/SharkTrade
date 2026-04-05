import type { Venture, Loan, Trade, Staff } from '../types/game';

// Seed for deterministic market simulation
const SEED = 42;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Global market state (not persisted, calculated on the fly)
// In a real app, we might want to persist "market impact" from trades
export const getMarketImpact = (assetId: string, trades: Trade[]) => {
  const impactWindow = 24 * 60 * 60 * 1000; // Last 24 hours
  const now = Date.now();
  const relevantTrades = trades.filter(t => t.asset_id === assetId && (now - t.timestamp) < impactWindow);

  return relevantTrades.reduce((acc, t) => {
    const move = t.type === 'buy' ? 0.0001 : -0.0001; // 0.01% per trade unit (simplified)
    return acc + (move * t.quantity);
  }, 0);
};

export const getCryptoPrice = (coinId: string, timestamp: number, trades: Trade[] = []) => {
  const basePrices: Record<string, number> = {
    bitcoin: 65000,
    ethereum: 3500,
    solana: 140,
    cardano: 0.45,
    ripple: 0.6,
  };

  const base = basePrices[coinId] || 100;
  const hash = coinId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeOffset = Math.floor(timestamp / (1000 * 30)); // 30 second intervals

  const noise = seededRandom(hash + timeOffset) * 0.02 - 0.01; // +/- 1% every 30s
  const impact = getMarketImpact(coinId, trades);

  return base * (1 + noise + impact);
};

export const getStockPrice = (stockId: string, timestamp: number, trades: Trade[] = [], staff: Staff[] = [], ventures: Venture[] = []) => {
  const basePrices: Record<string, number> = {
    tech_giant: 250,
    energy_corp: 120,
    fin_bank: 85,
    health_care: 150,
    consumer_goods: 60,
  };

  const base = basePrices[stockId] || 100;
  const hash = stockId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeOffset = Math.floor(timestamp / (1000 * 30)); // 30 second intervals

  const noise = seededRandom(hash + timeOffset) * 0.01 - 0.005; // +/- 0.5% every 30s
  const impact = getMarketImpact(stockId, trades);

  // Staff skill impact for user/NPC companies
  let staffImpact = 0;
  const company = ventures.find(v => v.business_id === stockId);
  if (company && company.staff_ids.length > 0) {
    const companyStaff = staff.filter(s => company.staff_ids.includes(s.id));
    const avgSkill = companyStaff.reduce((acc, s) => acc + s.skill_level, 0) / companyStaff.length;
    staffImpact = (avgSkill - 50) / 500; // +/- 10% based on skill
  }

  return base * (1 + noise + impact + staffImpact);
};

export const calculatePassiveIncome = (ventures: Venture[], staff: Staff[], lastUpdate: number, currentTimestamp: number) => {
  const secondsPassed = (currentTimestamp - lastUpdate) / 1000;
  const hoursPassed = secondsPassed / 3600;

  let totalIncome = 0;
  const updatedVentures = ventures.map(v => {
    if (v.status !== 'active') return v;

    const companyStaff = staff.filter(s => v.staff_ids.includes(s.id));
    const skillMultiplier = companyStaff.length > 0
      ? 1 + (companyStaff.reduce((acc, s) => acc + s.skill_level, 0) / (companyStaff.length * 100))
      : 1;

    const hourlyProfit = ((v.monthly_revenue * skillMultiplier) - v.monthly_expenses) / (30 * 24);
    const earned = hourlyProfit * hoursPassed;
    totalIncome += earned;

    return {
      ...v,
      total_income_collected: v.total_income_collected + earned,
      last_collection_date: currentTimestamp
    };
  });

  return { totalIncome, updatedVentures };
};

export const calculateLoanInterest = (loans: Loan[], lastUpdate: number, currentTimestamp: number) => {
  const secondsPassed = (currentTimestamp - lastUpdate) / 1000;
  const hoursPassed = secondsPassed / 3600;

  const updatedLoans = loans.map(l => {
    if (l.status !== 'active' && l.status !== 'overdue') return l;

    let interest = 0;
    const isOverdue = currentTimestamp > l.due_date;

    if (isOverdue) {
      // 3% simple interest on principal per hour after deadline
      interest = l.principal * 0.03 * hoursPassed;
    } else {
      const dailyRate = l.interest_rate / 365;
      interest = l.principal * dailyRate * (hoursPassed / 24);
    }

    return {
      ...l,
      total_owed: l.total_owed + interest,
      status: isOverdue ? 'overdue' : 'active'
    } as Loan;
  });

  return { updatedLoans };
};

export const getPriceHistory = (assetId: string, assetType: 'crypto' | 'stock', timeframe: string, trades: Trade[] = []) => {
  const now = Date.now();
  const points = 50;
  let duration = 0;
  let interval = 0;

  switch (timeframe) {
    case '1H': duration = 60 * 60 * 1000; break;
    case '1D': duration = 24 * 60 * 60 * 1000; break;
    case '1W': duration = 7 * 24 * 60 * 60 * 1000; break;
    case '1M': duration = 30 * 24 * 60 * 60 * 1000; break;
    case '1Y': duration = 365 * 24 * 60 * 60 * 1000; break;
    case 'ALL': duration = 2 * 365 * 24 * 60 * 60 * 1000; break;
    default: duration = 24 * 60 * 60 * 1000;
  }

  interval = duration / points;
  const history = [];

  for (let i = points; i >= 0; i--) {
    const ts = now - (i * interval);
    const price = assetType === 'crypto'
      ? getCryptoPrice(assetId, ts, trades)
      : getStockPrice(assetId, ts, trades);
    history.push({ time: ts, price });
  }

  return history;
};
