import type { Venture, Loan } from '../types/game';

// Seed for deterministic market simulation
const SEED = 42;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const getCryptoPrice = (coinId: string, timestamp: number) => {
  // Simple deterministic price simulation based on coinId and timestamp
  const basePrices: Record<string, number> = {
    bitcoin: 65000,
    ethereum: 3500,
    solana: 140,
    cardano: 0.45,
    ripple: 0.6,
  };

  const base = basePrices[coinId] || 100;
  const hash = coinId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeOffset = Math.floor(timestamp / (1000 * 60 * 5)); // 5 min intervals

  const noise = seededRandom(hash + timeOffset) * 0.1 - 0.05; // +/- 5%
  return base * (1 + noise);
};

export const getStockPrice = (stockId: string, timestamp: number) => {
  const basePrices: Record<string, number> = {
    tech_giant: 250,
    energy_corp: 120,
    fin_bank: 85,
    health_care: 150,
    consumer_goods: 60,
  };

  const base = basePrices[stockId] || 100;
  const hash = stockId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeOffset = Math.floor(timestamp / (1000 * 60 * 60)); // 1 hour intervals

  const noise = seededRandom(hash + timeOffset) * 0.04 - 0.02; // +/- 2%
  return base * (1 + noise);
};

export const calculatePassiveIncome = (ventures: Venture[], lastUpdate: number, currentTimestamp: number) => {
  const secondsPassed = (currentTimestamp - lastUpdate) / 1000;
  const hoursPassed = secondsPassed / 3600;

  let totalIncome = 0;
  const updatedVentures = ventures.map(v => {
    if (v.status !== 'active') return v;

    const hourlyProfit = (v.monthly_revenue - v.monthly_expenses) / (30 * 24);
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
  const daysPassed = secondsPassed / (24 * 3600);

  const updatedLoans = loans.map(l => {
    if (l.status !== 'active' && l.status !== 'overdue') return l;

    const dailyRate = l.interest_rate / 365;
    const interest = l.principal * dailyRate * daysPassed;

    let newStatus = l.status;
    if (currentTimestamp > l.due_date) {
      newStatus = 'overdue';
    }

    return {
      ...l,
      total_owed: l.total_owed + interest,
      status: newStatus
    } as Loan;
  });

  return { updatedLoans };
};
