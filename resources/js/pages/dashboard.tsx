import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    Search, 
    Bell, 
    TrendingUp, 
    TrendingDown, 
    Menu, 
    Plus, 
    ExternalLink, 
    Filter, 
    RefreshCw,
    SlidersHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    Star
} from 'lucide-react';
import AppSidebar from '../components/app-sidebar';

export default function Dashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
    const [selectedStock, setSelectedStock] = useState('AAPL');

    // Market Overview Metrics
    const metrics = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '$182.50', change: '+1.40%', isPositive: true, volume: '$12.4B' },
        { symbol: 'TSLA', name: 'Tesla Motors', price: '$248.10', change: '-0.67%', isPositive: false, volume: '$8.9B' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$128.40', change: '+3.12%', isPositive: true, volume: '$16.1B' },
        { symbol: 'BTC/USD', name: 'Bitcoin', price: '$64,850.00', change: '+2.45%', isPositive: true, volume: '$28.5B' },
    ];

    // Watchlist Table Data
    const watchlist = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: '$182.50', change: '+1.40%', isPositive: true, cap: '$2.81T' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', price: '$248.10', change: '-0.67%', isPositive: false, cap: '$789.2B' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Semiconductors', price: '$128.40', change: '+3.12%', isPositive: true, cap: '$3.15T' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Software', price: '$448.90', change: '+0.85%', isPositive: true, cap: '$3.33T' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-Commerce', price: '$186.20', change: '-1.15%', isPositive: false, cap: '$1.94T' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', price: '$176.40', change: '+0.42%', isPositive: true, cap: '$2.18T' },
    ];

    // SVG Chart Points depending on selected timeframe
    const chartPaths: Record<string, string> = {
        '1D': 'M 0 120 C 40 110, 80 140, 120 100 C 160 60, 200 90, 240 70 C 280 50, 320 80, 360 40 C 400 0, 440 30, 480 20 C 520 10, 560 40, 600 15',
        '1W': 'M 0 140 C 40 100, 80 130, 120 90 C 160 110, 200 70, 240 85 C 280 60, 320 40, 360 55 C 400 30, 440 50, 480 25 C 520 35, 560 15, 600 10',
        '1M': 'M 0 150 C 40 120, 80 135, 120 95 C 160 110, 200 80, 240 60 C 280 90, 320 50, 360 30 C 400 45, 440 20, 480 35 C 520 15, 560 25, 600 5',
        '1Y': 'M 0 160 C 50 140, 100 120, 150 130 C 200 90, 250 110, 300 70 C 350 85, 400 45, 450 60 C 500 30, 550 40, 600 15',
        'ALL': 'M 0 170 C 60 150, 120 130, 180 140 C 240 100, 300 115, 360 75 C 420 80, 480 35, 540 45, 600 20',
    };

    return (
        <>
            <Head title="BanyaStock CRM - Market Dashboard" />

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
                                <Search size={18} className="absolute left-3 top.1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search stocks, tickers, portfolios, or CRM leads..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#222D3E] border border-[#222D3E] rounded-xl text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#E5B246] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Top Header Actions */}
                        <div className="flex items-center gap-4">
                            {/* Market Status Pill */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#222D3E] border border-[#222D3E] text-xs font-medium">
                                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                                <span className="text-[#94A3B8]">NYSE Market:</span>
                                <span className="text-[#22C55E] font-semibold">OPEN</span>
                            </div>

                            {/* Notification Bell */}
                            <button className="relative p-2 rounded-xl bg-[#222D3E] text-[#94A3B8] hover:text-white transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E5B246] rounded-full"></span>
                            </button>

                            {/* User Avatar */}
                            <div className="flex items-center gap-3 pl-2 border-l border-[#222D3E]">
                                <div className="w-8 h-8 rounded-full bg-[#E5B246] text-[#111823] font-bold text-xs flex items-center justify-center shadow-md">
                                    YS
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
                                    Market Intelligence Overview
                                </h1>
                                <p className="text-xs text-[#94A3B8] mt-1">
                                    Real-time financial telemetry, equity trends, and CRM portfolio analytics.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#222D3E] text-xs font-semibold text-white hover:bg-[#222D3E]/80 transition-colors border border-[#222D3E]">
                                    <Filter size={14} className="text-[#E5B246]" /> Filter View
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5B246] text-xs font-bold text-[#111823] hover:bg-[#E5B246]/90 transition-colors shadow-lg shadow-[#E5B246]/10">
                                    <Plus size={14} /> Add Asset
                                </button>
                            </div>
                        </div>

                        {/* Top 4 Market Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {metrics.map((m) => (
                                <div
                                    key={m.symbol}
                                    onClick={() => setSelectedStock(m.symbol)}
                                    className={`p-4 rounded-2xl bg-[#1C2534] border transition-all duration-200 cursor-pointer hover:translate-y-[-2px] ${
                                        selectedStock === m.symbol
                                            ? 'border-[#E5B246] shadow-lg shadow-[#E5B246]/10'
                                            : 'border-[#222D3E] hover:border-[#94A3B8]/30'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#222D3E] flex items-center justify-center font-bold text-xs text-[#E5B246]">
                                                {m.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{m.symbol}</div>
                                                <div className="text-[10px] text-[#94A3B8] truncate max-w-[90px]">{m.name}</div>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                                                m.isPositive
                                                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                                            }`}
                                        >
                                            {m.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {m.change}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-baseline justify-between">
                                        <div className="text-xl font-extrabold text-white">{m.price}</div>
                                        <div className="text-[10px] text-[#94A3B8]">Vol: {m.volume}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Stock Chart & Details Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stock Chart Card (2 Columns) */}
                            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] flex flex-col justify-between space-y-6">
                                {/* Chart Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#E5B246]/10 border border-[#E5B246]/30 flex items-center justify-center font-extrabold text-sm text-[#E5B246]">
                                            {selectedStock.slice(0, 3)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-white">{selectedStock} Market Trend</h2>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-semibold">+1.40% Today</span>
                                            </div>
                                            <p className="text-xs text-[#94A3B8]">Real-time tick data & technical analysis</p>
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

                                {/* Vector Stock Chart SVG with Gold Accent Gradient */}
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

                                {/* Stock Key Statistics */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#222D3E] text-xs">
                                    <div>
                                        <div className="text-[#94A3B8]">Day Range</div>
                                        <div className="font-semibold text-white mt-0.5">$180.10 - $184.20</div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">52-Wk High</div>
                                        <div className="font-semibold text-white mt-0.5">$199.62</div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">Market Cap</div>
                                        <div className="font-semibold text-white mt-0.5">$2.81 Trillion</div>
                                    </div>
                                    <div>
                                        <div className="text-[#94A3B8]">P/E Ratio</div>
                                        <div className="font-semibold text-[#E5B246] mt-0.5">31.45</div>
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Holdings Summary (1 Column) */}
                            <div className="p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                                            <Briefcase size={18} className="text-[#E5B246]" /> Portfolio Allocation
                                        </h3>
                                        <span className="text-xs text-[#94A3B8]">4 Assets</span>
                                    </div>

                                    <div className="mt-4 p-4 rounded-xl bg-[#222D3E]/50 border border-[#222D3E]">
                                        <div className="text-xs text-[#94A3B8]">Total Equity Balance</div>
                                        <div className="text-2xl font-extrabold text-white mt-1">$148,920.50</div>
                                        <div className="flex items-center gap-1 text-xs text-[#22C55E] font-semibold mt-1">
                                            <TrendingUp size={14} /> +$6,890.20 (+4.85%) All Time
                                        </div>
                                    </div>

                                    {/* Asset Allocation Breakdown */}
                                    <div className="mt-6 space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-200 font-semibold">US Tech Equities</span>
                                                <span className="text-[#E5B246] font-bold">55% ($81.9K)</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-[#222D3E] overflow-hidden">
                                                <div className="h-full bg-[#E5B246] rounded-full" style={{ width: '55%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-200 font-semibold">Crypto / Digital Assets</span>
                                                <span className="text-[#22C55E] font-bold">30% ($44.6K)</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-[#222D3E] overflow-hidden">
                                                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '30%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-200 font-semibold">Cash & Commodities</span>
                                                <span className="text-[#94A3B8] font-bold">15% ($22.3K)</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-[#222D3E] overflow-hidden">
                                                <div className="h-full bg-[#94A3B8] rounded-full" style={{ width: '15%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-xl bg-[#222D3E] hover:bg-[#222D3E]/80 text-xs font-bold text-white border border-[#222D3E] transition-colors flex items-center justify-center gap-2">
                                    Rebalance Portfolio <ExternalLink size={14} className="text-[#E5B246]" />
                                </button>
                            </div>
                        </div>

                        {/* Watchlist & Equity CRM Table */}
                        <div className="p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Star size={18} className="text-[#E5B246]" /> Primary Stock Watchlist
                                    </h3>
                                    <p className="text-xs text-[#94A3B8]">Track live market quotes, sector categories, and valuation caps.</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg bg-[#222D3E] text-[#94A3B8] hover:text-white transition-colors" title="Refresh Feed">
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-[#222D3E]/50 text-xs uppercase text-[#94A3B8] border-b border-[#222D3E]">
                                        <tr>
                                            <th className="py-3 px-4">Asset / Company</th>
                                            <th className="py-3 px-4">Sector</th>
                                            <th className="py-3 px-4">Last Price</th>
                                            <th className="py-3 px-4">24h Change</th>
                                            <th className="py-3 px-4">Market Cap</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222D3E]/60">
                                        {watchlist.map((item) => (
                                            <tr key={item.symbol} className="hover:bg-[#222D3E]/40 transition-colors group">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#222D3E] flex items-center justify-center font-bold text-xs text-[#E5B246]">
                                                            {item.symbol.slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-[#E5B246] transition-colors">{item.symbol}</div>
                                                            <div className="text-xs text-[#94A3B8]">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-slate-300">{item.sector}</td>
                                                <td className="py-3.5 px-4 font-bold text-white">{item.price}</td>
                                                <td className="py-3.5 px-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                                            item.isPositive
                                                                ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                                                : 'bg-[#EF4444]/10 text-[#EF4444]'
                                                        }`}
                                                    >
                                                        {item.isPositive ? '+' : ''}{item.change}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-[#94A3B8]">{item.cap}</td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <button className="px-3 py-1.5 rounded-lg bg-[#222D3E] hover:bg-[#E5B246] hover:text-[#111823] text-xs font-semibold text-white transition-colors">
                                                        Trade
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
