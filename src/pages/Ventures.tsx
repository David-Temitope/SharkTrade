import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Building2, Plus, Info, Zap, Users, ShieldCheck, DollarSign, ArrowUpRight, TrendingUp, Handshake, Gavel, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const businessTemplates = [
  { id: 'food_truck', name: 'Gourmet Food Truck', category: 'Food & Beverage', emoji: '🚚', investment: 15000, revenue: 4500, expenses: 2800, type: 'business' },
  { id: 'cleaning_co', name: 'Elite Cleaners', category: 'Services', emoji: '🧹', investment: 8000, revenue: 3200, expenses: 1400, type: 'business' },
  { id: 'car_wash', name: 'Alpha Auto Spa', category: 'Automotive', emoji: '🧽', investment: 25000, revenue: 7500, expenses: 4000, type: 'business' },
  { id: 'tech_saas', name: 'CloudScale SaaS', category: 'Tech', emoji: '💻', investment: 50000, revenue: 12000, expenses: 5000, type: 'business' },
  { id: 'stixx_corp', name: 'Stixx Manufacturing', category: 'Industrial', emoji: '🥢', investment: 450000, revenue: 85000, expenses: 35000, type: 'company' },
  { id: 'alpha_logistics', name: 'Alpha Logistics', category: 'Industrial', emoji: '📦', investment: 600000, revenue: 110000, expenses: 50000, type: 'company' },
];

