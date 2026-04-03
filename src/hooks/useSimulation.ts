import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculatePassiveIncome, calculateLoanInterest } from '../lib/marketEngine';

export const useSimulation = () => {
  const updateGameState = useGameStore(state => state.updateGameState);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const tick = () => {
      const state = useGameStore.getState();
      const now = Date.now();
      const timeDiff = now - state.last_update;

      if (timeDiff >= 1000) {
        const { totalIncome, updatedVentures } = calculatePassiveIncome(state.ventures, state.last_update, now);
        const { updatedLoans } = calculateLoanInterest(state.loans, state.last_update, now);

        updateGameState({
          ventures: updatedVentures,
          loans: updatedLoans,
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
