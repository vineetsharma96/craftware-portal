'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart-context';
import {
    Cpu,
    ShoppingCart,
    Menu,
    X,
    User,
    LogOut,
    ShieldCheck,
} from 'lucide-react';

const NAV_LINKS = [
    { name: 'Hardware', href: '/products' },
    { name: 'Track Order', href: '/track' },
    { name: 'Contact', href: '/contact' },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { openCart, totalItems } = useCart();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; id: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [mounted, setMounted] = useState(false);

    const checkAdminPrivileges = async () => {
        try {
            const res = await fetch('/api/admin/verify');
            if (res.ok) {
                const data = await res.json();
                setIsAdmin(Boolean(data.isAdmin));
            } else {
                setIsAdmin(false);
            }
        } catch {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        const supabase = createClient();

        // Check active session on initial mount
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser({ id: user.id, email: user.email });
                checkAdminPrivileges();
            } else {
                setIsAdmin(false);
            }
        });

        // Real-time auth state subscription
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email });
                checkAdminPrivileges();
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close mobile drawer upon route navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand Identity */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                        <Cpu className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                            CRAFTWARE
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                            Systems // B2B
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3.5 py-1.5 rounded-md transition-all ${isActive
                                        ? 'text-cyan-400 bg-cyan-950/30'
                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active-indicator"
                                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 rounded-full"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Action Controls: Cart & Account */}
                <div className="flex items-center gap-2.5">
                    {/* Cart Drawer Trigger */}
                    <button
                        onClick={openCart}
                        type="button"
                        aria-label="Open Procurement Cart"
                        className="relative flex items-center justify-center h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-cyan-400 font-mono text-[9px] font-bold text-zinc-950 shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Desktop Auth Controls */}
                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                        {user ? (
                            <div className="flex items-center gap-2 border-l border-zinc-800 pl-2.5">
                                {/* Standard Account Dashboard */}
                                <Link
                                    href="/account"
                                    title="Client Account Dashboard"
                                    className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 transition ${pathname === '/account'
                                            ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400'
                                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40'
                                        }`}
                                >
                                    <User className="h-3.5 w-3.5 text-cyan-400" />
                                    <span className="text-[11px]">Account</span>
                                </Link>

                                {/* Operations Console Link — Rendered ONLY for Admins */}
                                {isAdmin && (
                                    <Link
                                        href="/portal-admin"
                                        title="Admin Operations Console"
                                        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 transition ${pathname === '/portal-admin'
                                                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400'
                                                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40'
                                            }`}
                                    >
                                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                                        <span className="text-[11px]">Console</span>
                                    </Link>
                                )}

                                {/* Sign Out Trigger */}
                                <button
                                    onClick={handleSignOut}
                                    type="button"
                                    title="Sign Out"
                                    className="flex items-center justify-center h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-zinc-800 pl-2.5">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-400 transition"
                                >
                                    <User className="h-3.5 w-3.5 text-cyan-400" />
                                    <span>Sign In</span>
                                </Link>

                                <Link
                                    href="/register"
                                    className="flex items-center rounded-md bg-cyan-400 px-3 py-1.5 font-semibold text-zinc-950 hover:bg-cyan-300 transition"
                                >
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Trigger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        type="button"
                        aria-label="Toggle navigation menu"
                        className="md:hidden flex items-center justify-center h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white transition"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 overflow-hidden"
                    >
                        <div className="flex flex-col space-y-2 font-mono text-xs">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center justify-between p-2.5 rounded-md transition-colors ${isActive
                                                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20'
                                                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                                            }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                                    </Link>
                                );
                            })}

                            <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-900/80 text-zinc-200 border border-zinc-800 hover:border-cyan-500/40"
                                        >
                                            <User className="h-4 w-4 text-cyan-400" />
                                            <span>Client Account Dashboard</span>
                                        </Link>

                                        {/* Mobile Console Link — Rendered ONLY for Admins */}
                                        {isAdmin && (
                                            <Link
                                                href="/portal-admin"
                                                className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-900/80 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                                                <span>Admin Operations Console</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleSignOut}
                                            type="button"
                                            className="flex items-center justify-between p-2.5 rounded-md bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/30"
                                        >
                                            <span>Sign Out ({user.email})</span>
                                            <LogOut className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-1.5 p-2.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-cyan-500/40"
                                        >
                                            <User className="h-3.5 w-3.5 text-cyan-400" />
                                            <span>Sign In</span>
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center p-2.5 rounded-md bg-cyan-400 text-zinc-950 font-bold hover:bg-cyan-300"
                                        >
                                            <span>Register</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}