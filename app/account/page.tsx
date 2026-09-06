'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OrderRecord, OrderStatus } from '@/types';
import {
    User,
    Building,
    Mail,
    Phone,
    Package,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    ShieldCheck,
    Clock,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';

const STATUS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
    ENQUIRY_RECEIVED: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    QUOTATION_SENT: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    PROCESSING: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    SHIPPED: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    OUT_FOR_DELIVERY: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    DELIVERED: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    CANCELLED: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export default function AccountDashboardPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [profileData, setProfileData] = useState({
        fullName: '',
        company: '',
        phone: '',
    });

    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
        type: null,
        message: '',
    });

    const loadUserData = async () => {
        setLoading(true);
        const {
            data: { user },
            error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
            router.push('/login?redirectTo=/account');
            return;
        }

        setUserEmail(user.email || '');
        setProfileData({
            fullName: user.user_metadata?.full_name || '',
            company: user.user_metadata?.company || '',
            phone: user.user_metadata?.phone || '',
        });

        setLoading(false);
        fetchUserOrders(user.id, user.email || '');
    };

    const fetchUserOrders = async (userId: string, email: string) => {
        setOrdersLoading(true);
        try {
            // Look up orders linked to user ID or matching guest email
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .or(`user_id.eq.${userId},guest_email.eq.${email}`)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setOrders(data as OrderRecord[]);
            }
        } catch (err) {
            console.error('[ACCOUNT ORDERS QUERY ERROR]:', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setFeedback({ type: null, message: '' });

        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: profileData.fullName.trim(),
                company: profileData.company.trim(),
                phone: profileData.phone.trim(),
            },
        });

        setIsSavingProfile(false);

        if (error) {
            setFeedback({ type: 'error', message: error.message });
        } else {
            setFeedback({ type: 'success', message: 'Corporate credentials updated successfully.' });
            setTimeout(() => setFeedback({ type: null, message: '' }), 4000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 flex items-center justify-center font-mono text-xs text-zinc-500">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400 mr-2" />
                Synchronizing authenticated buyer session...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-12 text-zinc-100 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="h-4 w-4 text-cyan-400" />
                            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                                Corporate Client Operations
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Procurement Account Overview
                        </h1>
                        <p className="mt-1 text-xs font-mono text-zinc-400">
                            Manage organization billing parameters and view active logistics telemetry.
                        </p>
                    </div>

                    <button
                        onClick={() => fetchUserOrders('', userEmail)}
                        disabled={ordersLoading}
                        className="self-start md:self-auto flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                        Refresh Telemetry
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Organization & Profile Details */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md sticky top-24">
                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-200 mb-4 pb-2 border-b border-zinc-800">
                                Client Profile
                            </h2>

                            {feedback.message && (
                                <div
                                    className={`mb-4 flex items-start gap-2 rounded-md p-3 text-xs font-mono border ${feedback.type === 'success'
                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                            : 'border-red-500/40 bg-red-500/10 text-red-400'
                                        }`}
                                >
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    )}
                                    <span>{feedback.message}</span>
                                </div>
                            )}

                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                        Primary Account Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                                        <input
                                            type="email"
                                            disabled
                                            value={userEmail}
                                            className="w-full rounded-md border border-zinc-800/80 bg-zinc-950/60 pl-9 pr-3 py-2 text-xs font-mono text-zinc-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                        Contact Representative *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            type="text"
                                            required
                                            value={profileData.fullName}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, fullName: e.target.value })
                                            }
                                            placeholder="Alex Morgan"
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                        Organization / Company
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={profileData.company}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, company: e.target.value })
                                            }
                                            placeholder="Apex Systems Ltd."
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                        Direct Phone Line
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, phone: e.target.value })
                                            }
                                            placeholder="+1 (555) 019-2834"
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                                >
                                    {isSavingProfile ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Committing...
                                        </>
                                    ) : (
                                        'Save Account Details'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order History & Telemetry Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-200">
                                Consignment History ({orders.length})
                            </h2>
                            <span className="text-[11px] font-mono text-zinc-500">
                                Live Supabase Telemetry
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
                                <Package className="mx-auto h-8 w-8 text-zinc-600" />
                                <h3 className="text-sm font-semibold font-mono text-zinc-300">
                                    No procurement records logged
                                </h3>
                                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                    Enquiries created with this account email will automatically register here.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-md bg-cyan-400 text-zinc-950 font-mono text-xs font-semibold hover:bg-cyan-300 transition"
                                >
                                    Browse Hardware Catalog <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ) : (
                            orders.map((ord) => {
                                const style = STATUS_COLORS[ord.status] || STATUS_COLORS.ENQUIRY_RECEIVED;
                                const totalUnits =
                                    ord.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

                                return (
                                    <div
                                        key={ord.id}
                                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm hover:border-zinc-700 transition"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/60 gap-2">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                                                    Reference
                                                </span>
                                                <div className="font-mono text-sm font-bold text-cyan-400">
                                                    {ord.order_number}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono ${style.bg} ${style.border} ${style.text}`}
                                                >
                                                    {ord.status.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs font-mono text-zinc-500">
                                                    {new Date(ord.created_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Snapshot Line Items */}
                                        <div className="py-3">
                                            {ord.order_items && ord.order_items.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    {ord.order_items.slice(0, 3).map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between text-xs font-mono"
                                                        >
                                                            <span className="text-zinc-300 truncate max-w-[280px] sm:max-w-md">
                                                                {item.quantity}x {item.product_name_snapshot}
                                                            </span>
                                                            <span className="text-zinc-500">
                                                                ${(item.price_snapshot * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {ord.order_items.length > 3 && (
                                                        <div className="text-[11px] font-mono text-zinc-500 pt-1">
                                                            + {ord.order_items.length - 3} additional SKU(s)
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-xs font-mono text-zinc-500">
                                                    Enquiry notes: {ord.message || 'Standard hardware RFQ'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer / Telemetry Navigation */}
                                        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                                            <div>
                                                <span className="text-zinc-500">Total Estimate: </span>
                                                <span className="font-bold text-zinc-200">
                                                    ${ord.total_indicative_amount.toFixed(2)} USD
                                                </span>
                                                <span className="text-zinc-500 ml-2">({totalUnits} units)</span>
                                            </div>

                                            <Link
                                                href={`/track?ref=${encodeURIComponent(ord.order_number)}`}
                                                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 hover:underline"
                                            >
                                                Track Milestone <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}