import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getStockPrice } from '../lib/marketEngine';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, LayoutGrid, Info, ShieldCheck, PieChart, Landmark, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const stocks = {
  tech_giant: { name: 'AlphaTech Corp', symbol: 'ATEC', sector: 'Technology', dividend: 1.2, lesson: 'Tech companies focus on growth and innovation. They reinvest most of their profits into R&D.' },
  energy_corp: { name: 'Global Energy', symbol: 'GLEN', sector: 'Energy', dividend: 4.5, lesson: 'Energy stocks are often cyclical. They pay higher dividends as they are mature, cash-generating businesses.' },
  fin_bank: { name: 'Mogul Bank', symbol: 'MBNK', sector: 'Finance', dividend: 3.2, lesson: 'Financial institutions earn from interest rate spreads and fees. They are the backbone of the global economy.' },
  health_care: { name: 'BioCure Pharma', symbol: 'BCUR', sector: 'Healthcare', dividend: 2.1, lesson: 'Healthcare stocks can be defensive, as demand for medical services remains steady regardless of economic conditions.' },
  consumer_goods: { name: 'Prime Retail', symbol: 'PRET', sector: 'Consumer', dividend: 1.8, lesson: 'Consumer goods companies depend on household spending and brand loyalty.' },
  ind_logistics: { name: 'Alpha Logistics', symbol: 'ALOG', sector: 'Industrial', dividend: 2.5, lesson: 'Logistics and industrial companies drive the physical movement of goods and infrastructure.' },
};

const StockDetail: React.FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const { portfolio, stock_holdings, addTrade, updateStockHolding, subtractCash, addCash } = useGameStore();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);

  const stock = stocks[stockId as keyof typeof stocks] || { name: 'Unknown', symbol: 'UNK', sector: 'Unknown', dividend: 0, lesson: '' };
  const currentPrice = getStockPrice(stockId || '', Date.now());
  const holding = stock_holdings.find(h => h.asset_id === stockId);

  useEffect(() => {
    const data = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      data.push({
        time: `${i}h`,
        price: getStockPrice(stockId || '', now - i * 3600 * 1000)
      });
    }
    setChartData(data);
  }, [stockId]);

  const handleTrade = () => {
    const q = parseInt(quantity);
    if (isNaN(q) || q <= 0) return;

    const totalValue = q * currentPrice;

    if (tradeType === 'buy') {
      if (totalValue > portfolio.cash_balance) return;

      const newQty = (holding?.quantity || 0) + q;
      const newAvg = ((holding?.avg_buy_price || 0) * (holding?.quantity || 0) + totalValue) / newQty;

      subtractCash(totalValue);
      updateStockHolding({
        asset_id: stockId!,
        symbol: stock.symbol,
        quantity: newQty,
        avg_buy_price: newAvg,
        total_dividends_received: holding?.total_dividends_received || 0,
        last_dividend_date: holding?.last_dividend_date || null
      });
      addTrade({
        id: Math.random().toString(36).substr(2, 9),
        asset_id: stockId!,
        symbol: stock.symbol,
        type: 'buy',
        asset_type: 'stock',
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
      updateStockHolding({
        asset_id: stockId!,
        symbol: stock.symbol,
        quantity: newQty,
        avg_buy_price: holding.avg_buy_price,
        total_dividends_received: holding.total_dividends_received,
        last_dividend_date: holding.last_dividend_date
      });
      addTrade({
        id: Math.random().toString(36).substr(2, 9),
        asset_id: stockId!,
        symbol: stock.symbol,
        type: 'sell',
        asset_type: 'stock',
        quantity: q,
        price: currentPrice,
        total_value: totalValue,
        pnl,
        timestamp: Date.now()
      });
    }
    setQuantity('');
  };

  return (
    <div className="pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-6">
        <ArrowLeft size={16} /> Stock List
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{stock.name}</h1>
          <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest">{stock.symbol} • {stock.sector}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold tracking-tight">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center justify-end gap-1 text-primary">
            <TrendingUp size={14} />
            <span className="text-[10px] font-mono font-bold">+1.24%</span>
          </div>
        </div>
      </div>

      <div className="h-64 mb-8 -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${stockId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0}/>
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
              stroke="hsl(142 71% 45%)"
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${stockId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card border border-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-[8px] uppercase tracking-widest font-bold mb-2">
            <PieChart size={10} /> Yield
          </div>
          <p className="text-xs font-mono font-bold text-accent">{stock.dividend}%</p>
        </div>
        <div className="bg-card border border-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-[8px] uppercase tracking-widest font-bold mb-2">
            <Landmark size={10} /> Sector
          </div>
          <p className="text-[10px] font-bold uppercase truncate">{stock.sector}</p>
        </div>
        <div className="bg-card border border-muted p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-[8px] uppercase tracking-widest font-bold mb-2">
            <Briefcase size={10} /> Shares
          </div>
          <p className="text-xs font-mono font-bold">{holding?.quantity || 0}</p>
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
              placeholder="0"
              className="w-full bg-background border border-muted rounded-2xl py-5 pl-6 pr-16 text-xl font-mono font-bold focus:outline-none focus:border-primary/50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm tracking-widest">SHARES</span>
          </div>
          <div className="flex gap-2">
            {[0.25, 0.5, 0.75, 1].map(p => (
              <button
                key={p}
                onClick={() => {
                  if (tradeType === 'buy') {
                    setQuantity(Math.floor(portfolio.cash_balance * p / currentPrice).toString());
                  } else {
                    setQuantity(Math.floor((holding?.quantity || 0) * p).toString());
                  }
                }}
                className="flex-1 py-2 bg-muted/50 border border-muted rounded-xl text-[10px] font-bold tracking-widest hover:bg-muted transition-colors"
              >
                {p * 100}%
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-medium mb-8 px-2">
          <span className="text-muted-foreground uppercase tracking-widest">Total Value</span>
          <span className="font-mono font-bold">${((parseInt(quantity) || 0) * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <button
          onClick={handleTrade}
          className={`w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform ${
            tradeType === 'buy' ? 'bg-primary text-white' : 'bg-red-500 text-white'
          }`}
        >
          Execute {tradeType === 'buy' ? 'Buy' : 'Sell'} Order
        </button>
      </div>

      <div className="bg-card border border-muted p-6 rounded-3xl">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-4">
          <Info size={14} /> Market Insight
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{stock.lesson}</p>
      </div>
    </div>
  );
};

export default StockDetail;
