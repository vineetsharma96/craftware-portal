'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        setIsLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login?reset=success');
            }, 2500);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Establish New Password
                </h1>
                <p className="mt-2 text-xs font-mono text-zinc-400">
                    Create a secure credential for your CRAFTWARE enterprise account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                    {isSuccess ? (
                        <div className="text-center py-4">
                            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
                            <h2 className="text-base font-semibold text-zinc-100">Credentials Updated</h2>
                            <p className="mt-2 text-xs text-zinc-400 font-mono">
                                Your password has been changed. Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            {errorMsg && (
                                <div className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
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
                                        <Loader2 className="h-4 w-4 animate-spin" /> Committing Changes...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}