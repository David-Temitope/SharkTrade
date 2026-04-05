import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculatePassiveIncome, calculateLoanInterest, getCryptoPrice, getStockPrice } from '../lib/marketEngine';
import type { NPC, Staff, Auction, Venture, Trade } from '../types/game';

const INITIAL_NPCS: NPC[] = [
  { id: 'npc_1', name: 'Amanda Rose', net_worth: 500000, cash_balance: 50000, owned_venture_ids: [], crypto_holdings: {}, stock_holdings: {}, personality: 'balanced' },
  { id: 'npc_2', name: 'Arthur Sterling', net_worth: 1200000, cash_balance: 150000, owned_venture_ids: [], crypto_holdings: {}, stock_holdings: {}, personality: 'aggressive' },
  { id: 'npc_3', name: 'John Author', net_worth: 250000, cash_balance: 30000, owned_venture_ids: [], crypto_holdings: {}, stock_holdings: {}, personality: 'conservative' },
  { id: 'npc_4', name: 'Elena Vance', net_worth: 800000, cash_balance: 100000, owned_venture_ids: [], crypto_holdings: {}, stock_holdings: {}, personality: 'balanced' },
];

const ROLES = ['Accountant', 'HR', 'Manager', 'Security', 'Marketer', 'Salesman', 'Cleaner', 'Stocker'];

const VENTURE_TEMPLATES = [
  { id: 'stixx_corp', name: 'Stixx Manufacturing', category: 'Industrial', emoji: '🥢', investment: 450000, revenue: 85000, expenses: 35000, type: 'company' },
  { id: 'alpha_logistics', name: 'Alpha Logistics', category: 'Industrial', emoji: '📦', investment: 600000, revenue: 110000, expenses: 50000, type: 'company' },
  { id: 'tech_giant', name: 'AlphaTech Corp', category: 'Tech', emoji: '💻', investment: 2000000, revenue: 350000, expenses: 120000, type: 'company' },
  { id: 'energy_corp', name: 'Global Energy', category: 'Energy', emoji: '⚡', investment: 1500000, revenue: 220000, expenses: 90000, type: 'company' },
];

