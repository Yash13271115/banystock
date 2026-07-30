import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
    TrendingUp, 
    Briefcase, 
    Star, 
    Newspaper, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    SlidersHorizontal,
    LogOut,
    Building2,
    Check
} from 'lucide-react';
import BanyaStockLogo from './BanyaStockLogo';

interface AppSidebarProps {
    currentPath?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
    currentPath = 'market',
    collapsed = false,
    onToggleCollapse,
}) => {
    const { auth } = usePage<{ auth?: { user?: { name: string; email: string } } }>().props;
    const user = auth?.user;

    const userName = user?.name || 'Yash Prajapati';
    const userEmail = user?.email || 'yash.prajapati@banystock.com';
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const [activeTab, setActiveTab] = useState(currentPath);
    const [workspaceOpen, setWorkspaceOpen] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState('Global Equity CRM');

    const workspaces = [
        'Global Equity CRM',
        'Crypto Portfolio',
        'Venture Capital Hub',
        'Institutional Trading'
    ];

    const navItems = [
        { id: 'market', label: 'Market', icon: TrendingUp, count: null },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, count: '12' },
        { id: 'watchlist', label: 'Watchlist', icon: Star, count: '24' },
        { id: 'news', label: 'News', icon: Newspaper, count: '5' },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <aside
            className={`flex flex-col h-screen border-r border-[#222D3E] bg-[#1C2534] text-white transition-all duration-300 relative z-30 select-none ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Header: Brand Logo & Workspace Switcher */}
            <div className="p-4 border-b border-[#222D3E] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <BanyaStockLogo collapsed={collapsed} />
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-1.5 rounded-lg hover:bg-[#222D3E] text-[#94A3B8] hover:text-white transition-colors"
                            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    )}
                </div>

                {/* Workspace Selector Dropdown */}
                {!collapsed && (
                    <div className="relative mt-1">
                        <button
                            onClick={() => setWorkspaceOpen(!workspaceOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#222D3E]/70 hover:bg-[#222D3E] border border-[#222D3E] text-xs font-medium text-slate-200 transition-colors"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Building2 size={14} className="text-[#E5B246] shrink-0" />
                                <span className="truncate">{selectedWorkspace}</span>
                            </div>
                            <ChevronDown size={14} className={`text-[#94A3B8] transition-transform ${workspaceOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {workspaceOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-[#1C2534] border border-[#222D3E] rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                {workspaces.map((ws) => (
                                    <button
                                        key={ws}
                                        onClick={() => {
                                            setSelectedWorkspace(ws);
                                            setWorkspaceOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#222D3E] transition-colors"
                                    >
                                        <span className={selectedWorkspace === ws ? 'text-[#E5B246] font-semibold' : 'text-slate-300'}>
                                            {ws}
                                        </span>
                                        {selectedWorkspace === ws && <Check size={14} className="text-[#E5B246]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    {!collapsed && 'Main Menu'}
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? 'bg-[#222D3E] text-[#E5B246] shadow-sm font-semibold border-l-4 border-[#E5B246]'
                                    : 'text-[#94A3B8] hover:bg-[#222D3E]/50 hover:text-white'
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    size={20}
                                    className={`shrink-0 transition-colors ${
                                        isActive ? 'text-[#E5B246]' : 'text-[#94A3B8] group-hover:text-white'
                                    }`}
                                />
                                {!collapsed && <span>{item.label}</span>}
                            </div>

                            {!collapsed && item.count && (
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                        isActive
                                            ? 'bg-[#E5B246]/20 text-[#E5B246]'
                                            : 'bg-[#222D3E] text-[#94A3B8]'
                                    }`}
                                >
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}

                <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    {!collapsed && 'Tools'}
                </div>

                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeTab === 'settings'
                            ? 'bg-[#222D3E] text-[#E5B246] border-l-4 border-[#E5B246]'
                            : 'text-[#94A3B8] hover:bg-[#222D3E]/50 hover:text-white'
                    }`}
                >
                    <SlidersHorizontal size={20} className="shrink-0 text-[#94A3B8]" />
                    {!collapsed && <span>Settings</span>}
                </button>
            </nav>

            {/* User Profile Footer */}
            <div className="p-3 border-t border-[#222D3E] bg-[#111823]/40">
                <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#222D3E]/60 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#E5B246]/20 border border-[#E5B246]/50 flex items-center justify-center text-[#E5B246] font-bold text-sm shrink-0 shadow-inner">
                            {initials}
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-xs font-semibold text-white truncate">{userName}</span>
                                <span className="text-[10px] text-[#94A3B8] truncate">{userEmail}</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AppSidebar;
