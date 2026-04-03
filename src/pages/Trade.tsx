import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCryptoPrice } from '../lib/marketEngine';
import { TrendingUp, TrendingDown, Search, ArrowRightLeft, User, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const coins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', emoji: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', emoji: 'Ξ' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', emoji: '◎' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', emoji: '₳' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP', emoji: '✕' },
];

const npcs = [
  { name: 'Arthur Sterling', role: 'Institutional Whale', bio: 'Former Wall Street shark now dominating the crypto landscape with high-volume positions.', sentiment: 'Bullish' },
  { name: 'Isabella Montgomery', role: 'Venture Capitalist', bio: 'Strategic investor focused on long-term scalability and blockchain utility.', sentiment: 'Neutral' },
  { name: 'Marcus Thorne', role: 'Aggressive Day Trader', bio: 'High-leverage scalper known for exploiting micro-volatility.', sentiment: 'Bearish' },
  { name: 'Elena Vance', role: 'Quantitative Analyst', bio: 'Algorithm-driven trader who prioritizes risk-adjusted returns and data integrity.', sentiment: 'Bullish' },
  { name: 'Amanda Rose', role: 'Real Estate Mogul', bio: 'Specialist in distressed asset acquisition and rapid portfolio scaling.', sentiment: 'Bullish' },
];

const Trade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'npcs'>('market');
  const [search, setSearch] = useState('');

  const filteredCoins = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Trade Crypto</h1>
        <div className="flex bg-card border border-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'market' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('npcs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'npcs' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            NPC Activity
          </button>
        </div>
      </div>

      {activeTab === 'market' ? (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-muted rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-3">
            {filteredCoins.map(coin => {
              const price = getCryptoPrice(coin.id, Date.now());
              const change = (Math.sin(Date.now() / 100000 + coin.id.length) * 5).toFixed(2);
              const isPositive = parseFloat(change) >= 0;

              return (
                <Link
                  key={coin.id}
                  to={`/coin/${coin.id}`}
                  className="bg-card border border-muted p-4 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {coin.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-tight">{coin.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm leading-none">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isPositive ? 'text-primary' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      <span className="text-[10px] font-mono font-bold">{isPositive ? '+' : ''}{change}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-muted p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Market Sentiment Gauge</h3>
              <span className="text-primary text-xs font-bold">GREED: 72/100</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500" style={{ width: '15%' }} />
              <div className="h-full bg-accent" style={{ width: '25%' }} />
              <div className="h-full bg-primary" style={{ width: '60%' }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest px-2">Top Power Players</h3>
            {npcs.map((npc, idx) => (
              <div key={idx} className="bg-card border border-muted p-5 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-muted to-muted/20 rounded-full flex items-center justify-center border-2 border-muted">
                    <User className="text-muted-foreground" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-tight">{npc.name}</h4>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{npc.role}</p>
                  </div>
                  <div className={`ml-auto px-2 py-1 rounded-md text-[10px] font-bold ${npc.sentiment === 'Bullish' ? 'bg-primary/20 text-primary' : npc.sentiment === 'Bearish' ? 'bg-red-500/20 text-red-500' : 'bg-accent/20 text-accent'}`}>
                    {npc.sentiment}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4">{npc.bio}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted/30 p-2 rounded-xl">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Recent Activity</p>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft size={12} className={npc.sentiment === 'Bullish' ? 'text-primary' : 'text-red-500'} />
                      <span className="text-[10px] font-mono font-bold truncate">
                        {npc.sentiment === 'Bullish' ? 'BOUGHT' : 'SOLD'} {Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 9)} {coins[Math.floor(Math.random() * coins.length)].symbol}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-muted/30 p-2 rounded-xl">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Portfolio Tilt</p>
                    <div className="flex items-center gap-2">
                      <BarChart size={12} className="text-accent" />
                      <span className="text-[10px] font-mono font-bold">
                        {coins[Math.floor(Math.random() * coins.length)].symbol}: {Math.floor(Math.random() * 40) + 40}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;