const Ventures: React.FC = () => {
  const { ventures, npcs, staff, auctions, portfolio, addVenture, subtractCash, updateVenture, addAuction, updateAuction, hireStaff } = useGameStore();
  const [activeTab, setActiveTab] = useState<'active' | 'browse' | 'auctions' | 'staff'>('active');
  const [selectedVenture, setSelectedVenture] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');

  const activeAuctions = auctions.filter(a => a.status === 'active');
  const userVentures = ventures.filter(v => v.ceo_id === 'user');

  const handleBid = (auctionId: string) => {
    const bid = parseFloat(bidAmount);
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction || isNaN(bid) || bid <= auction.highest_bid * 1.05) return;
    if (portfolio.cash_balance < bid) return;

    updateAuction(auctionId, { highest_bid: bid, highest_bidder_id: 'user' });
    setBidAmount('');
  };

  const startAuction = (template: any) => {
    if (portfolio.cash_balance < template.investment * 0.1) return; // Need 10% to start auction

    const ventureId = Math.random().toString(36).substr(2, 9);
    addVenture({
      id: ventureId,
      business_id: template.id,
      name: template.name,
      category: template.category,
      emoji: template.emoji,
      invested_amount: 0,
      ownership_pct: 0,
      monthly_revenue: template.revenue,
      monthly_expenses: template.expenses,
      total_income_collected: 0,
      last_collection_date: Date.now(),
      loan_taken: 0,
      level: 1,
      status: 'active',
      type: template.type,
      ceo_id: null,
      staff_ids: [],
      shares_available: template.type === 'company' ? 40 : 0
    });

    addAuction({
      id: Math.random().toString(36).substr(2, 9),
      venture_id: ventureId,
      highest_bidder_id: null,
      highest_bid: template.investment * 1.1, // Minimum bid is 110% of value as per requirement
      end_time: Date.now() + 30 * 60 * 1000, // 30 minutes
      status: 'active'
    });
    setActiveTab('auctions');
  };

  const hireStaffMember = (staffId: string, ventureId: string) => {
    const s = staff.find(st => st.id === staffId);
    if (!s) return;
    const pay = s.base_pay * 1.1; // Default 10% premium
    if (portfolio.cash_balance < pay) return;

    hireStaff(staffId, ventureId, pay);
  };

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Empire</h1>
        <div className="flex bg-card border border-muted p-1 rounded-xl overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            My Assets
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${activeTab === 'browse' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Establish
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${activeTab === 'auctions' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Auctions
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Talent
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <div className="space-y-4">
          {userVentures.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
              <Building2 className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
              <p className="text-muted-foreground text-sm font-medium italic">Your portfolio is empty. Bid on a business to start.</p>
            </div>
          ) : (
            userVentures.map(v => (
              <div key={v.id} className="bg-card border border-muted rounded-3xl p-6 shadow-xl relative group">
                <div className="flex items-center justify-between mb-4">
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
                    <p className="text-xs font-mono font-bold text-primary">+${(v.monthly_revenue / (30*24)).toLocaleString()}/hr</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{v.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/20 p-3 rounded-xl border border-muted">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Staff</p>
                    <p className="text-xs font-bold">{v.staff_ids.length} Employees</p>
                  </div>
                  <div className="bg-muted/20 p-3 rounded-xl border border-muted">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Equity</p>
                    <p className="text-xs font-bold">{v.ownership_pct}% Owned</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVenture(v)}
                  className="w-full bg-primary/10 text-primary py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/20"
                >
                  Manage Venture
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 gap-4">
          {businessTemplates.map(b => (
            <div key={b.id} className="bg-card border border-muted rounded-3xl p-6 shadow-lg group hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {b.emoji}
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest ${b.type === 'company' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                    {b.type}
                  </span>
                  <p className="text-xs text-muted-foreground font-bold mt-2 uppercase tracking-widest">{b.category}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 tracking-tight">{b.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Est. Value</p>
                  <p className="text-sm font-mono font-bold">${b.investment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Base Revenue</p>
                  <p className="text-sm font-mono font-bold text-primary">${b.revenue.toLocaleString()}/mo</p>
                </div>
              </div>
              <button
                onClick={() => startAuction(b)}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                Initiate Auction
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'auctions' && (
        <div className="space-y-4">
          {activeAuctions.length === 0 ? (
            <div className="bg-card border border-dashed border-muted p-12 rounded-3xl text-center">
              <Gavel className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
              <p className="text-muted-foreground text-sm font-medium italic">No active auctions. Start one in Browse.</p>
            </div>
          ) : (
            activeAuctions.map(a => {
              const v = ventures.find(ven => ven.id === a.venture_id);
              if (!v) return null;
              const timeLeft = Math.max(0, Math.floor((a.end_time - Date.now()) / 1000 / 60));
              const highBidder = a.highest_bidder_id === 'user' ? 'YOU' : (npcs.find(n => n.id === a.highest_bidder_id)?.name || 'Starting Bid');

              return (
                <div key={a.id} className="bg-card border border-muted rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center text-2xl">
                        {v.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight">{v.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ending in {timeLeft}m</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-accent">${a.highest_bid.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">High Bid: {highBidder}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min bid +5%"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      className="flex-1 bg-background border border-muted rounded-xl px-4 text-xs font-mono font-bold focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleBid(a.id)}
                      className="bg-accent text-accent-foreground px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-4">
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} /> Talent Pool
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Highly skilled staff increase company value and revenue.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {staff.filter(s => s.employer_id === null).slice(0, 10).map(s => (
              <div key={s.id} className="bg-card border border-muted rounded-3xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">{s.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{s.role} • Skill {s.skill_level}</p>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <p className="text-xs font-mono font-bold text-primary">${s.base_pay}/hr</p>
                  <select
                    onChange={(e) => hireStaffMember(s.id, e.target.value)}
                    className="bg-muted text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border-none outline-none"
                    value=""
                  >
                    <option value="" disabled>Hire to...</option>
                    {userVentures.map(uv => (
                      <option key={uv.id} value={uv.id}>{uv.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Venture Detail Modal */}
      <AnimatePresence>
        {selectedVenture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center p-4"
            onClick={() => setSelectedVenture(null)}
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
                  {selectedVenture.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedVenture.name}</h2>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{selectedVenture.category}</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                 <div className="flex justify-between items-center border-b border-muted pb-4">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Active Staff</span>
                    <span className="text-sm font-bold">{selectedVenture.staff_ids.length} Employees</span>
                 </div>
                 <div className="max-h-40 overflow-y-auto space-y-2">
                    {staff.filter(s => selectedVenture.staff_ids.includes(s.id)).map(s => (
                       <div key={s.id} className="bg-muted/20 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-[10px] font-bold">{s.name} ({s.role})</span>
                          <span className="text-[10px] font-mono text-primary">${s.current_pay}/hr</span>
                       </div>
                    ))}
                 </div>
              </div>

              <button
                onClick={() => setSelectedVenture(null)}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest"
              >
                Close Management
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ventures;
