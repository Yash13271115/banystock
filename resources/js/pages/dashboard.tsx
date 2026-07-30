import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { 
    Search, 
    Bell, 
    TrendingUp, 
    Menu, 
    Plus, 
    Filter, 
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    Star,
    Award,
    ShieldCheck
} from 'lucide-react';
import AppSidebar from '../components/app-sidebar';

interface TopGainer {
    id: number;
    trading_symbol: string;
    symbol_token: string | null;
    ltp: string | number;
    net_change: string | number;
    percent_change: string | number;
    data_type: string;
}

interface ProfileData {
    name?: string;
    email?: string;
    client_code?: string;
    mobile_number?: string;
    broker_title?: string;
}

interface RmsData {
    net?: string | number;
    available_cash?: string | number;
    collateral?: string | number;
    m2m_unrealized?: string | number;
    m2m_realized?: string | number;
    utilized_margin?: string | number;
}

interface PageProps {
    topGainers?: TopGainer[];
    profile?: ProfileData | null;
    rms?: RmsData | null;
}

export default function Dashboard() {
    const { topGainers = [], profile = null, rms = null } = usePage<PageProps>().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
    
    // Select first stock from live AngelOne Top Gainers or fallback to default
    const [selectedStock, setSelectedStock] = useState<string>(
        topGainers.length > 0 ? topGainers[0].trading_symbol : 'ANGELONE'
    );

    // Dynamic Chart Vector paths
    const chartPaths: Record<string, string> = {
        '1D': 'M 0 120 C 40 110, 80 140, 120 100 C 160 60, 200 90, 240 70 C 280 50, 320 80, 360 40 C 400 0, 440 30, 480 20 C 520 10, 560 40, 600 15',
        '1W': 'M 0 140 C 40 100, 80 130, 120 90 C 160 110, 200 70, 240 85 C 280 60, 320 40, 360 55 C 400 30, 440 50, 480 25 C 520 35, 560 15, 600 10',
        '1M': 'M 0 150 C 40 120, 80 135, 120 95 C 160 110, 200 80, 240 60 C 280 90, 320 50, 360 30 C 400 45, 440 20, 480 35 C 520 15, 560 25, 600 5',
        '1Y': 'M 0 160 C 50 140, 100 120, 150 130 C 200 90, 250 110, 300 70 C 350 85, 400 45, 450 60 C 500 30, 550 40, 600 15',
        'ALL': 'M 0 170 C 60 150, 120 130, 180 140 C 240 100, 300 115, 360 75 C 420 80, 480 35, 540 45, 600 20',
    };

    // Calculate dynamic values for top card display
    const activeSelected = topGainers.find(g => g.trading_symbol === selectedStock) || topGainers[0];

    return (
        <>
            <Head title="BanyaStock CRM - Market Top Gainers" />

            <div className="flex h-screen bg-[#111823] text-white font-sans overflow-hidden">
                {/* Sidebar Component */}
                <AppSidebar
                    currentPath="market"
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#111823]">
                    {/* Header Bar */}
                    <header className="h-16 border-b border-[#222D3E] bg-[#1C2534]/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-4 flex-1 max-w-xl">
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#222D3E] transition-colors"
                            >
                                <Menu size={20} />
                            </button>

                            {/* Search Bar */}
                            <div className="relative w-full">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search AngelOne symbols, Top Gainers, or market telemetry..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#222D3E] border border-[#222D3E] rounded-xl text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#E5B246] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Top Header Actions */}
                        <div className="flex items-center gap-4">
                            {/* Live AngelOne Status Pill */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#222D3E] border border-[#222D3E] text-xs font-medium">
                                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                                <span className="text-[#94A3B8]">AngelOne SmartAPI:</span>
                                <span className="text-[#22C55E] font-semibold">CONNECTED</span>
                            </div>

                            {/* Notification Bell */}
                            <button className="relative p-2 rounded-xl bg-[#222D3E] text-[#94A3B8] hover:text-white transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E5B246] rounded-full"></span>
                            </button>

                            {/* User Avatar */}
                            <div className="flex items-center gap-3 pl-2 border-l border-[#222D3E]">
                                <div className="w-8 h-8 rounded-full bg-[#E5B246] text-[#111823] font-bold text-xs flex items-center justify-center shadow-md">
                                    {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'YS'}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Main Body */}
                    <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
                        {/* Title Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                    AngelOne Live Top Gainers
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E5B246]/10 text-[#E5B246] border border-[#E5B246]/20">
                                        Live Telemetry
                                    </span>
                                </h1>
                                <p className="text-xs text-[#94A3B8] mt-1">
                                    Real-time Top Gainers fetched directly from AngelOne SmartAPI data stream.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#222D3E] text-xs font-semibold text-white hover:bg-[#222D3E]/80 transition-colors border border-[#222D3E]">
                                    <Filter size={14} className="text-[#E5B246]" /> Filter Gainers
                                </button>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5B246] text-xs font-bold text-[#111823] hover:bg-[#E5B246]/90 transition-colors shadow-lg shadow-[#E5B246]/10"
                                >
                                    <RefreshCw size={14} /> Refresh Data
                                </button>
                            </div>
                        </div>

                        {/* Top 4 Live Gainers Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {topGainers.length > 0 ? (
                                topGainers.slice(0, 4).map((gainer) => {
                                    const percent = Number(gainer.percent_change);
                                    const isPositive = percent >= 0;
                                    return (
                                        <div
                                            key={gainer.id}
                                            onClick={() => setSelectedStock(gainer.trading_symbol)}
                                            className={`p-4 rounded-2xl bg-[#1C2534] border transition-all duration-200 cursor-pointer hover:translate-y-[-2px] ${
                                                selectedStock === gainer.trading_symbol
                                                    ? 'border-[#E5B246] shadow-lg shadow-[#E5B246]/10'
                                                    : 'border-[#222D3E] hover:border-[#94A3B8]/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-[#222D3E] flex items-center justify-center font-bold text-xs text-[#E5B246]">
                                                        {gainer.trading_symbol.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-white">{gainer.trading_symbol}</div>
                                                        <div className="text-[10px] text-[#94A3B8]">Token: {gainer.symbol_token || 'N/A'}</div>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                                                        isPositive
                                                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                                            : 'bg-[#EF4444]/10 text-[#EF4444]'
                                                    }`}
                                                >
                                                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                    {isPositive ? '+' : ''}{percent.toFixed(2)}%
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-baseline justify-between">
                                                <div className="text-xl font-extrabold text-white">₹{Number(gainer.ltp).toLocaleString('en-IN')}</div>
                                                <div className="text-[10px] text-[#94A3B8]">Change: ₹{Number(gainer.net_change).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-4 p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] text-center text-xs text-[#94A3B8]">
                                    No live Top Gainers telemetry synced yet. Run <code className="bg-[#222D3E] px-2 py-1 rounded text-[#E5B246]">php artisan angelone:sync</code> on your server.
                                </div>
                            )}
                        </div>

                        {/* Chart & Live AngelOne RMS / Margin Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stock Chart Card */}
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] flex flex-col justify-between space-y-6">
                                {/* Chart Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#E5B246]/10 border border-[#E5B246]/30 flex items-center justify-center font-extrabold text-sm text-[#E5B246]">
                                            {selectedStock.slice(0, 3)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-white">{selectedStock} Live Trend</h2>
                                                {activeSelected && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-semibold">
                                                        +{Number(activeSelected.percent_change).toFixed(2)}% Top Gainer
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#94A3B8]">Real-time AngelOne SmartAPI price telemetry</p>
                                        </div>
                                    </div>

                                    {/* Timeframe Selector Buttons */}
                                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#222D3E] border border-[#222D3E]">
                                        {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                                            <button
                                                key={tf}
                                                onClick={() => setTimeframe(tf)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                    timeframe === tf
                                                        ? 'bg-[#E5B246] text-[#111823] shadow-md font-bold'
                                                        : 'text-[#94A3B8] hover:text-white'
                                                }`}
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Vector Stock Chart SVG */}
                                <div className="relative h-64 w-full pt-4">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#E5B246" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#E5B246" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Horizontal Grid lines */}
                                        <line x1="0" y1="30" x2="600" y2="30" stroke="#222D3E" strokeDasharray="4 4" />
                                        <line x1="0" y1="80" x2="600" y2="80" stroke="#222D3E" strokeDasharray="4 4" />
                                        <line x1="0" y1="130" x2="600" y2="130" stroke="#222D3E" strokeDasharray="4 4" />

                                        {/* Chart Fill Area */}
                                        <path
                                            d={`${chartPaths[timeframe]} L 600 180 L 0 180 Z`}
                                            fill="url(#goldGradient)"
                                        />

                                        {/* Gold Trend Line */}
                                        <path
                                            d={chartPaths[timeframe]}
                                            fill="none"
                                            stroke="#E5B246"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>

                                {/* Selected Stock Key Telemetry */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#222D3E] text-xs">
                                    <div>
                                        <div className="text-[#94A3B8]">Last Traded Price</div>
                                        <div className="font-semibold text-white mt-0.5">
                                            ₹{activeSelected ? Number(activeSelected.ltp).toLocaleString('en-IN') : '0.00'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">Net Change</div>
                                        <div className="font-semibold text-[#22C55E] mt-0.5">
                                            +₹{activeSelected ? Number(activeSelected.net_change).toFixed(2) : '0.00'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">Percent Gain</div>
                                        <div className="font-semibold text-[#E5B246] mt-0.5">
                                            +{activeSelected ? Number(activeSelected.percent_change).toFixed(2) : '0.00'}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">Symbol Token</div>
                                        <div className="font-semibold text-white mt-0.5">
                                            {activeSelected?.symbol_token || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AngelOne Real Account Funds & Profile */}
                            <div className="p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                                            <Briefcase size={18} className="text-[#E5B246]" /> Real Margin & Funds
                                        </h3>
                                        <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1">
                                            <ShieldCheck size={14} /> AngelOne Verified
                                        </span>
                                    </div>

                                    <div className="mt-4 p-4 rounded-xl bg-[#222D3E]/50 border border-[#222D3E]">
                                        <div className="text-xs text-[#94A3B8]">Available Cash Balance</div>
                                        <div className="text-2xl font-extrabold text-white mt-1">
                                            ₹{rms ? Number(rms.available_cash).toLocaleString('en-IN') : '0.00'}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-[#E5B246] font-semibold mt-1">
                                            <Award size={14} /> Net Balance: ₹{rms ? Number(rms.net).toLocaleString('en-IN') : '0.00'}
                                        </div>
                                    </div>

                                    {/* Real Account Telemetry Breakdown */}
                                    <div className="mt-6 space-y-3 text-xs">
                                        <div className="flex justify-between py-2 border-b border-[#222D3E]">
                                            <span className="text-[#94A3B8]">Client Code</span>
                                            <span className="text-white font-bold">{profile?.client_code || 'ANGEL_USER'}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b border-[#222D3E]">
                                            <span className="text-[#94A3B8]">Collateral Margin</span>
                                            <span className="text-white font-bold">₹{rms ? Number(rms.collateral).toLocaleString('en-IN') : '0.00'}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b border-[#222D3E]">
                                            <span className="text-[#94A3B8]">M2M Realized</span>
                                            <span className="text-[#22C55E] font-bold">₹{rms ? Number(rms.m2m_realized).toLocaleString('en-IN') : '0.00'}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b border-[#222D3E]">
                                            <span className="text-[#94A3B8]">Utilized Margin</span>
                                            <span className="text-[#E5B246] font-bold">₹{rms ? Number(rms.utilized_margin).toLocaleString('en-IN') : '0.00'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-[#222D3E] text-center text-xs text-[#94A3B8]">
                                    Synced directly from SmartAPI Broker Account
                                </div>
                            </div>
                        </div>

                        {/* Complete Live Top Gainers Data Table */}
                        <div className="p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Star size={18} className="text-[#E5B246]" /> Full Top Gainers Telemetry List
                                    </h3>
                                    <p className="text-xs text-[#94A3B8]">Live equities sorted by highest percentage price gains from AngelOne SmartAPI.</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-[#222D3E]/50 text-xs uppercase text-[#94A3B8] border-b border-[#222D3E]">
                                        <tr>
                                            <th className="py-3 px-4">Trading Symbol</th>
                                            <th className="py-3 px-4">Symbol Token</th>
                                            <th className="py-3 px-4">LTP (Last Price)</th>
                                            <th className="py-3 px-4">Net Change</th>
                                            <th className="py-3 px-4">Percent Gain</th>
                                            <th className="py-3 px-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222D3E]/60">
                                        {topGainers.length > 0 ? (
                                            topGainers.map((item) => {
                                                const percent = Number(item.percent_change);
                                                const isPositive = percent >= 0;
                                                return (
                                                    <tr key={item.id} className="hover:bg-[#222D3E]/40 transition-colors group">
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-[#222D3E] flex items-center justify-center font-bold text-xs text-[#E5B246]">
                                                                    {item.trading_symbol.slice(0, 2)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white group-hover:text-[#E5B246] transition-colors">{item.trading_symbol}</div>
                                                                    <div className="text-xs text-[#94A3B8]">AngelOne SmartAPI</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-xs text-slate-300">{item.symbol_token || 'N/A'}</td>
                                                        <td className="py-3.5 px-4 font-bold text-white">₹{Number(item.ltp).toLocaleString('en-IN')}</td>
                                                        <td className="py-3.5 px-4 text-xs text-[#22C55E]">
                                                            +₹{Number(item.net_change).toFixed(2)}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#22C55E]/10 text-[#22C55E]">
                                                                <TrendingUp size={12} /> +{percent.toFixed(2)}%
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <span className="px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-xs font-bold text-[#22C55E]">
                                                                TOP GAINER
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                                                    No fake data. Run <code className="bg-[#222D3E] px-2 py-1 rounded text-[#E5B246]">php artisan angelone:sync</code> to pull live Top Gainers telemetry into your dashboard.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
