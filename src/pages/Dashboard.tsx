import React from 'react';
import { useGameStore } from '../store/gameStore';
import { TrendingUp, TrendingDown, Target, ShieldCheck, Wallet, Trophy, GraduationCap, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCryptoPrice, getStockPrice } from '../lib/marketEngine';

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-card border border-muted p-4 rounded-xl">
    <div className="flex items-center justify-between mb-2">
      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{title}</span>
      <Icon size={16} className={color} />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold font-mono tracking-tight">{value}</span>
      {subValue && <span className="text-[9px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">{subValue}</span>}
    </div>
  </div>
);

const MarketTicker = () => {
  const { trades, staff, ventures } = useGameStore();
  const now = Date.now();

  const assets = [
    { name: 'BTC', price: getCryptoPrice('bitcoin', now, trades), type: 'crypto' },
    { name: 'ETH', price: getCryptoPrice('ethereum', now, trades), type: 'crypto' },
    { name: 'ATEC', price: getStockPrice('tech_giant', now, trades, staff, ventures), type: 'stock' },
    { name: 'STIX', price: getStockPrice('stixx_corp', now, trades, staff, ventures), type: 'stock' },
    { name: 'SOL', price: getCryptoPrice('solana', now, trades), type: 'crypto' },
  ];

  return (
    <div className="overflow-hidden bg-card/50 border-y border-muted py-2 -mx-4 mb-6">
      <div className="flex animate-scroll whitespace-nowrap gap-8 px-4">
        {[...assets, ...assets].map((asset, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-bold text-[10px] tracking-widest">{asset.name}</span>
            <span className="font-mono text-[10px] font-bold">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`text-[9px] font-mono font-bold text-primary`}>
              +0.25%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { portfolio, trades, auctions, getPortfolioValue } = useGameStore();

  const portfolioValue = getPortfolioValue();
  const winRate = portfolio.total_trades > 0
    ? ((portfolio.winning_trades / portfolio.total_trades) * 100).toFixed(1)
    : '0.0';

  const activeAuctionsCount = auctions.filter(a => a.status === 'active').length;

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Capital Alpha</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-70">Empire Dashboard</p>
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
          subValue={`Tier ${portfolio.payback_status + 1}`}
        />
      </div>

      {activeAuctionsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent text-accent-foreground p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg shadow-accent/20"
        >
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Gavel size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Active Auctions</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{activeAuctionsCount} Businesses Bidding</p>
              </div>
           </div>
           <button className="bg-accent-foreground text-accent px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
              View Market
           </button>
        </motion.div>
      )}

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Trophy size={16} className="text-accent" />
              Empire Milestones
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 1, text: "The First Trade", progress: portfolio.total_trades > 0 ? 100 : 0 },
              { id: 2, text: "Million Dollar Line", progress: Math.min(100, (portfolio.payback_status / 10) * 100) },
              { id: 3, text: "Industrial Tycoon", progress: 0 },
            ].map(challenge => (
              <div key={challenge.id} className="bg-card border border-muted p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{challenge.text}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{challenge.progress}%</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${challenge.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest">Global Order Flow</h3>
            <button className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">History</button>
          </div>
          {trades.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-8 rounded-xl text-center">
              <p className="text-muted-foreground text-xs italic">No activity yet. The market is waiting for your move.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trades.slice(0, 5).map(trade => (
                <div key={trade.id} className="bg-card border border-muted p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${trade.type === 'buy' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                      {trade.type === 'buy' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">{trade.symbol}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{trade.trader_id ? 'NPC TRADE' : 'USER TRADE'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold">${trade.total_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className={`text-[10px] font-mono font-bold ${trade.type === 'buy' ? 'text-primary' : 'text-red-500'}`}>
                      {trade.type === 'buy' ? '+' : '-'}{trade.quantity.toFixed(4)}
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
