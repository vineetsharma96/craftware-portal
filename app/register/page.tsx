'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Mail,
    Lock,
    User,
    Building,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        company: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        if (formData.password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        const redirectUrl = `${window.location.origin}/auth/callback?next=/products`;

        const { data, error } = await supabase.auth.signUp({
            email: formData.email.trim(),
            password: formData.password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    full_name: formData.fullName.trim(),
                    company: formData.company.trim(),
                },
            },
        });

        setIsLoading(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        // When Supabase email confirmation is enabled, session is null until verified
        if (data?.user && !data?.session) {
            setIsEmailVerificationRequired(true);
        } else if (data?.session) {
            router.push('/products');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-16 sm:px-6 lg:px-8 text-zinc-100 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                        Enterprise Client Access
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Create Procurement Account
                </h1>
                <p className="mt-2 text-xs font-mono text-zinc-400">
                    Establish authenticated credentials for quotes, tracking telemetry, and volume orders.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                    {isEmailVerificationRequired ? (
                        <div className="text-center py-6 space-y-4">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                            <h2 className="text-lg font-bold text-white font-sans">
                                Verification Email Dispatched
                            </h2>
                            <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                                We sent a confirmation link to{' '}
                                <span className="text-cyan-400 font-semibold">{formData.email}</span>.
                            </p>
                            <p className="text-xs text-zinc-500">
                                Click the link in the message to activate your procurement account and log in.
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="/login"
                                    className="inline-block w-full rounded-md border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-mono text-zinc-200 hover:bg-zinc-700 transition"
                                >
                                    Return to Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            {errorMessage && (
                                <div className="flex items-center gap-2.5 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Alex Morgan"
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                                        Company
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Apex Systems"
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                                    Corporate Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="procurement@enterprise.com"
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                                    Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 8 characters"
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Repeat password"
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Provisioning Account...
                                    </>
                                ) : (
                                    <>
                                        Register Account <ArrowRight className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </button>

                            <div className="pt-4 border-t border-zinc-800/80 text-center">
                                <span className="text-xs font-mono text-zinc-500">
                                    Already have an authorized account?{' '}
                                </span>
                                <Link
                                    href="/login"
                                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}