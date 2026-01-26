import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mic, Users, PieChart, Home } from 'lucide-react';
import VoiceBilling from './pages/VoiceBilling';
import Udhaar from './pages/Udhaar';
import PaperToDigital from './pages/PaperToDigital';
import Summary from './pages/Summary';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/landing';

  if (isLanding) return <>{children}</>;

  return (
    <div className="min-h-screen bg-shop-bg text-slate-100 overflow-x-hidden relative">
      <header className="glass-nav p-5 sticky top-0 z-50 border-b border-white/5 shadow-2xl">
        <div className="max-w-md mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <span className="text-emerald-500 font-black text-xl">V</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">Vyapari</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">व्यापारी</p>
            </div>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">
            Billu AI Active
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto relative px-0 pb-36">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-shop-surface/95 backdrop-blur-3xl border-t border-white/5 px-6 pt-3 pb-8">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavLink to="/" icon={<Home size={22} />} label="Home" hindi="घर" active={location.pathname === '/'} />
          <NavLink to="/billing" icon={<Mic size={22} />} label="Bill" hindi="बिल" active={location.pathname === '/billing'} />
          <NavLink to="/udhaar" icon={<Users size={22} />} label="Credit" hindi="उधार" active={location.pathname === '/udhaar'} />
          <NavLink to="/summary" icon={<PieChart size={22} />} label="Report" hindi="हिसाब" active={location.pathname === '/summary'} />
        </div>
      </nav>
    </div>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string, hindi: string, active: boolean }> = ({ to, icon, label, hindi, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/40 scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-tighter mt-1 leading-none">{label}</span>
    <span className={`text-[10px] font-bold opacity-80 leading-none mt-0.5 ${active ? 'text-slate-900' : 'text-slate-600'}`}>{hindi}</span>
  </Link>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<VoiceBilling />} />
          <Route path="/udhaar" element={<Udhaar />} />
          <Route path="/paper" element={<PaperToDigital />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
