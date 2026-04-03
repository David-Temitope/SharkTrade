import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, TrendingDown, Target, ShieldCheck, Wallet, Trophy, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-card border border-muted p-4 rounded-xl">
    <div className="flex items-center justify-between mb-2">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{title}</span>
      <Icon size={18} className={color} />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold font-mono tracking-tight">{value}</span>
      {subValue && <span className="text-[10px] text-muted-foreground mt-1">{subValue}</span>}
    </div>
  </div>
);

const MarketTicker = () => {
  const coins = [
    { name: 'BTC', price: '$64,231.50', change: '+2.4%' },
    { name: 'ETH', price: '$3,412.10', change: '-1.2%' },
    { name: 'SOL', price: '$142.45', change: '+5.7%' },
    { name: 'BNB', price: '$582.10', change: '+0.8%' },
    { name: 'XRP', price: '$0.59', change: '-0.3%' },
  ];

  return (
    <div className="overflow-hidden bg-card/50 border-y border-muted py-2 -mx-4 mb-6">
      <div className="flex animate-scroll whitespace-nowrap gap-8 px-4">
        {[...coins, ...coins].map((coin, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-bold text-xs">{coin.name}</span>
            <span className="font-mono text-xs">{coin.price}</span>
            <span className={`text-[10px] font-mono ${coin.change.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { portfolio, trades, getPortfolioValue } = useGameStore();

  const portfolioValue = getPortfolioValue();
  const winRate = portfolio.total_trades > 0
    ? ((portfolio.winning_trades / portfolio.total_trades) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Capital Alpha</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Mogul</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 text-xs font-bold font-mono">
          $ {portfolio.cash_balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </div>

      <MarketTicker />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={Wallet}
          color="text-accent"
        />
        <StatCard
          title="Total P&L"
          value={`$${portfolio.total_pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={portfolio.total_pnl >= 0 ? TrendingUp : TrendingDown}
          color={portfolio.total_pnl >= 0 ? "text-primary" : "text-red-500"}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={Target}
          color="text-primary"
          subValue={`${portfolio.winning_trades}W / ${portfolio.losing_trades}L`}
        />
        <StatCard
          title="Credit Score"
          value={portfolio.credit_score}
          icon={ShieldCheck}
          color="text-accent"
          subValue="Shark Grade: A"
        />
      </div>

      {!portfolio.onboarding_completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent text-accent-foreground p-5 rounded-xl mb-6 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">New to the Empire?</h3>
            <p className="text-xs mb-4 opacity-90 leading-relaxed">Complete the 8-module tutorial to earn $1,000 bonus and unlock advanced trading tiers.</p>
            <button className="bg-accent-foreground text-accent px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg">
              Start Learning
            </button>
          </div>
          <GraduationCap className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={100} />
        </motion.div>
      )}

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Trophy size={16} className="text-accent" />
              Active Challenges
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 1, text: "Make your first trade", progress: portfolio.total_trades > 0 ? 100 : 0 },
              { id: 2, text: "Achieve 70% win rate", progress: parseFloat(winRate) >= 70 ? 100 : Math.min(100, (parseFloat(winRate) / 70) * 100) },
              { id: 3, text: "Own a Tech business", progress: 0 },
            ].map(challenge => (
              <div key={challenge.id} className="bg-card border border-muted p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">{challenge.text}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{challenge.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${challenge.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
            <button className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">View All</button>
          </div>
          {trades.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-8 rounded-xl text-center">
              <p className="text-muted-foreground text-xs italic">No activity yet. The market is waiting for your move.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trades.slice(0, 5).map(trade => (
                <div key={trade.id} className="bg-card border border-muted p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${trade.type === 'buy' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                      {trade.type === 'buy' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide">{trade.symbol}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(trade.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold">${trade.total_value.toLocaleString()}</p>
                    <p className={`text-[10px] font-mono ${trade.pnl >= 0 ? 'text-primary' : 'text-red-500'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
