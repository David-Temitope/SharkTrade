import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getCryptoPrice, getPriceHistory } from '../lib/marketEngine';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, LayoutGrid, Info, ShieldCheck, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const coins = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', emoji: '₿', lesson: 'Bitcoin is the first decentralized digital currency. Its limited supply of 21 million makes it digital gold.' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', emoji: 'Ξ', lesson: 'Ethereum is a platform for smart contracts and decentralized apps. Its utility drives its value.' },
  solana: { name: 'Solana', symbol: 'SOL', emoji: '◎', lesson: 'Solana is known for its speed and low transaction fees, making it a high-performance blockchain.' },
  cardano: { name: 'Cardano', symbol: 'ADA', emoji: '₳', lesson: 'Cardano focuses on sustainability and academic research-driven development.' },
  ripple: { name: 'Ripple', symbol: 'XRP', emoji: '✕', lesson: 'Ripple enables fast, low-cost international payments for financial institutions.' },
};

const CoinDetail: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const { portfolio, crypto_holdings, trades, addTrade, updateHolding, subtractCash, addCash } = useGameStore();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<any[]>([]);

  const coin = coins[coinId as keyof typeof coins] || { name: 'Unknown', symbol: 'UNK', emoji: '?', lesson: '' };
  const currentPrice = getCryptoPrice(coinId || '', Date.now(), trades);
  const holding = crypto_holdings.find(h => h.asset_id === coinId);

  useEffect(() => {
    setChartData(getPriceHistory(coinId || '', 'crypto', timeframe, trades));
  }, [coinId, timeframe, trades]);

  const handleTrade = () => {
    const q = parseFloat(quantity);
    if (isNaN(q) || q <= 0) return;

    const totalValue = q * currentPrice;

    if (tradeType === 'buy') {
      if (totalValue > portfolio.cash_balance) return;

      const newQty = (holding?.quantity || 0) + q;
      const newAvg = ((holding?.avg_buy_price || 0) * (holding?.quantity || 0) + totalValue) / newQty;

      subtractCash(totalValue);
      updateHolding({ asset_id: coinId!, symbol: coin.symbol, quantity: newQty, avg_buy_price: newAvg });
      addTrade({
        id: Math.random().toString(36).substr(2, 9),
        asset_id: coinId!,
        symbol: coin.symbol,
        type: 'buy',
        asset_type: 'crypto',
        quantity: q,
        price: currentPrice,
        total_value: totalValue,
        pnl: 0,
        timestamp: Date.now()
      });
    } else {
      if (!holding || q > holding.quantity) return;

      const pnl = (currentPrice - holding.avg_buy_price) * q;
      const newQty = holding.quantity - q;

      addCash(totalValue);
      updateHolding({ asset_id: coinId!, symbol: coin.symbol, quantity: newQty, avg_buy_price: holding.avg_buy_price });
      addTrade({
        id: Math.random().toString(36).substr(2, 9),
        asset_id: coinId!,
        symbol: coin.symbol,
        type: 'sell',
        asset_type: 'crypto',
        quantity: q,
        price: currentPrice,
        total_value: totalValue,
        pnl,
        timestamp: Date.now()
      });
    }
    setQuantity('');
  };

  const setPct = (pct: number) => {
    if (tradeType === 'buy') {
      setQuantity((((portfolio.cash_balance * pct) / currentPrice)).toFixed(6));
    } else {
      setQuantity(((holding?.quantity || 0) * pct).toFixed(6));
    }
  };

  const firstPrice = chartData[0]?.price || currentPrice;
  const changePct = ((currentPrice - firstPrice) / firstPrice) * 100;

  return (
    <div className="pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-6">
        <ArrowLeft size={16} /> Back to Market
      </button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-card border border-muted rounded-2xl flex items-center justify-center text-3xl shadow-xl">
            {coin.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{coin.name}</h1>
            <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest">{coin.symbol} / USD</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold tracking-tight">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className={`flex items-center justify-end gap-1 ${changePct >= 0 ? 'text-primary' : 'text-red-500'}`}>
            {changePct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="text-[10px] font-mono font-bold">{changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all ${timeframe === tf ? 'bg-primary text-white' : 'bg-muted/30 text-muted-foreground'}`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="h-64 mb-8 -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={changePct >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={changePct >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 47% 15%)" />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(222 47% 10%)', border: '1px solid hsl(217.2 32.6% 17.5%)', borderRadius: '12px' }}
              labelStyle={{ display: 'none' }}
              itemStyle={{ color: 'white', fontWeight: 'bold', fontFamily: 'JetBrains Mono' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={changePct >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${coinId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-2">
            <LayoutGrid size={12} /> Market Cap
          </div>
          <p className="text-sm font-mono font-bold">${(currentPrice * 18000000 / 1e12).toFixed(1)}T</p>
        </div>
        <div className="bg-card border border-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-2">
            <PieChart size={12} /> Rank
          </div>
          <p className="text-sm font-mono font-bold">#1</p>
        </div>
      </div>

      <div className="bg-card border border-muted rounded-3xl p-6 shadow-2xl mb-8">
        <div className="flex bg-muted/30 p-1 rounded-xl mb-6">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${tradeType === 'buy' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            BUY
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'text-muted-foreground'}`}
          >
            SELL
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border border-muted rounded-2xl py-5 pl-6 pr-16 text-xl font-mono font-bold focus:outline-none focus:border-primary/50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm tracking-widest">{coin.symbol}</span>
          </div>
          <div className="flex gap-2">
            {[0.25, 0.5, 0.75, 1].map(p => (
              <button
                key={p}
                onClick={() => setPct(p)}
                className="flex-1 py-2 bg-muted/50 border border-muted rounded-xl text-[10px] font-bold tracking-widest hover:bg-muted transition-colors"
              >
                {p * 100}%
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-medium mb-8 px-2">
          <span className="text-muted-foreground uppercase tracking-widest">Total Value</span>
          <span className="font-mono font-bold">${((parseFloat(quantity) || 0) * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <button
          onClick={handleTrade}
          className={`w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform ${
            tradeType === 'buy' ? 'bg-primary text-white' : 'bg-red-500 text-white'
          }`}
        >
          Confirm {tradeType} Order
        </button>
      </div>

      {holding && holding.quantity > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-primary/20 p-6 rounded-3xl mb-8 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
              <ShieldCheck size={14} /> Your Alpha Position
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Holding</p>
                <p className="text-lg font-mono font-bold">{holding.quantity.toLocaleString()} {coin.symbol}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Avg Cost</p>
                <p className="text-lg font-mono font-bold">${holding.avg_buy_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Unrealized P&L</p>
                <p className={`text-lg font-mono font-bold ${(currentPrice - holding.avg_buy_price) >= 0 ? 'text-primary' : 'text-red-500'}`}>
                  ${((currentPrice - holding.avg_buy_price) * holding.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Market Value</p>
                <p className="text-lg font-mono font-bold">${(holding.quantity * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={120} />
          </div>
        </motion.div>
      )}

      <div className="bg-card border border-muted p-6 rounded-3xl">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-4">
          <Info size={14} /> Wealth Lesson
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{coin.lesson}</p>
      </div>
    </div>
  );
};

export default CoinDetail;
