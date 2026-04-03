import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getStockPrice } from '../lib/marketEngine';
import { TrendingUp, TrendingDown, Search, Filter, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const stocks = [
  { id: 'tech_giant', name: 'AlphaTech Corp', symbol: 'ATEC', sector: 'Technology', dividend: 1.2 },
  { id: 'energy_corp', name: 'Global Energy', symbol: 'GLEN', sector: 'Energy', dividend: 4.5 },
  { id: 'fin_bank', name: 'Mogul Bank', symbol: 'MBNK', sector: 'Finance', dividend: 3.2 },
  { id: 'health_care', name: 'BioCure Pharma', symbol: 'BCUR', sector: 'Healthcare', dividend: 2.1 },
  { id: 'consumer_goods', name: 'Prime Retail', symbol: 'PRET', sector: 'Consumer', dividend: 1.8 },
  { id: 'ind_logistics', name: 'Alpha Logistics', symbol: 'ALOG', sector: 'Industrial', dividend: 2.5 },
];

const StockMarket: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const sectors = ['All', ...new Set(stocks.map(s => s.sector))];

  const filteredStocks = stocks.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.symbol.toLowerCase().includes(search.toLowerCase())) &&
    (sectorFilter === 'All' || s.sector === sectorFilter)
  );

  const ptc500Value = stocks.reduce((acc, s) => acc + getStockPrice(s.id, Date.now()), 0) / stocks.length;

  // Dummy chart data for PTC-500
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    val: ptc500Value + (Math.sin(i * 0.5) * 10)
  }));

  return (
    <div className="pb-12">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Stock Market</h1>

      <div className="bg-card border border-muted p-6 rounded-3xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <BarChart3 size={14} className="text-primary" /> PTC-500 Index
            </h3>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">${ptc500Value.toFixed(2)}</p>
              <p className="text-[10px] font-mono font-bold text-primary">+1.45% (Today)</p>
            </div>
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ptcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#ptcGradient)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {stocks.slice(0, 3).map(s => {
          const price = getStockPrice(s.id, Date.now());
          const isUp = Math.random() > 0.4;
          return (
            <div key={s.id} className="flex-shrink-0 w-32 bg-card border border-muted p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">{s.symbol}</p>
              <p className="text-sm font-mono font-bold mb-1">${price.toFixed(2)}</p>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${isUp ? 'text-primary' : 'text-red-500'}`}>
                {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {isUp ? '+' : ''}{(Math.random() * 5).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-muted rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="bg-card border border-muted rounded-xl px-4 flex items-center justify-center text-muted-foreground">
            <Filter size={16} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {sectors.map(s => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                sectorFilter === s ? 'bg-primary text-white' : 'bg-card border border-muted text-muted-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-card border border-muted rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-muted">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Asset</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/50">
              {filteredStocks.map(s => (
                <tr key={s.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-5">
                    <Link to={`/stock/${s.id}`}>
                      <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest mt-0.5">{s.symbol}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-xs font-mono font-bold">${getStockPrice(s.id, Date.now()).toFixed(2)}</p>
                    <p className="text-[9px] text-primary font-bold mt-0.5">+0.82%</p>
                  </td>
                  <td className="px-5 py-5 text-right">
                    <p className="text-xs font-mono font-bold text-accent">{s.dividend}%</p>
                    <p className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">{s.sector}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockMarket;
