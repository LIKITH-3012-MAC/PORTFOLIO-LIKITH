import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  LayoutDashboard, 
  Radio, 
  Briefcase, 
  Activity, 
  Power, 
  RefreshCw, 
  TrendingUp, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Search, 
  Box, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Database
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { request } from '../services/api';

export const DataConsolePage = () => {
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data list states
  const [dataList, setDataList] = useState([]);
  const [stats, setStats] = useState({ uniqueVisitors: 0 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [avgLatency, setAvgLatency] = useState(0);
  
  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20;

  // Selected Inspect Item
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial authentication state
  useEffect(() => {
    const storedToken = sessionStorage.getItem('admin_token');
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch stats and tab data when authenticated or active tab / page changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchData();
    }
  }, [isAuthenticated, activeTab, currentPage]);

  const handleAuthenticate = async (e) => {
    if (e) e.preventDefault();
    if (!authToken.trim()) return;

    setAuthError('');
    setIsLoading(true);

    try {
      // Test the token against visitor-stats endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://portfolio-likith.onrender.com'}/api/admin/visitor-stats`, {
        headers: { 'X-Admin-Token': authToken }
      });

      if (response.status === 200) {
        const json = await response.json();
        if (json.success) {
          sessionStorage.setItem('admin_token', authToken);
          setIsAuthenticated(true);
        } else {
          setAuthError('Authorization protocol rejected: Invalid Secret Signature.');
        }
      } else {
        setAuthError('Access denied: Authentication failure.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection failure: Access grid offline.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setAuthToken('');
    setDataList([]);
    setStats({ uniqueVisitors: 0 });
  };

  const fetchStats = async () => {
    try {
      const response = await request('/api/admin/visitor-stats');
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const json = await response.json();
      if (json.success && json.stats) {
        setStats({
          uniqueVisitors: json.stats.unique_visitors || 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    let endpoint = '';
    if (activeTab === 'overview' || activeTab === 'signals') endpoint = '/api/admin/responses';
    else if (activeTab === 'collabs') endpoint = '/api/admin/collabs';
    else if (activeTab === 'visitors') endpoint = '/api/admin/visitors';

    try {
      const response = await request(`${endpoint}?limit=${limit}&offset=${currentPage * limit}`);
      
      if (response.status === 401) {
        handleLogout();
        return;
      }

      const json = await response.json();
      const fetchedData = json.data || [];
      setDataList(fetchedData);
      setTotalRecords(json.pagination?.total || 0);

      // Calc average latency for Signals Feed
      if (activeTab === 'overview' || activeTab === 'signals') {
        const avg = fetchedData.length 
          ? Math.round(fetchedData.reduce((acc, curr) => acc + (curr.latency || 0), 0) / fetchedData.length) 
          : 0;
        setAvgLatency(avg);
      }
    } catch (err) {
      console.error('Failed to fetch grid data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
    fetchData();
  };

  const handlePageChange = (delta) => {
    setCurrentPage(prev => Math.max(0, prev + delta));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
    setSearchTerm('');
  };

  // Local filtering based on SearchTerm
  const filteredData = dataList.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    if (activeTab === 'overview' || activeTab === 'signals') {
      return (
        item.message?.toLowerCase().includes(term) || 
        item.response?.toLowerCase().includes(term) ||
        item.intent?.toLowerCase().includes(term)
      );
    } else if (activeTab === 'collabs') {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.type?.toLowerCase().includes(term) ||
        item.purpose?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term)
      );
    } else if (activeTab === 'visitors') {
      return (
        item.path?.toLowerCase().includes(term) ||
        item.os?.toLowerCase().includes(term) ||
        item.browser?.toLowerCase().includes(term) ||
        item.device?.toLowerCase().includes(term) ||
        item.referrer?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Header Titles based on tab
  const tabConfigs = {
    overview: { main: "Command Center", sub: "Operational Matrix Overview" },
    signals: { main: "AI Neural Feed", sub: "Deep Stream Signal Intelligence" },
    collabs: { main: "Strategic Intake", sub: "Partnership Protocol Ingest" },
    visitors: { main: "Global Traffic", sub: "Node Distribution Analysis" }
  };

  return (
    <>
      <SEO 
        title="Operations Control Console | Likith OS"
        description="Secure admin command suite for monitoring artificial intelligence sessions and collaboration workflows."
        meta={[{ name: "robots", content: "noindex, nofollow" }]}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-console: #03040a;
          --panel-console: rgba(10, 11, 20, 0.7);
          --panel-border-console: rgba(255, 255, 255, 0.06);
          --accent-console: #fbbf24;
          --accent-glow-console: rgba(251, 191, 36, 0.15);
          --glass-highlight-console: rgba(255, 255, 255, 0.03);
        }

        .console-theme {
          background-color: rgba(3, 4, 10, 0.45);
          backdrop-filter: blur(24px) saturate(1.2);
          -webkit-backdrop-filter: blur(24px) saturate(1.2);
          background-image: 
            radial-gradient(circle at 50% -20%, rgba(251, 191, 36, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(30, 41, 59, 0.2) 0%, transparent 30%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.598 5h-5.196L30 0zm0 60l-2.598-5h5.196L30 60zM0 30l5 2.598v-5.196L0 30zm60 0l-5-2.598v5.196L60 30z' fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        .panel-glass {
          background: var(--panel-console);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid var(--panel-border-console);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }

        .panel-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--glass-highlight-console) 0%, transparent 100%);
          pointer-events: none;
        }

        .panel-border-glow {
          box-shadow: 0 0 1px 1px rgba(251, 191, 36, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .hud-card {
          border-left: 3px solid transparent;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hud-card:hover {
          border-left-color: var(--accent-console);
          background: rgba(255, 255, 255, 0.02);
          transform: translateX(4px);
        }

        .title-gradient {
          background: linear-gradient(to right, #fff 20%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-value {
          text-shadow: 0 0 20px var(--accent-glow-console);
        }

        .btn-action {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .btn-action:hover {
          background: var(--accent-console);
          color: #000;
          border-color: var(--accent-console);
          box-shadow: 0 0 15px var(--accent-glow-console);
        }

        .sidebar-link {
          position: relative;
          transition: all 0.3s ease;
        }
        .sidebar-link.active {
          color: var(--accent-console);
        }
        .sidebar-link.active::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 2px;
          background: var(--accent-console);
          box-shadow: 0 0 10px var(--accent-console);
        }

        .intel-table thead th {
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #64748b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .intel-table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }
        .intel-table tbody tr:hover {
          background: rgba(251, 191, 36, 0.02);
        }

        .badge-intel {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 51%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 100;
          opacity: 0.1;
        }

        .input-premium {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .input-premium:focus {
          border-color: var(--accent-console);
          background: rgba(251, 191, 36, 0.03);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.05);
        }
      `}} />

      <div className="console-theme min-h-screen text-slate-200">
        <div className="scanline" />

        {/* Auth Protocol Overlay */}
        {!isAuthenticated && (
          <div id="auth-overlay" className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <div className="panel-glass panel-border-glow p-12 rounded-[2rem] w-full max-w-md text-center relative overflow-hidden">
              <div className="w-16 h-16 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse rounded-full" />
                <div className="relative w-full h-full border border-amber-500/40 rounded-2xl flex items-center justify-center bg-black/40">
                  <Fingerprint className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold title-gradient mb-2">Likith OS</h2>
              <p className="text-xs font-mono text-slate-500 mb-10 tracking-[0.3em] uppercase">Security Protocol Alpha-9</p>
              
              <form onSubmit={handleAuthenticate} className="space-y-6">
                <div className="relative group">
                  <input 
                    type="password" 
                    value={authToken} 
                    onChange={(e) => setAuthToken(e.target.value)}
                    placeholder="Authorization Secret" 
                    className="w-full input-premium rounded-xl px-4 py-4 text-white focus:outline-none text-center font-mono placeholder:text-slate-700 text-sm"
                  />
                </div>
                
                {authError && (
                  <p className="text-xs text-red-500 font-mono text-center mb-4">{authError}</p>
                )}
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-amber-500/20 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Unlock Console'}
                </button>
              </form>
              
              <div className="mt-8 flex justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
              </div>
            </div>
          </div>
        )}

        {/* Interface Matrix */}
        {isAuthenticated && (
          <div id="main-interface" className="flex min-h-screen">
            
            {/* Tactical Sidebar */}
            <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col py-10 sticky top-0 h-screen bg-black/40 backdrop-blur-3xl z-50">
              <div className="px-8 mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-lg">L</div>
                  <div className="hidden lg:block">
                    <h1 className="font-bold text-sm tracking-tight text-white uppercase">Likith Intelligence</h1>
                    <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-0.5">OPS COMMAND V3.0</p>
                  </div>
                </div>
              </div>

              <nav className="flex-grow space-y-1 px-4 text-left">
                <div className="px-4 mb-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden lg:block">Core Interface</div>
                <button 
                  onClick={() => switchTab('overview')} 
                  className={`sidebar-link w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-white group rounded-xl ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  <LayoutDashboard className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden lg:block font-semibold text-xs tracking-wide">Command Center</span>
                </button>
                <button 
                  onClick={() => switchTab('signals')} 
                  className={`sidebar-link w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-white group rounded-xl ${activeTab === 'signals' ? 'active' : ''}`}
                >
                  <Radio className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden lg:block font-semibold text-xs tracking-wide">AI Neural Feed</span>
                </button>
                <button 
                  onClick={() => switchTab('collabs')} 
                  className={`sidebar-link w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-white group rounded-xl ${activeTab === 'collabs' ? 'active' : ''}`}
                >
                  <Briefcase className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden lg:block font-semibold text-xs tracking-wide">Strategic Intake</span>
                </button>
                <button 
                  onClick={() => switchTab('visitors')} 
                  className={`sidebar-link w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-white group rounded-xl ${activeTab === 'visitors' ? 'active' : ''}`}
                >
                  <Activity className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden lg:block font-semibold text-xs tracking-wide">Global Traffic</span>
                </button>
              </nav>

              <div className="px-6 pt-6 border-t border-white/5">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-red-400 transition-all group rounded-xl"
                >
                  <Power className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  <span className="hidden lg:block font-semibold text-xs tracking-wide">Terminate Session</span>
                </button>
              </div>
            </aside>

            {/* Command Environment */}
            <main className="flex-1 p-8 lg:p-14 overflow-y-auto relative text-left">
              
              {/* Dynamic HUD Header */}
              <header className="flex flex-wrap items-end justify-between gap-8 mb-16">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-[1px] w-8 bg-amber-500/40" />
                    <span id="page-subtitle" className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.4em]">
                      {tabConfigs[activeTab]?.sub}
                    </span>
                  </div>
                  <h2 id="page-title" className="text-5xl font-bold title-gradient tracking-tighter">
                    {tabConfigs[activeTab]?.main}
                  </h2>
                </div>
                
                <div className="flex items-center gap-4 panel-glass px-6 py-3 rounded-2xl border-white/5 relative overflow-hidden">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">System Pulse</span>
                    <span className="text-[11px] font-bold text-green-400 uppercase tracking-tighter">Sync: Nominal</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 mx-2" />
                  <button 
                    onClick={handleRefresh} 
                    className="p-2 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-amber-500"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
                  </button>
                </div>
              </header>

              {/* Metrics Matrix (Command Center only) */}
              {activeTab === 'overview' && (
                <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                  <div className="panel-glass hud-card p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Total Signals</p>
                    <div className="flex items-baseline gap-2">
                      <span id="stat-signals" className="text-4xl font-bold stat-value text-white">{totalRecords || '--'}</span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">units</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-green-400/60 text-[10px] font-mono">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.4% vs prev sync</span>
                    </div>
                  </div>

                  <div className="panel-glass hud-card p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Global Reach</p>
                    <div className="flex items-baseline gap-2">
                      <span id="stat-visits" className="text-4xl font-bold stat-value text-white">{stats.uniqueVisitors || '--'}</span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">nodes</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-blue-400/60 text-[10px] font-mono">
                      <Globe className="w-3 h-3" />
                      <span>Live ingestion active</span>
                    </div>
                  </div>

                  <div className="panel-glass hud-card p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Avg Latency</p>
                    <div className="flex items-baseline gap-2">
                      <span id="stat-latency" className="text-4xl font-bold stat-value text-white">{avgLatency || '--'}</span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">ms</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-amber-400/60 text-[10px] font-mono">
                      <Zap className="w-3 h-3" />
                      <span>Optimized response core</span>
                    </div>
                  </div>

                  <div className="panel-glass hud-card p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Auth Integrity</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold stat-value text-white">99.8</span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">%</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-purple-400/60 text-[10px] font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Encrypted tunnels only</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Intelligence Data Grid */}
              <div className="panel-glass rounded-[2rem] overflow-hidden relative">
                <div className="px-10 py-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-8 bg-white/[0.01]">
                  <div className="flex items-center gap-6">
                    <h3 className="font-bold text-lg text-white">Operations Feed</h3>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Filter parameters..." 
                        className="bg-black/40 border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-xs focus:outline-none focus:border-amber-500/30 transition-all w-80 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        // Simple logic to convert current array to CSV and trigger download
                        const headers = activeTab === 'collabs'
                          ? ['Name', 'Type', 'Email', 'Phone', 'Purpose', 'Time']
                          : activeTab === 'visitors'
                          ? ['ID', 'Path', 'OS', 'Browser', 'Device', 'Referrer', 'Time']
                          : ['ID', 'Intent', 'Message', 'Response', 'Latency', 'Time'];
                          
                        const rows = filteredData.map(item => {
                          if (activeTab === 'collabs') {
                            return [item.name, item.type, item.email, item.phone, item.purpose, item.time];
                          } else if (activeTab === 'visitors') {
                            return [item.id, item.path, item.os, item.browser, item.device, item.referrer, item.time];
                          } else {
                            return [item.id, item.intent, item.message, item.response, item.latency, item.time];
                          }
                        });

                        const csvContent = "data:text/csv;charset=utf-8," 
                          + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(","))].join("\n");
                        
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `likith_os_${activeTab}_logs.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-white/10"
                    >
                      Download Logs
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full intel-table text-left">
                    <thead>
                      {activeTab === 'overview' || activeTab === 'signals' ? (
                        <tr>
                          <th className="w-24 px-8 py-6">Status</th>
                          <th className="w-32 px-8 py-6">Intent</th>
                          <th className="px-8 py-6">Signature Feed</th>
                          <th className="w-32 px-8 py-6">Latency</th>
                          <th className="w-32 text-right px-8 py-6">Operation</th>
                        </tr>
                      ) : activeTab === 'collabs' ? (
                        <tr>
                          <th className="px-8 py-6">Requester Signature</th>
                          <th className="px-8 py-6">Protocol</th>
                          <th className="px-8 py-6">Communication Node</th>
                          <th className="px-8 py-6">Temporal Marker</th>
                          <th className="text-right px-8 py-6">Operation</th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="px-8 py-6">Node ID</th>
                          <th className="px-8 py-6">Entry Path</th>
                          <th className="px-8 py-6">Environment</th>
                          <th className="px-8 py-6">Traffic Origin</th>
                          <th className="text-right px-8 py-6">Temporal Marker</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array(6).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan="6" className="p-8">
                              <div className="h-4 bg-white/5 rounded-full w-full opacity-20" />
                            </td>
                          </tr>
                        ))
                      ) : (
                        filteredData.map((item, idx) => {
                          if (activeTab === 'overview' || activeTab === 'signals') {
                            return (
                              <tr key={idx}>
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    <span className="badge-intel text-amber-500/80">Active</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="badge-intel bg-white/5 border border-white/10 text-slate-400">
                                    {item.intent || 'NONE'}
                                  </span>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="max-w-md">
                                    <p className="text-xs text-slate-200 font-medium mb-1 truncate">{item.message}</p>
                                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{item.time}</p>
                                  </div>
                                </td>
                                <td className="font-mono text-[10px] text-slate-500 px-8 py-5">{item.latency}ms</td>
                                <td className="text-right px-8 py-5">
                                  <button 
                                    onClick={() => handleOpenModal(item)} 
                                    className="btn-action px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest"
                                  >
                                    Analyze
                                  </button>
                                </td>
                              </tr>
                            );
                          } else if (activeTab === 'collabs') {
                            return (
                              <tr key={idx}>
                                <td className="px-8 py-5">
                                  <p className="text-xs font-bold text-white tracking-tight">{item.name}</p>
                                  <p className="text-[9px] font-mono text-slate-600 mt-1 uppercase tracking-tighter">{item.time}</p>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="badge-intel bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    {item.type}
                                  </span>
                                </td>
                                <td className="px-8 py-5">
                                  <p className="text-[10px] text-slate-400 font-mono">{item.email || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-600 font-mono mt-1">{item.phone}</p>
                                </td>
                                <td className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-8 py-5">Node-Sync</td>
                                <td className="text-right px-8 py-5">
                                  <button 
                                    onClick={() => handleOpenModal(item)} 
                                    className="btn-action px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest"
                                  >
                                    Inspect
                                  </button>
                                </td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={idx}>
                                <td className="text-slate-600 font-mono text-[10px] px-8 py-5">OPS-{item.id}</td>
                                <td className="text-xs text-white font-mono tracking-tight font-medium px-8 py-5">{item.path}</td>
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="badge-intel bg-white/5 border border-white/5 text-slate-500">{item.os}</span>
                                    <span className="badge-intel bg-white/5 border border-white/5 text-slate-500">{item.browser}</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.device}</span>
                                </td>
                                <td className="text-xs font-mono text-slate-500 truncate max-w-[150px] px-8 py-5">{item.referrer}</td>
                                <td className="text-right font-mono text-[9px] text-slate-600 uppercase tracking-tighter px-8 py-5">{item.time}</td>
                              </tr>
                            );
                          }
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Empty Node State */}
                {!isLoading && filteredData.length === 0 && (
                  <div id="empty-state" className="flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 rotate-45 border border-white/5">
                      <Box className="w-8 h-8 text-slate-600 -rotate-45" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-300">No Intelligence Ingested</h4>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                      The secure data matrix is currently awaiting incoming operational signals matching filter parameters.
                    </p>
                  </div>
                )}

                {/* Control Footer */}
                <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div id="pagination-info" className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    Node: {currentPage * limit}-{currentPage * limit + filteredData.length} | Data Stream: {totalRecords}
                  </div>
                  <div className="flex gap-8">
                    <button 
                      onClick={() => handlePageChange(-1)} 
                      disabled={currentPage === 0 || isLoading}
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group transition-colors ${
                        currentPage === 0 || isLoading ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      Previous Protocol
                    </button>
                    <button 
                      onClick={() => handlePageChange(1)} 
                      disabled={(currentPage + 1) * limit >= totalRecords || isLoading}
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group transition-colors ${
                        (currentPage + 1) * limit >= totalRecords || isLoading ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      Next Protocol
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

            </main>
          </div>
        )}

        {/* Record Inspection Modal */}
        {isModalOpen && selectedItem && (
          <div id="detail-modal" className="fixed inset-0 z-[210] bg-[#03040a]/95 backdrop-blur-3xl flex items-center justify-center p-6 text-left">
            <div className="panel-glass p-12 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative panel-border-glow">
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full" />
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-[1px] w-6 bg-amber-500/60" />
                    <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">Deep Packet Inspection</span>
                  </div>
                  <h2 id="modal-title" className="text-4xl font-bold title-gradient">
                    {activeTab === 'collabs' ? 'Partnership Protocol Ingest' : 'Signal Deep-Inspection'}
                  </h2>
                  <p id="modal-subtitle" className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-[0.3em]">
                    {activeTab === 'collabs' 
                      ? `SIGNAL_SIGNATURE: ${selectedItem.id}` 
                      : `NODE: OPS-${selectedItem.id} | EXEC_LATENCY: ${selectedItem.latency}MS`}
                  </p>
                </div>
                <button 
                  onClick={handleCloseModal} 
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div id="modal-content" className="space-y-10 relative z-10">
                {activeTab === 'collabs' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <div className="p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10">
                        <label className="text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Entity Signature</label>
                        <span className="text-white font-bold text-2xl tracking-tighter">{selectedItem.name}</span>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                        <label className="text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Mission Category</label>
                        <span className="text-blue-400 font-mono font-bold uppercase tracking-tight">{selectedItem.type}</span>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                        <label className="text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Current Status</label>
                        <span className="text-amber-500 font-mono font-bold uppercase tracking-tight">Review_Pending</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em] font-mono">Strategic Goal Manifest</label>
                      <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-slate-200 text-xl leading-relaxed font-light italic">
                        "{selectedItem.purpose}"
                      </div>
                    </div>
                    
                    {/* India State or USA State details if available */}
                    {(selectedItem.country || selectedItem.state) && (
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                        <label className="text-[10px] text-slate-600 uppercase font-bold mb-4 block font-mono tracking-widest">Geospatial Origin</label>
                        <div className="grid grid-cols-2 gap-10 font-mono text-sm">
                          <div className="space-y-1">
                            <span className="text-slate-700 block text-[9px] font-bold uppercase tracking-widest">Country</span>
                            <span className="text-slate-300">{selectedItem.country || 'N/A'}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-700 block text-[9px] font-bold uppercase tracking-widest">State / Province</span>
                            <span className="text-slate-300">{selectedItem.state || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-10 rounded-[2.5rem] bg-black/60 border border-white/5">
                      <label className="text-[10px] text-slate-600 uppercase font-bold mb-6 block font-mono tracking-widest">Secure Communication Nodes</label>
                      <div className="grid grid-cols-2 gap-10 font-mono text-sm">
                        <div className="space-y-1">
                          <span className="text-slate-700 block text-[9px] font-bold uppercase tracking-widest">Network_Email</span>
                          <span className="text-blue-400/80 tracking-tight">{selectedItem.email || 'NULL'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-700 block text-[9px] font-bold uppercase tracking-widest">Cellular_Link</span>
                          <span className="text-blue-400/80 tracking-tight">{selectedItem.phone}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em] font-mono">Input Signal Stream</label>
                        <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 text-slate-200 text-sm leading-relaxed font-medium">
                          {selectedItem.message}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] text-amber-500/60 uppercase font-bold tracking-[0.3em] font-mono">Neural Response Synthesis</label>
                        <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium shadow-[inset_0_0_40px_rgba(251,191,36,0.02)]">
                          {selectedItem.response}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <label className="relative z-10 text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Logic Intent</label>
                        <span className="relative z-10 text-amber-500 font-mono font-bold text-lg uppercase tracking-tight">
                          {selectedItem.intent || 'GENERAL_INTEL'}
                        </span>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                        <label className="text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Time Signature</label>
                        <span className="text-white font-mono font-bold text-sm uppercase tracking-tighter">{selectedItem.time}</span>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                        <label className="text-[9px] text-slate-600 uppercase font-bold mb-3 block font-mono tracking-widest">Sync Priority</label>
                        <span className="text-green-500 font-mono font-bold text-sm uppercase tracking-tighter">Verified_Optimal</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default DataConsolePage;
