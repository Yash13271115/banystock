import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import BanyaStockLogo from '../../components/BanyaStockLogo';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'yash.prajapati@banystock.com',
        password: 'bany@1115',
        remember: true,
    });

    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onError: () => {
                setLoginSuccess(false);
            },
            onSuccess: () => {
                setLoginSuccess(true);
            },
        });
    };

    const handleFillDemo = () => {
        setData({
            email: 'yash.prajapati@banystock.com',
            password: 'bany@1115',
            remember: true,
        });
    };

    return (
        <>
            <Head title="Sign In - BanyaStock CRM Portal" />

            <div className="min-h-screen bg-[#111823] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E5B246]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md space-y-6 relative z-10">
                    {/* Header Logo & Title */}
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <BanyaStockLogo className="scale-110" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white">
                                Welcome Back
                            </h1>
                            <p className="text-xs text-[#94A3B8] mt-1">
                                Enter your credentials to access the BanyaStock CRM Portal.
                            </p>
                        </div>
                    </div>

                    {/* Pre-filled Account Card */}
                    <div className="p-3.5 rounded-xl bg-[#222D3E]/60 border border-[#222D3E] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                            <ShieldCheck size={18} className="text-[#E5B246] shrink-0" />
                            <div>
                                <span className="text-slate-300 font-semibold block">Configured Admin Credentials</span>
                                <span className="text-[#94A3B8] text-[11px]">yash.prajapati@banystock.com</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleFillDemo}
                            className="px-2.5 py-1 rounded-lg bg-[#E5B246]/20 text-[#E5B246] hover:bg-[#E5B246] hover:text-[#111823] text-[11px] font-bold transition-all"
                        >
                            Auto-Fill
                        </button>
                    </div>

                    {/* Login Card */}
                    <div className="p-6 rounded-2xl bg-[#1C2534] border border-[#222D3E] shadow-2xl space-y-5">
                        {loginSuccess && (
                            <div className="p-3 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold flex items-center gap-2">
                                <CheckCircle2 size={16} /> Authenticated successfully! Redirecting...
                            </div>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold flex items-center gap-2">
                                <AlertCircle size={16} /> Invalid credentials. Please check your email and password.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="yash.prajapati@banystock.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#222D3E] border border-[#222D3E] rounded-xl text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#E5B246] transition-colors"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-[#EF4444] mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-300 block">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#222D3E] border border-[#222D3E] rounded-xl text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#E5B246] transition-colors"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-[#EF4444] mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#94A3B8]">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded bg-[#222D3E] border-[#222D3E] text-[#E5B246] focus:ring-0 cursor-pointer"
                                    />
                                    <span>Keep me signed in</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-[#E5B246] hover:bg-[#E5B246]/90 text-[#111823] text-sm font-bold transition-all shadow-lg shadow-[#E5B246]/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                            >
                                {processing ? (
                                    <span>Authenticating...</span>
                                ) : (
                                    <>
                                        <span>Sign In to CRM Portal</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Copyright */}
                    <div className="text-center text-[11px] text-[#94A3B8]">
                        &copy; 2026 BanyaStock CRM Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}