export const useSimulation = () => {
  const { updateGameState, npcs, staff, auctions, ventures, trades, portfolio, last_update } = useGameStore();
  const timerRef = useRef<any>(null);

  // Initialize NPCs and Staff if they don't exist
  useEffect(() => {
    const state = useGameStore.getState();
    if (state.npcs.length === 0) {
      const initialStaff: Staff[] = [];
      ROLES.forEach(role => {
        for (let i = 0; i < 20; i++) {
          const skill = Math.floor(Math.random() * 90) + 10;
          initialStaff.push({
            id: `staff_${role}_${i}`,
            name: `Staff ${role} ${i + 1}`,
            role,
            skill_level: skill,
            base_pay: Math.floor(skill * 0.5) + 10,
            current_pay: 0,
            employer_id: null
          });
        }
      });

      const initialVentures: Venture[] = VENTURE_TEMPLATES.map(t => ({
        id: Math.random().toString(36).substr(2, 9),
        business_id: t.id,
        name: t.name,
        category: t.category,
        emoji: t.emoji,
        invested_amount: t.investment,
        ownership_pct: 100,
        monthly_revenue: t.revenue,
        monthly_expenses: t.expenses,
        total_income_collected: 0,
        last_collection_date: Date.now(),
        loan_taken: 0,
        level: 1,
        status: 'active',
        type: t.type as any,
        ceo_id: INITIAL_NPCS[Math.floor(Math.random() * INITIAL_NPCS.length)].id,
        staff_ids: [],
        total_shares: 1000000,
        shares_available: 40 // Default 40% on market
      }));

      updateGameState({
        npcs: INITIAL_NPCS,
        staff: initialStaff,
        ventures: initialVentures,
        last_update: Date.now()
      });
    }
  }, [updateGameState]);

  useEffect(() => {
    const tick = () => {
      const state = useGameStore.getState();
      const now = Date.now();
      const timeDiff = now - state.last_update;

      if (timeDiff >= 1000) {
        const { totalIncome, updatedVentures } = calculatePassiveIncome(state.ventures, state.staff, state.last_update, now);
        const { updatedLoans } = calculateLoanInterest(state.loans, state.last_update, now);

        // --- NPC Logic ---
        const updatedNPCs = [...state.npcs];
        const newTrades: Trade[] = [];

        updatedNPCs.forEach(npc => {
          // NPCs collect income from their businesses
          const npcVentures = state.ventures.filter(v => v.ceo_id === npc.id);
          const { totalIncome: npcIncome } = calculatePassiveIncome(npcVentures, state.staff, state.last_update, now);
          npc.cash_balance += npcIncome;
          npc.net_worth += npcIncome;

          // NPC Trading Simulation (every ~5 minutes)
          if (Math.random() < 0.003) {
            const assets = ['bitcoin', 'ethereum', 'solana', 'tech_giant', 'energy_corp'];
            const assetId = assets[Math.floor(Math.random() * assets.length)];
            const assetType = assetId.includes('_') ? 'stock' : 'crypto';
            const price = assetType === 'crypto'
              ? getCryptoPrice(assetId, now, state.trades)
              : getStockPrice(assetId, now, state.trades, state.staff, state.ventures);

            const action = Math.random() > 0.5 ? 'buy' : 'sell';
            const quantity = action === 'buy'
              ? (npc.cash_balance * 0.1) / price
              : (npc.crypto_holdings[assetId] || npc.stock_holdings[assetId] || 0) * 0.5;

            if (quantity > 0) {
              if (action === 'buy' && npc.cash_balance >= quantity * price) {
                npc.cash_balance -= quantity * price;
                if (assetType === 'crypto') npc.crypto_holdings[assetId] = (npc.crypto_holdings[assetId] || 0) + quantity;
                else npc.stock_holdings[assetId] = (npc.stock_holdings[assetId] || 0) + quantity;
              } else if (action === 'sell') {
                npc.cash_balance += quantity * price;
                if (assetType === 'crypto') npc.crypto_holdings[assetId] -= quantity;
                else npc.stock_holdings[assetId] -= quantity;
              }

              newTrades.push({
                id: Math.random().toString(36).substr(2, 9),
                asset_id: assetId,
                symbol: assetId.toUpperCase(),
                type: action,
                asset_type: assetType,
                quantity,
                price,
                total_value: quantity * price,
                pnl: 0,
                timestamp: now,
                trader_id: npc.id
              });
            }
          }
        });

        // --- CEO Takeover Logic (Check share percentages) ---
        updatedVentures.forEach(v => {
          if (v.type === 'company') {
            const userHolding = state.stock_holdings.find(h => h.asset_id === v.business_id);
            const userSharePct = userHolding ? (userHolding.quantity / v.total_shares) * 100 : 0;

            // If user owns more than current CEO (current CEO has 100% - shares_available% - any other owners)
            // Simplified: If user owns more than 50% OR user is largest shareholder and CEO is NPC
            if (userSharePct > (100 - v.shares_available) && v.ceo_id !== 'user') {
               v.ceo_id = 'user';
               v.ownership_pct = userSharePct;
            }
          }
        });

        // --- Automatic Auction Generation ---
        const newAuctions: Auction[] = [];
        updatedVentures.forEach(v => {
           if (v.ceo_id === null && !state.auctions.some(a => a.venture_id === v.id && a.status === 'active')) {
              newAuctions.push({
                 id: Math.random().toString(36).substr(2, 9),
                 venture_id: v.id,
                 highest_bidder_id: null,
                 highest_bid: (v.type === 'company' ? 500000 : 50000) * 1.1,
                 end_time: now + 30 * 60 * 1000,
                 status: 'active'
              });
           }
        });

        // --- Auction Processing ---
        const updatedAuctions = [...state.auctions, ...newAuctions].map(auction => {
          if (auction.status === 'ended') return auction;

          if (now >= auction.end_time) {
            // Auction Finished
            const venture = updatedVentures.find(v => v.id === auction.venture_id);
            if (venture && auction.highest_bidder_id) {
              const bidderId = auction.highest_bidder_id;
              const isUser = bidderId === 'user';

              if (!isUser) {
                const npc = updatedNPCs.find(n => n.id === bidderId);
                if (npc) {
                  npc.cash_balance -= auction.highest_bid;
                  npc.owned_venture_ids.push(venture.id);
                }
              }

              // Update venture ownership
              updatedVentures.forEach(v => {
                if (v.id === venture.id) {
                  v.ceo_id = bidderId;
                  v.invested_amount = auction.highest_bid;
                  v.ownership_pct = 100;
                }
              });
            }
            return { ...auction, status: 'ended' } as Auction;
          }

          // NPC Bidding Simulation
          updatedNPCs.forEach(npc => {
            const minNextBid = auction.highest_bid * 1.05;
            if (npc.id !== auction.highest_bidder_id && npc.cash_balance > minNextBid) {
              const venture = updatedVentures.find(v => v.id === auction.venture_id);
              const valuation = venture ? (venture.type === 'company' ? 1000000 : 100000) : 0;

              if (minNextBid < valuation * 1.5 && Math.random() < 0.05) {
                auction.highest_bidder_id = npc.id;
                auction.highest_bid = minNextBid;
              }
            }
          });

          return auction;
        });

        // --- Hire Competiton Logic (NPCs trying to steal staff) ---
        const updatedStaff = state.staff.map(s => {
          if (s.employer_id === 'user' && Math.random() < 0.001) {
            // NPC makes an offer to user's staff
            const competitor = updatedNPCs[Math.floor(Math.random() * updatedNPCs.length)];
            const offer = s.current_pay * (1.2 + Math.random() * 1);
            if (competitor.cash_balance > offer * 100) {
               if (offer > s.current_pay * 2) {
                 s.employer_id = competitor.id;
                 s.current_pay = offer;
                 updatedVentures.forEach(v => {
                    v.staff_ids = v.staff_ids.filter(id => id !== s.id);
                 });
               }
            }
          }
          return s;
        });

        updateGameState({
          ventures: updatedVentures,
          loans: updatedLoans,
          npcs: updatedNPCs,
          auctions: updatedAuctions,
          staff: updatedStaff,
          trades: [...newTrades, ...state.trades].slice(0, 500),
          last_update: now,
          portfolio: {
            ...state.portfolio,
            cash_balance: state.portfolio.cash_balance + totalIncome
          }
        });
      }
    };

    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [updateGameState]);
};
