import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BarChart3,
    CandlestickChart,
    ChevronLeft,
    Loader2,
    Search,
} from 'lucide-react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import AppSidebar from '../components/app-sidebar';

interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface StockInfo {
    symbol: string;
    name: string;
    token: string;
    exchange: string;
}

interface PageProps {
    symbol: string;
    symbolToken: string;
    exchange: string;
    stockName: string;
    availableStocks: StockInfo[];
}

type Interval = 'ONE_MINUTE' | 'FIVE_MINUTE' | 'FIFTEEN_MINUTE' | 'THIRTY_MINUTE' | 'ONE_HOUR' | 'ONE_DAY';

const INTERVAL_OPTIONS: { label: string; value: Interval; days: number }[] = [
    { label: '1m', value: 'ONE_MINUTE', days: 2 },
    { label: '5m', value: 'FIVE_MINUTE', days: 5 },
    { label: '15m', value: 'FIFTEEN_MINUTE', days: 15 },
    { label: '30m', value: 'THIRTY_MINUTE', days: 30 },
    { label: '1H', value: 'ONE_HOUR', days: 60 },
    { label: '1D', value: 'ONE_DAY', days: 365 },
];

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d} 09:00`;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(price);
}

export default function Ticker() {
    const { symbol, symbolToken, exchange, stockName, availableStocks } =
        usePage<PageProps>().props;

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const candleSeriesRef = useRef<ReturnType<typeof CandlestickSeries> | null>(null);
    const volumeSeriesRef = useRef<ReturnType<typeof HistogramSeries> | null>(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [activeInterval, setActiveInterval] = useState<Interval>('ONE_DAY');
    const [candles, setCandles] = useState<CandleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;
    const firstCandle = candles.length > 0 ? candles[0] : null;
    const priceChange = lastCandle && firstCandle ? lastCandle.close - firstCandle.open : 0;
    const priceChangePercent = firstCandle && firstCandle.open !== 0 ? (priceChange / firstCandle.open) * 100 : 0;
    const isPositive = priceChange >= 0;

    const fetchCandleData = useCallback(
        async (interval: Interval) => {
            setLoading(true);
            setError(null);

            const days = INTERVAL_OPTIONS.find((o) => o.value === interval)?.days ?? 365;
            const toDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);

            const params = new URLSearchParams({
                exchange,
                symboltoken: symbolToken,
                interval,
                fromdate: formatDate(fromDate),
                todate: formatDate(toDate),
            });

            try {
                const response = await fetch(`/api/ticker/history?${params.toString()}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });

                const json = await response.json();

                if (json.success && json.data?.length > 0) {
                    setCandles(json.data);
                } else {
                    setError(json.message || 'No data available for this interval');
                    setCandles([]);
                }
            } catch (err) {
                setError('Failed to fetch chart data');
                setCandles([]);
            } finally {
                setLoading(false);
            }
        },
        [exchange, symbolToken],
    );

    // Initial data fetch
    useEffect(() => {
        fetchCandleData(activeInterval);
    }, [fetchCandleData, activeInterval]);

    // Create and update chart
    useEffect(() => {
        if (!chartContainerRef.current || candles.length === 0) return;

        // Clean up existing chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94A3B8',
                fontFamily: "'Inter', sans-serif",
            },
            grid: {
                vertLines: { color: 'rgba(42, 56, 77, 0.4)' },
                horzLines: { color: 'rgba(42, 56, 77, 0.4)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            crosshair: {
                mode: 0,
                vertLine: {
                    color: 'rgba(139, 92, 246, 0.4)',
                    width: 1,
                    style: 2,
                },
                horzLine: {
                    color: 'rgba(139, 92, 246, 0.4)',
                    width: 1,
                    style: 2,
                },
            },
            rightPriceScale: {
                borderColor: 'rgba(42, 56, 77, 0.6)',
                scaleMargins: { top: 0.1, bottom: 0.25 },
            },
            timeScale: {
                borderColor: 'rgba(42, 56, 77, 0.6)',
                timeVisible: activeInterval !== 'ONE_DAY',
                secondsVisible: false,
            },
        });

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22C55E',
            downColor: '#EF4444',
            borderUpColor: '#22C55E',
            borderDownColor: '#EF4444',
            wickUpColor: '#22C55E',
            wickDownColor: '#EF4444',
        });

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#6366F1',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        });

        // Transform data for lightweight-charts (needs ascending time order)
        const sortedCandles = [...candles].sort((a, b) => a.time - b.time);

        const candleChartData = sortedCandles.map((c) => ({
            time: c.time as any,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const volumeChartData = sortedCandles.map((c) => ({
            time: c.time as any,
            value: c.volume,
            color: c.close >= c.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        }));

        candleSeries.setData(candleChartData);
        volumeSeries.setData(volumeChartData);

        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [candles, activeInterval]);

    const handleIntervalChange = (interval: Interval) => {
        setActiveInterval(interval);
    };

    const filteredStocks = availableStocks.filter(
        (s) =>
            s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <Head title={`${symbol} — Historical Chart`} />

            <div className="flex h-screen bg-[#0F1724] overflow-hidden">
                <AppSidebar
                    currentPath="ticker"
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <main className="flex-1 overflow-y-auto">
                    {/* Top Header Bar */}
                    <div className="sticky top-0 z-20 bg-[#0F1724]/95 backdrop-blur-xl border-b border-[#1E293B]">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="p-2 rounded-lg bg-[#1C2534] hover:bg-[#253347] text-[#94A3B8] hover:text-white transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </Link>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <CandlestickChart size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                            {symbol}
                                            <span className="text-xs font-normal text-[#94A3B8] bg-[#1C2534] px-2 py-0.5 rounded">
                                                {exchange}
                                            </span>
                                        </h1>
                                        <p className="text-sm text-[#64748B]">{stockName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Display */}
                            <div className="flex items-center gap-6">
                                {lastCandle && (
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white tracking-tight">
                                            {formatPrice(lastCandle.close)}
                                        </div>
                                        <div
                                            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
                                        >
                                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {isPositive ? '+' : ''}
                                            {priceChange.toFixed(2)} ({isPositive ? '+' : ''}
                                            {priceChangePercent.toFixed(2)}%)
                                        </div>
                                    </div>
                                )}

                                {/* Stock Search */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSearch(!showSearch)}
                                        className="p-2.5 rounded-xl bg-[#1C2534] hover:bg-[#253347] text-[#94A3B8] hover:text-white transition-all border border-[#1E293B]"
                                    >
                                        <Search size={18} />
                                    </button>

                                    {showSearch && (
                                        <div className="absolute right-0 top-12 w-80 bg-[#1C2534] border border-[#2A384D] rounded-xl shadow-2xl overflow-hidden z-50">
                                            <div className="p-3 border-b border-[#2A384D]">
                                                <input
                                                    type="text"
                                                    placeholder="Search stocks..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    autoFocus
                                                    className="w-full bg-[#0F1724] text-white placeholder-[#64748B] text-sm px-3 py-2 rounded-lg border border-[#2A384D] focus:border-indigo-500 focus:outline-none"
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredStocks.map((stock) => (
                                                    <Link
                                                        key={stock.symbol}
                                                        href={`/ticker/${stock.symbol}`}
                                                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#253347] transition-colors ${stock.symbol === symbol ? 'bg-[#253347] border-l-2 border-indigo-500' : ''}`}
                                                        onClick={() => setShowSearch(false)}
                                                    >
                                                        <div>
                                                            <div className="text-sm font-semibold text-white">
                                                                {stock.symbol}
                                                            </div>
                                                            <div className="text-xs text-[#64748B]">{stock.name}</div>
                                                        </div>
                                                        <span className="text-xs text-[#64748B] bg-[#0F1724] px-2 py-0.5 rounded">
                                                            {stock.exchange}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="p-6">
                        <div className="bg-[#1C2534]/60 backdrop-blur-sm rounded-2xl border border-[#1E293B] overflow-hidden">
                            {/* Interval Controls */}
                            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-[#64748B]" />
                                    <span className="text-sm text-[#64748B] font-medium">Interval</span>
                                </div>
                                <div className="flex items-center gap-1 bg-[#0F1724] rounded-lg p-1">
                                    {INTERVAL_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleIntervalChange(opt.value)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                                activeInterval === opt.value
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1C2534]'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chart Canvas */}
                            <div className="relative" style={{ minHeight: '500px' }}>
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#1C2534]/80 backdrop-blur-sm z-10">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-indigo-400 animate-spin" />
                                            <span className="text-sm text-[#94A3B8]">Loading chart data...</span>
                                        </div>
                                    </div>
                                )}

                                {error && !loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#1C2534]/80 z-10">
                                        <div className="flex flex-col items-center gap-3 text-center max-w-md">
                                            <BarChart3 size={40} className="text-[#64748B]" />
                                            <p className="text-sm text-[#94A3B8]">{error}</p>
                                            <button
                                                onClick={() => fetchCandleData(activeInterval)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div ref={chartContainerRef} className="w-full" />
                            </div>
                        </div>

                        {/* Stats Cards */}
                        {lastCandle && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                                {[
                                    { label: 'Open', value: formatPrice(lastCandle.open) },
                                    { label: 'High', value: formatPrice(lastCandle.high), accent: 'text-emerald-400' },
                                    { label: 'Low', value: formatPrice(lastCandle.low), accent: 'text-red-400' },
                                    { label: 'Close', value: formatPrice(lastCandle.close) },
                                    { label: 'Volume', value: lastCandle.volume.toLocaleString('en-IN') },
                                    {
                                        label: 'Change',
                                        value: `${isPositive ? '+' : ''}${priceChangePercent.toFixed(2)}%`,
                                        accent: isPositive ? 'text-emerald-400' : 'text-red-400',
                                    },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-[#1C2534]/60 rounded-xl border border-[#1E293B] p-4"
                                    >
                                        <div className="text-xs text-[#64748B] mb-1">{stat.label}</div>
                                        <div className={`text-sm font-semibold ${stat.accent || 'text-white'}`}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
