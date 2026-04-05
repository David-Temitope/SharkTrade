import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Portfolio, Holding, StockHolding, Venture, Loan, Trade, NPC, Staff, Auction } from '../types/game';
import { getCryptoPrice, getStockPrice } from '../lib/marketEngine';

interface GameStore extends GameState {
  setPortfolio: (portfolio: Partial<Portfolio>) => void;
  addTrade: (trade: Trade) => void;
  updateHolding: (holding: Holding) => void;
  updateStockHolding: (holding: StockHolding) => void;
  addVenture: (venture: Venture) => void;
  updateVenture: (id: string, updates: Partial<Venture>) => void;
  addLoan: (loan: Loan) => void;
  repayLoan: (id: string, amount: number) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  addCash: (amount: number) => void;
  subtractCash: (amount: number) => void;
  getPortfolioValue: () => number;
  resetGame: () => void;

  // New NPC & Auction Actions
  updateNPC: (id: string, updates: Partial<NPC>) => void;
  addAuction: (auction: Auction) => void;
  updateAuction: (id: string, updates: Partial<Auction>) => void;
  hireStaff: (staffId: string, ventureId: string, pay: number) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
}

const initialPortfolio: Portfolio = {
  cash_balance: 10000,
  credit_score: 550,
  total_pnl: 0,
  total_trades: 0,
  winning_trades: 0,
  losing_trades: 0,
  onboarding_completed: false,
  lessons_completed: [],
  payback_status: 0,
};

const initialState: GameState = {
  portfolio: initialPortfolio,
  crypto_holdings: [],
  stock_holdings: [],
  ventures: [],
  npcs: [],
  staff: [],
  auctions: [],
  loans: [],
  trades: [],
  last_update: Date.now(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      setPortfolio: (portfolio) =>
        set((state) => ({
          portfolio: { ...state.portfolio, ...portfolio },
        })),

      addTrade: (trade) =>
        set((state) => ({
          trades: [trade, ...state.trades],
          portfolio: {
            ...state.portfolio,
            total_trades: state.portfolio.total_trades + 1,
            winning_trades: trade.pnl > 0 ? state.portfolio.winning_trades + 1 : state.portfolio.winning_trades,
            losing_trades: trade.pnl < 0 ? state.portfolio.losing_trades + 1 : state.portfolio.losing_trades,
            total_pnl: state.portfolio.total_pnl + trade.pnl,
          },
        })),

      updateHolding: (holding) =>
        set((state) => {
          const index = state.crypto_holdings.findIndex((h) => h.asset_id === holding.asset_id);
          const newHoldings = [...state.crypto_holdings];
          if (holding.quantity <= 0) {
            if (index > -1) newHoldings.splice(index, 1);
          } else if (index > -1) {
            newHoldings[index] = holding;
          } else {
            newHoldings.push(holding);
          }
          return { crypto_holdings: newHoldings };
        }),

      updateStockHolding: (holding) =>
        set((state) => {
          const index = state.stock_holdings.findIndex((h) => h.asset_id === holding.asset_id);
          const newHoldings = [...state.stock_holdings];
          if (holding.quantity <= 0) {
            if (index > -1) newHoldings.splice(index, 1);
          } else if (index > -1) {
            newHoldings[index] = holding;
          } else {
            newHoldings.push(holding);
          }
          return { stock_holdings: newHoldings };
        }),

      addVenture: (venture) =>
        set((state) => ({
          ventures: [...state.ventures, venture],
        })),

      updateVenture: (id, updates) =>
        set((state) => ({
          ventures: state.ventures.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),

      addLoan: (loan) =>
        set((state) => ({
          loans: [...state.loans, loan],
        })),

      repayLoan: (id, amount) =>
        set((state) => ({
          loans: state.loans.map((l) => {
            if (l.id === id) {
              const newRepaid = l.amount_repaid + amount;
              return {
                ...l,
                amount_repaid: newRepaid,
                status: newRepaid >= l.total_owed ? 'repaid' : l.status,
              };
            }
            return l;
          }),
        })),

      updateGameState: (updates) => set((state) => ({ ...state, ...updates })),

      addCash: (amount) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            cash_balance: state.portfolio.cash_balance + amount,
          },
        })),

      subtractCash: (amount) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            cash_balance: state.portfolio.cash_balance - amount,
          },
        })),

      updateNPC: (id, updates) =>
        set((state) => ({
          npcs: state.npcs.map((npc) => (npc.id === id ? { ...npc, ...updates } : npc)),
        })),

      addAuction: (auction) =>
        set((state) => ({
          auctions: [...state.auctions, auction],
        })),

      updateAuction: (id, updates) =>
        set((state) => ({
          auctions: state.auctions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      hireStaff: (staffId, ventureId, pay) =>
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === staffId ? { ...s, employer_id: ventureId, current_pay: pay } : s
          ),
          ventures: state.ventures.map((v) =>
            v.id === ventureId ? { ...v, staff_ids: [...v.staff_ids, staffId] } : v
          ),
        })),

      updateStaff: (id, updates) =>
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      getPortfolioValue: () => {
        const state = useGameStore.getState();
        const now = Date.now();
        const cryptoVal = state.crypto_holdings.reduce((acc, h) => acc + h.quantity * getCryptoPrice(h.asset_id, now), 0);
        const stockVal = state.stock_holdings.reduce((acc, h) => acc + h.quantity * getStockPrice(h.asset_id, now), 0);
        const ventureVal = state.ventures.reduce((acc, v) => acc + v.invested_amount, 0);
        return state.portfolio.cash_balance + cryptoVal + stockVal + ventureVal;
      },

      resetGame: () => set(initialState),
    }),
    {
      name: 'capital-alpha-storage',
    }
  )
);
