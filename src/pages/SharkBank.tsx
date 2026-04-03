import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Landmark, ShieldCheck, TrendingUp, TrendingDown, Clock, AlertCircle, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const SharkBank: React.FC = () => {
  const { portfolio, loans, addLoan, repayLoan, addCash, subtractCash } = useGameStore();
  const [selectedTier, setSelectedTier] = useState<1 | 2>(1);

  const borrow = (tier: 1 | 2) => {
    const amount = tier === 1 ? 5000 : 25000;
    const interest = tier === 1 ? 0.12 : 0.08;
    const dueDate = Date.now() + (14 * 24 * 3600 * 1000); // 14 days

    if (portfolio.credit_score < (tier === 1 ? 500 : 650)) return;

    addLoan({
      id: Math.random().toString(36).substr(2, 9),
      tier,
      principal: amount,
      interest_rate: interest,
      total_owed: amount * (1 + interest),
      amount_repaid: 0,
      status: 'active',
      due_date: dueDate,
      last_penalty_date: null
    });
    addCash(amount);
  };

  const handleRepay = (loan: any) => {
    const amountToRepay = loan.total_owed - loan.amount_repaid;
    if (portfolio.cash_balance < amountToRepay) return;

    subtractCash(amountToRepay);
    repayLoan(loan.id, amountToRepay);
    // Increase credit score
    useGameStore.getState().setPortfolio({
      credit_score: Math.min(850, portfolio.credit_score + (loan.tier === 1 ? 15 : 40))
    });
  };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-accent/20 text-accent rounded-2xl border border-accent/20">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shark Bank</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-tight">Institutional Leverage & Credit</p>
        </div>
      </div>

      <div className="bg-card border border-muted p-8 rounded-[40px] mb-8 text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Mogul Credit Rating</p>
          <div className="text-6xl font-black font-mono tracking-tight text-accent mb-4">{portfolio.credit_score}</div>
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <ShieldCheck key={i} size={16} className={i < (portfolio.credit_score - 300) / 110 ? 'text-accent' : 'text-muted/30'} fill="currentColor" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
            Your credit score determines your interest rates and maximum leverage. Repay on time to climb the ranks.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      </div>

      <div className="space-y-6 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest px-2">Institutional Tiers</h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { tier: 1, title: 'Starter Leverage', amount: 5000, rate: 12, minScore: 500, color: 'text-primary' },
            { tier: 2, title: 'Growth Capital', amount: 25000, rate: 8, minScore: 650, color: 'text-accent' }
          ].map(t => (
            <div key={t.tier} className="bg-card border border-muted p-6 rounded-3xl group transition-all hover:border-muted-foreground/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-lg leading-tight">{t.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Tier {t.tier} Facility</p>
                </div>
                <div className={`p-3 bg-muted/50 rounded-2xl ${t.color}`}>
                  <ArrowUpRight size={24} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Max Principal</p>
                  <p className="text-xl font-mono font-bold">${t.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Daily Interest</p>
                  <p className="text-xl font-mono font-bold">{t.rate}% APR</p>
                </div>
              </div>
              <button
                onClick={() => borrow(t.tier as 1 | 2)}
                disabled={portfolio.credit_score < t.minScore}
                className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                  portfolio.credit_score >= t.minScore
                    ? 'bg-white text-black hover:bg-primary hover:text-white'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed border border-muted'
                }`}
              >
                {portfolio.credit_score >= t.minScore ? 'Apply for Capital' : `Score Required: ${t.minScore}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest px-2">Active Obligations</h3>
        {loans.filter(l => l.status !== 'repaid').length === 0 ? (
          <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
            <Clock className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
            <p className="text-muted-foreground text-xs font-medium italic">No active debt. You are operating on pure capital.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.filter(l => l.status !== 'repaid').map(l => (
              <div key={l.id} className="bg-card border border-muted p-5 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-accent">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">Tier {l.tier} Loan</h4>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Due {new Date(l.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {l.status === 'overdue' && (
                    <div className="bg-red-500/20 text-red-500 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} /> Overdue
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Owed</span>
                    <span className="font-mono font-bold">${l.total_owed.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${(l.amount_repaid / l.total_owed) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRepay(l)}
                  disabled={portfolio.cash_balance < (l.total_owed - l.amount_repaid)}
                  className="w-full bg-accent/10 text-accent border border-accent/20 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50"
                >
                  Settle Debt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharkBank;
