import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Building2, Plus, Info, Zap, Users, ShieldCheck, DollarSign, ArrowUpRight, TrendingUp, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const businessTemplates = [
  { id: 'food_truck', name: 'Gourmet Food Truck', category: 'Food & Beverage', emoji: '🚚', investment: 15000, revenue: 4500, expenses: 2800, difficulty: 'Beginner' },
  { id: 'cleaning_co', name: 'Elite Cleaners', category: 'Services', emoji: '🧹', investment: 8000, revenue: 3200, expenses: 1400, difficulty: 'Beginner' },
  { id: 'car_wash', name: 'Alpha Auto Spa', category: 'Automotive', emoji: '🧽', investment: 25000, revenue: 7500, expenses: 4000, difficulty: 'Intermediate' },
  { id: 'tech_saas', name: 'CloudScale SaaS', category: 'Tech', emoji: '💻', investment: 50000, revenue: 12000, expenses: 5000, difficulty: 'Advanced' },
  { id: 'real_estate_flip', name: 'Suburban Fixer', category: 'Real Estate', emoji: '🏠', investment: 120000, revenue: 0, expenses: 1500, difficulty: 'Advanced', flipValue: 180000 },
];

const Ventures: React.FC = () => {
  const { ventures, portfolio, addVenture, subtractCash, updateVenture, addCash } = useGameStore();
  const [activeTab, setActiveTab] = useState<'browse' | 'active' | 'marketplace'>('active');
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const npcOwned = [
    { id: 'npc_1', name: 'Downtown Car Wash', owner: 'Amanda Rose', emoji: '🧽', price: 28000, category: 'Automotive', revenue: 7500, expenses: 4000 },
    { id: 'npc_2', name: 'Rose Café', owner: 'Arthur Sterling', emoji: '☕', price: 45000, category: 'Food & Beverage', revenue: 12000, expenses: 6500 },
  ];

  const handleMakeOffer = (npcBiz: any) => {
    const offer = parseFloat(offerPrice);
    if (isNaN(offer) || offer <= 0) return;

    if (offer < npcBiz.price * 0.9) {
      setNegotiationMessage(`${npcBiz.owner} says: "That's insulting. I'd rather sell it to the state for more."`);
    } else if (offer < npcBiz.price) {
      setNegotiationMessage(`${npcBiz.owner} says: "You're getting closer, but I need at least $${npcBiz.price.toLocaleString()} to even consider it."`);
    } else {
      if (portfolio.cash_balance < offer) {
        setNegotiationMessage(`${npcBiz.owner} says: "Deal! Oh wait, you don't even have the cash. Come back when you're serious."`);
        return;
      }
      subtractCash(offer);
      addVenture({
        id: Math.random().toString(36).substr(2, 9),
        business_id: npcBiz.id,
        name: npcBiz.name,
        category: npcBiz.category,
        emoji: npcBiz.emoji,
        invested_amount: offer,
        ownership_pct: 100,
        monthly_revenue: npcBiz.revenue,
        monthly_expenses: npcBiz.expenses,
        total_income_collected: 0,
        last_collection_date: Date.now(),
        loan_taken: 0,
        level: 1,
        status: 'active'
      });
      setSelectedBusiness(null);
      setNegotiationMessage('');
      setOfferPrice('');
      setActiveTab('active');
    }
  };

  const buyBusiness = (template: any) => {
    if (portfolio.cash_balance < template.investment) return;

    subtractCash(template.investment);
    addVenture({
      id: Math.random().toString(36).substr(2, 9),
      business_id: template.id,
      name: template.name,
      category: template.category,
      emoji: template.emoji,
      invested_amount: template.investment,
      ownership_pct: 100,
      monthly_revenue: template.revenue,
      monthly_expenses: template.expenses,
      total_income_collected: 0,
      last_collection_date: Date.now(),
      loan_taken: 0,
      level: 1,
      status: 'active'
    });
    setSelectedBusiness(null);
    setActiveTab('active');
  };

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Ventures</h1>
        <div className="flex bg-card border border-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            My Portfolio
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'browse' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'marketplace' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Market
          </button>
        </div>
      </div>

      {activeTab === 'marketplace' ? (
        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-6">
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Negotiation Zone
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">NPCs often snap up prime ventures. You'll have to negotiate to get them back.</p>
          </div>
          {npcOwned.map(npc => (
            <div key={npc.id} className="bg-card border border-muted rounded-3xl p-5 shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-2xl">
                  {npc.emoji}
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Current Owner</p>
                  <p className="text-xs font-bold text-accent">{npc.owner}</p>
                </div>
              </div>
              <h3 className="font-bold mb-4">{npc.name}</h3>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Valuation</p>
                  <p className="text-sm font-mono font-bold">${npc.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedBusiness({ ...npc, isNPC: true })}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Make Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'browse' ? (
        <div className="grid grid-cols-1 gap-4">
          {businessTemplates.map(b => (
            <div key={b.id} className="bg-card border border-muted rounded-3xl p-5 shadow-lg group hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {b.emoji}
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${
                    b.difficulty === 'Beginner' ? 'bg-primary/20 text-primary' :
                    b.difficulty === 'Intermediate' ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {b.difficulty}
                  </span>
                  <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-widest">{b.category}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 tracking-tight">{b.name}</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Investment</p>
                  <p className="text-sm font-mono font-bold">${b.investment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Net/Month</p>
                  <p className="text-sm font-mono font-bold text-primary">${(b.revenue - b.expenses).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">ROI/Year</p>
                  <p className="text-sm font-mono font-bold text-accent">{(((b.revenue - b.expenses) * 12 / b.investment) * 100).toFixed(0)}%</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBusiness(b)}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                View Opportunity
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {ventures.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
              <Building2 className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
              <p className="text-muted-foreground text-sm font-medium italic">You don't own any ventures yet. Browse the market to start your empire.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-6 text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
              >
                Go to Browse <Plus size={16} />
              </button>
            </div>
          ) : (
            ventures.map(v => (
              <div key={v.id} className="bg-card border border-muted rounded-3xl p-6 shadow-xl overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-2xl">
                      {v.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">{v.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{v.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-primary">+${(v.monthly_revenue - v.monthly_expenses).toLocaleString()}/mo</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Level {v.level}</p>
                  </div>
                </div>

                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="bg-muted/30 p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-transparent hover:border-primary/20">
                    <Zap size={16} className="text-primary" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Upgrade</span>
                  </button>
                  <button className="bg-muted/30 p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-transparent hover:border-accent/20">
                    <Users size={16} className="text-accent" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Hire Staff</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-muted/20 -mx-6 -mb-6 px-6 py-4">
                  <div>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Earned</p>
                    <p className="text-xs font-mono font-bold">${v.total_income_collected.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    View Financials
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Business Detail Modal (Simple Overlay) */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center p-4"
            onClick={() => setSelectedBusiness(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-card w-full max-w-md rounded-t-[40px] p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-1.5 bg-muted rounded-full mx-auto mb-8" />

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center text-5xl">
                  {selectedBusiness.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedBusiness.name}</h2>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{selectedBusiness.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/20 p-4 rounded-2xl border border-muted">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Monthly Revenue</p>
                  <p className="text-xl font-mono font-bold">${selectedBusiness.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-2xl border border-muted">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Monthly Expenses</p>
                  <p className="text-xl font-mono font-bold text-red-500">${selectedBusiness.expenses.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {selectedBusiness.isNPC && (
                  <div className="bg-muted/30 p-4 rounded-2xl border border-muted mb-4">
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Handshake size={14} /> Negotiating with {selectedBusiness.owner}
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Enter your offer price..."
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        className="w-full bg-background border border-muted rounded-xl py-3 px-4 text-sm font-mono font-bold focus:outline-none focus:border-accent"
                      />
                    </div>
                    {negotiationMessage && (
                      <p className="text-[10px] text-red-400 mt-2 italic">{negotiationMessage}</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Monthly Net Profit</span>
                  <span className="font-bold text-primary">${(selectedBusiness.revenue - selectedBusiness.expenses).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-muted pt-4 mt-4">
                  <span className="text-foreground font-bold text-lg">{selectedBusiness.isNPC ? 'Market Price' : 'Total Cost'}</span>
                  <span className="font-mono font-bold text-xl">${(selectedBusiness.isNPC ? selectedBusiness.price : selectedBusiness.investment).toLocaleString()}</span>
                </div>
              </div>

              {selectedBusiness.isNPC ? (
                <button
                  onClick={() => handleMakeOffer(selectedBusiness)}
                  className="w-full bg-accent text-accent-foreground py-5 rounded-3xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-accent/20"
                >
                  Confirm Offer
                </button>
              ) : (
                <button
                  onClick={() => buyBusiness(selectedBusiness)}
                  disabled={portfolio.cash_balance < selectedBusiness.investment}
                  className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:bg-muted"
                >
                  {portfolio.cash_balance < selectedBusiness.investment ? 'Insufficient Funds' : 'Acquire Venture'}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ventures;
