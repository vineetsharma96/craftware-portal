'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        const supabase = createClient();
        const redirectUrl = `${window.location.origin}/auth/callback?next=/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: redirectUrl,
        });

        setIsLoading(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Account Login
                </Link>

                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Reset Portal Credentials
                </h1>
                <p className="mt-2 text-xs font-mono text-zinc-400">
                    Enter the corporate email associated with your CRAFTWARE client account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                    {isSubmitted ? (
                        <div className="text-center py-4">
                            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
                            <h2 className="text-base font-semibold text-zinc-100">Recovery Link Dispatched</h2>
                            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-mono">
                                If an account exists for <span className="text-cyan-400">{email}</span>, a secure one-time password reset link has been dispatched to your inbox.
                            </p>
                            <Link
                                href="/login"
                                className="mt-6 inline-block w-full rounded-md border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-mono text-zinc-200 hover:bg-zinc-700 transition"
                            >
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMessage && (
                                <div className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                    Account Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="procurement@enterprise.com"
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Transmitting Request...
                                    </>
                                ) : (
                                    'Send Password Reset Link'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}