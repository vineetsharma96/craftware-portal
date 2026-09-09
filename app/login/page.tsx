'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isResetSuccess = searchParams.get('reset') === 'success';
    const urlError = searchParams.get('error');
    const redirectTo = searchParams.get('redirectTo') || '/products';

    const getInitialErrorMessage = () => {
        if (urlError === 'AccessDenied') {
            return 'Access denied. Your authenticated account does not possess administrative privileges.';
        }
        if (urlError === 'InvalidOrExpiredResetLink') {
            return 'The password reset link was invalid or has expired. Please submit a new request.';
        }
        return null;
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(getInitialErrorMessage());

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        setIsLoading(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            router.push(redirectTo);
            router.refresh();
        }
    };

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-8 shadow-2xl font-sans">
            {/* Reset Password Success Banner */}
            {isResetSuccess && (
                <div className="mb-6 flex items-start gap-2.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Password successfully updated. Sign in with your new credentials below.</span>
                </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
                <div className="mb-6 flex items-start gap-2.5 rounded-md border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-400 font-mono">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Work Email Address
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

                {/* Password Field + Forgot Password Link */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-mono text-zinc-400 uppercase">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 hover:underline transition"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Authenticating Session...
                        </>
                    ) : (
                        <>
                            Sign In to Commercial Portal <ArrowRight className="h-3.5 w-3.5" />
                        </>
                    )}
                </button>

                {/* Registration Link */}
                <div className="pt-4 border-t border-zinc-800/80 text-center">
                    <span className="text-xs font-mono text-zinc-500">
                        Need a B2B procurement account?{' '}
                    </span>
                    <Link
                        href="/register"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                    >
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-16 sm:px-6 lg:px-8 text-zinc-100 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                        CRAFTWARE Systems
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Commercial Portal Sign In
                </h1>
                <p className="mt-2 text-xs font-mono text-zinc-400">
                    Access your quotation history, tracking telemetry, and verified B2B price schedules.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <Suspense
                    fallback={
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-xs font-mono text-zinc-500">
                            <Loader2 className="mx-auto h-5 w-5 animate-spin text-cyan-400 mb-2" />
                            Initializing authentication gateway...
                        </div>
                    }
                >
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}