'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OrderRecord, OrderStatus } from '@/types';
import {
    ShieldCheck,
    Search,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = [
    'ENQUIRY_RECEIVED',
    'QUOTATION_SENT',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
];

const STATUS_COLORS: Record<OrderStatus, { text: string; bg: string; border: string }> = {
    ENQUIRY_RECEIVED: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    QUOTATION_SENT: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    PROCESSING: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    SHIPPED: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    OUT_FOR_DELIVERY: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    DELIVERED: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    CANCELLED: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export default function AdminPortalPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/admin/orders');

            if (res.status === 401 || res.status === 403) {
                router.push('/login?error=AccessDenied');
                return;
            }

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error(
                    `Expected JSON from /api/admin/orders, but received status ${res.status} (${contentType || 'unknown'}). Verify route path.`
                );
            }

            const data = await res.json();
            if (data.success) {
                setOrders(data.data || []);
            } else {
                setErrorMessage(data.error || 'Failed to load telemetry orders.');
            }
        } catch (err: any) {
            console.error('[PORTAL FETCH ERROR]:', err);
            setErrorMessage(err.message || 'Network exception when retrieving orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingId(orderId);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error(`Server returned HTTP ${res.status} without JSON body.`);
            }

            const data = await res.json();
            if (data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
                );
            } else {
                setErrorMessage(data.error || 'Failed to update order status.');
            }
        } catch (err: any) {
            console.error('[PORTAL UPDATE ERROR]:', err);
            setErrorMessage(err.message || 'Network error when updating status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesSearch =
                o.order_number.toLowerCase().includes(search.toLowerCase()) ||
                (o.guest_email && o.guest_email.toLowerCase().includes(search.toLowerCase())) ||
                (o.guest_name && o.guest_name.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800/80 pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-cyan-400" />
                            <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
                                Operations Console // Order Tracking
                            </h1>
                        </div>
                        <p className="mt-1 text-xs font-mono text-zinc-400">
                            Update procurement statuses, inspect line-items, and trigger automated buyer notices.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="self-start md:self-auto flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Sync Orders
                    </button>
                </div>

                {errorMessage && (
                    <div className="mt-6 flex items-center gap-3 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-xs font-mono text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search reference, email, customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-xs font-mono text-zinc-500">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300 focus:border-cyan-400 focus:outline-none"
                        >
                            <option value="ALL">All Statuses ({orders.length})</option>
                            {STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>
                                    {st.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                                <tr>
                                    <th className="py-3 px-4">Order Ref</th>
                                    <th className="py-3 px-4">Customer Details</th>
                                    <th className="py-3 px-4">Line Items</th>
                                    <th className="py-3 px-4">Total</th>
                                    <th className="py-3 px-4">Tracking Status</th>
                                    <th className="py-3 px-4 text-right">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-zinc-500">
                                            {loading ? 'Reading telemetry from database...' : 'No orders found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((ord) => {
                                        const style = STATUS_COLORS[ord.status] || STATUS_COLORS.ENQUIRY_RECEIVED;
                                        const isUpdating = updatingId === ord.id;

                                        return (
                                            <tr key={ord.id} className="hover:bg-zinc-900/40 transition">
                                                <td className="py-4 px-4 align-top font-bold text-cyan-400">
                                                    {ord.order_number}
                                                    <div className="text-[10px] text-zinc-500 font-normal mt-0.5">
                                                        {new Date(ord.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 align-top">
                                                    <div className="font-sans font-medium text-zinc-200">
                                                        {ord.guest_name || 'Anonymous User'}
                                                    </div>
                                                    <div className="text-zinc-500 text-[11px]">{ord.guest_email}</div>
                                                    {ord.guest_phone && (
                                                        <div className="text-zinc-500 text-[10px]">{ord.guest_phone}</div>
                                                    )}
                                                </td>

                                                <td className="py-4 px-4 align-top">
                                                    {ord.order_items && ord.order_items.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {ord.order_items.map((item) => (
                                                                <div key={item.id} className="text-[11px]">
                                                                    <span className="text-zinc-400">{item.quantity}x</span>{' '}
                                                                    <span className="text-zinc-200 font-sans">
                                                                        {item.product_name_snapshot}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-zinc-600">No snapshot items</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-4 align-top font-bold text-zinc-100">
                                                    ${ord.total_indicative_amount.toFixed(2)}
                                                </td>

                                                <td className="py-4 px-4 align-top">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] ${style.bg} ${style.border} ${style.text}`}
                                                    >
                                                        {ord.status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 align-top text-right">
                                                    <select
                                                        disabled={isUpdating}
                                                        value={ord.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(ord.id, e.target.value as OrderStatus)
                                                        }
                                                        className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:border-cyan-400 focus:outline-none transition disabled:opacity-50"
                                                    >
                                                        {STATUS_OPTIONS.map((st) => (
                                                            <option key={st} value={st}>
                                                                {st.replace(/_/g, ' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}