import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCryptoPrice, getStockPrice } from '../lib/marketEngine';
import { Briefcase, TrendingUp, TrendingDown, LayoutGrid, PieChart, Info, DollarSign, Wallet, ArrowRightLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio: React.FC = () => {
  const { portfolio, crypto_holdings, stock_holdings, trades, ventures } = useGameStore();
  const [activeTab, setActiveTab] = useState<'holdings' | 'history'>('holdings');

  const totalCryptoValue = crypto_holdings.reduce((acc, h) => acc + h.quantity * getCryptoPrice(h.asset_id, Date.now()), 0);
  const totalStockValue = stock_holdings.reduce((acc, h) => acc + h.quantity * getStockPrice(h.asset_id, Date.now()), 0);
  const totalVenturesValue = ventures.reduce((acc, v) => acc + v.invested_amount, 0);
  const totalAssets = totalCryptoValue + totalStockValue + totalVenturesValue + portfolio.cash_balance;

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <div className="flex bg-card border border-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'holdings' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Holdings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="bg-card border border-muted p-8 rounded-[40px] mb-8 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Total Net Worth</p>
          <div className="text-4xl font-black font-mono tracking-tight mb-4">${totalAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className={`flex justify-center gap-1 text-xs font-bold ${portfolio.total_pnl >= 0 ? 'text-primary' : 'text-red-500'}`}>
            {portfolio.total_pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            ${Math.abs(portfolio.total_pnl).toLocaleString()} Lifetime P&L
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      </div>

      {activeTab === 'holdings' ? (
        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Allocation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-muted p-4 rounded-2xl">
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Crypto Assets</p>
                <p className="text-sm font-mono font-bold">${totalCryptoValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <div className="h-1 bg-muted mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(totalCryptoValue / totalAssets) * 100}%` }} />
                </div>
              </div>
              <div className="bg-card border border-muted p-4 rounded-2xl">
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Stock Assets</p>
                <p className="text-sm font-mono font-bold">${totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <div className="h-1 bg-muted mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${(totalStockValue / totalAssets) * 100}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 px-2">Positions</h3>
            <div className="space-y-3">
              {[...crypto_holdings, ...stock_holdings].map(h => {
                const currentPrice = h.asset_id.includes('_') ? getStockPrice(h.asset_id, Date.now()) : getCryptoPrice(h.asset_id, Date.now());
                const pnl = (currentPrice - h.avg_buy_price) * h.quantity;
                const isPositive = pnl >= 0;

                return (
                  <div key={h.asset_id} className="bg-card border border-muted p-4 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center font-bold text-xs">
                        {h.symbol.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight uppercase">{h.symbol}</h4>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{h.quantity.toLocaleString()} Shares/Units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold">${(h.quantity * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      <p className={`text-[9px] font-mono font-bold ${isPositive ? 'text-primary' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {crypto_holdings.length + stock_holdings.length === 0 && (
                <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
                  <Briefcase className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                  <p className="text-muted-foreground text-xs font-medium italic">No assets held. Diversify your wealth.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-3">
          {trades.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
              <Clock className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
              <p className="text-muted-foreground text-xs font-medium italic">No transaction history found.</p>
            </div>
          ) : (
            trades.map(t => (
              <div key={t.id} className="bg-card border border-muted p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'buy' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                    <ArrowRightLeft size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight uppercase">{t.symbol}</h4>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                      {t.type} {t.quantity} @ ${t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold">${t.total_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(t.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
