import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, TrendingUp, BarChart3, Building2, Briefcase, Landmark } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dash' },
    { to: '/learn', icon: GraduationCap, label: 'Learn' },
    { to: '/trade', icon: TrendingUp, label: 'Trade' },
    { to: '/stock-market', icon: BarChart3, label: 'Stocks' },
    { to: '/ventures', icon: Building2, label: 'Ventures' },
    { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { to: '/shark-bank', icon: Landmark, label: 'Bank' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-muted px-2 py-3 flex justify-between items-center safe-area-bottom">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background pb-20 overflow-y-auto">
      <main className="max-w-md mx-auto px-4 pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
