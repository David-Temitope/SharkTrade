import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/Layout';
import { useSimulation } from './hooks/useSimulation';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Trade from './pages/Trade';
import CoinDetail from './pages/CoinDetail';
import StockMarket from './pages/StockMarket';
import StockDetail from './pages/StockDetail';
import Ventures from './pages/Ventures';
import Portfolio from './pages/Portfolio';
import SharkBank from './pages/SharkBank';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useSimulation();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/coin/:coinId" element={<CoinDetail />} />
            <Route path="/stock-market" element={<StockMarket />} />
            <Route path="/stock/:stockId" element={<StockDetail />} />
            <Route path="/ventures" element={<Ventures />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/shark-bank" element={<SharkBank />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
