'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderRecord, OrderStatus } from '@/types';
import { CONTACT_CONFIG } from '@/lib/contact';
import {
    Search,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    ExternalLink,
    ShieldCheck,
    ArrowRight,
    Package,
    Truck,
    FileText,
    Clock,
    MessageSquare,
    Phone,
} from 'lucide-react';

const TRACKING_STEPS: { status: OrderStatus; label: string; description: string }[] = [
    {
        status: 'ENQUIRY_RECEIVED',
        label: 'Enquiry Received',
        description: 'Hardware requirements logged and assigned to commercial desk.',
    },
    {
        status: 'QUOTATION_SENT',
        label: 'Quotation Dispatched',
        description: 'B2B price schedule and freight terms transmitted to buyer.',
    },
    {
        status: 'PROCESSING',
        label: 'Processing & Staging',
        description: 'Hardware reserved, serials allocated, and batch testing underway.',
    },
    {
        status: 'SHIPPED',
        label: 'In Transit',
        description: 'Consignment packaged and transferred to regional freight carrier.',
    },
    {
        status: 'DELIVERED',
        label: 'Delivered',
        description: 'Delivery confirmed and receipt acknowledged at client dock.',
    },
];

const STEP_ORDER_MAP: Record<OrderStatus, number> = {
    ENQUIRY_RECEIVED: 0,
    QUOTATION_SENT: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    CANCELLED: -1,
};

function TrackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refFromUrl = searchParams.get('ref') || '';

    const [orderNumber, setOrderNumber] = useState(refFromUrl);
    const [order, setOrder] = useState<OrderRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTracking = async (ref: string) => {
        if (!ref.trim()) return;
        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(ref.trim())}`);
            const contentType = res.headers.get('content-type') || '';

            if (!contentType.includes('application/json')) {
                throw new Error('Telemetry service unavailable. Please retry in a few moments.');
            }

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Order reference not found in procurement index.');
            }

            setOrder(data.data);
        } catch (err: any) {
            setError(err.message || 'Unable to retrieve consignment telemetry.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (refFromUrl) {
            setOrderNumber(refFromUrl);
            fetchTracking(refFromUrl);
        }
    }, [refFromUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;
        router.push(`/track?ref=${encodeURIComponent(orderNumber.trim())}`);
        fetchTracking(orderNumber.trim());
    };

    const currentStepIndex = order ? STEP_ORDER_MAP[order.status] ?? 0 : 0;
    const isCancelled = order?.status === 'CANCELLED';

    return (
        <div className="max-w-4xl mx-auto font-sans">
            {/* Header Banner */}
            <div className="border-b border-zinc-800/80 pb-6 mb-8 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                        {CONTACT_CONFIG.companyName} // Logistics Telemetry
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Hardware Order Tracking
                </h1>
                <p className="mt-2 text-xs font-mono text-zinc-400">
                    Inspect consignment milestone progress, allocated line items, and fulfillment stages in real time.
                </p>
            </div>

            {/* Query Bar */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            required
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="e.g. CW-284910-482"
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 pl-10 pr-4 py-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition uppercase"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 py-3 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Querying...
                            </>
                        ) : (
                            <>
                                Track Consignment <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Error Feedback */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-xs font-mono text-red-400 mb-8">
                    <AlertTriangle className="mx-auto h-8 w-8 text-red-400 mb-2" />
                    <p className="font-semibold text-sm">{error}</p>
                    <p className="text-zinc-500 mt-1">
                        Verify the order reference code in your quotation confirmation email or contact the desk.
                    </p>
                </div>
            )}

            {/* Telemetry Output Card */}
            {order && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Status & Milestones Card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
                            <div>
                                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                                    Consignment Reference
                                </span>
                                <h2 className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                                    {order.order_number}
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Recipient Account:{' '}
                                    <span className="text-zinc-200 font-medium">
                                        {order.guest_name || 'Commercial Account'}
                                    </span>
                                </p>
                            </div>

                            <div className="sm:text-right">
                                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                                    Logged Timestamp
                                </span>
                                <div className="text-xs font-mono text-zinc-300 mt-0.5">
                                    {new Date(order.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-medium ${isCancelled
                                                ? 'border-red-500/40 bg-red-500/10 text-red-400'
                                                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                                            }`}
                                    >
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stepper Pipeline */}
                        {isCancelled ? (
                            <div className="py-8 text-center text-xs font-mono text-red-400">
                                <AlertTriangle className="mx-auto h-8 w-8 mb-2 text-red-400" />
                                This procurement request has been flagged as CANCELLED. Reach out to commercial support to re-open or adjust requirements.
                            </div>
                        ) : (
                            <div className="pt-8 pb-4">
                                <div className="relative">
                                    {/* Background Track */}
                                    <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-zinc-800 -z-0" />
                                    {/* Animated Progress Bar */}
                                    <div
                                        className="hidden md:block absolute top-4 left-6 h-0.5 bg-cyan-400 transition-all duration-500 -z-0"
                                        style={{
                                            width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 90}%`,
                                        }}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                                        {TRACKING_STEPS.map((step, idx) => {
                                            const isComplete = currentStepIndex > idx;
                                            const isCurrent = currentStepIndex === idx;

                                            return (
                                                <div key={step.status} className="flex md:flex-col items-start gap-4 md:gap-2">
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-mono transition-all ${isComplete
                                                                ? 'border-cyan-400 bg-cyan-400 text-zinc-950'
                                                                : isCurrent
                                                                    ? 'border-cyan-400 bg-zinc-950 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                                                                    : 'border-zinc-800 bg-zinc-900 text-zinc-600'
                                                            }`}
                                                    >
                                                        {isComplete ? (
                                                            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                                                        ) : (
                                                            <span>{idx + 1}</span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p
                                                            className={`text-xs font-mono font-semibold ${isCurrent
                                                                    ? 'text-cyan-400'
                                                                    : isComplete
                                                                        ? 'text-zinc-200'
                                                                        : 'text-zinc-500'
                                                                }`}
                                                        >
                                                            {step.label}
                                                        </p>
                                                        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Line Items Breakdown */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-cyan-400" /> Consignment Line Specifications
                            </span>
                            <span className="text-xs font-mono text-zinc-500">
                                {order.order_items?.length || 0} Distinct Hardware Units
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-zinc-950/40 text-zinc-500 uppercase border-b border-zinc-800/80">
                                    <tr>
                                        <th className="py-3 px-6">Hardware Item</th>
                                        <th className="py-3 px-6">SKU</th>
                                        <th className="py-3 px-6 text-center">Allocated Units</th>
                                        <th className="py-3 px-6 text-right">Unit Baseline</th>
                                        <th className="py-3 px-6 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.map((item) => (
                                            <tr key={item.id} className="hover:bg-zinc-900/40 transition">
                                                <td className="py-4 px-6 font-medium text-zinc-200">
                                                    {item.product_name_snapshot}
                                                </td>
                                                <td className="py-4 px-6 text-zinc-500 uppercase">{item.sku_snapshot}</td>
                                                <td className="py-4 px-6 text-center font-bold text-cyan-400">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-4 px-6 text-right text-zinc-400">
                                                    ${Number(item.price_snapshot).toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-zinc-200">
                                                    ${(Number(item.price_snapshot) * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-zinc-500">
                                                No snapshot items attached to this inquiry.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="border-t border-zinc-800 bg-zinc-950/40">
                                    <tr>
                                        <td colSpan={4} className="py-4 px-6 text-right text-xs font-mono text-zinc-400 uppercase">
                                            Indicative Valuation Total:
                                        </td>
                                        <td className="py-4 px-6 text-right font-mono text-base font-bold text-cyan-400">
                                            ${Number(order.total_indicative_amount).toFixed(2)} USD
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Dynamic Contact & Logistics Escalation Footer */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                        <div className="space-y-1 text-center sm:text-left">
                            <span className="font-semibold text-zinc-200 block">
                                Require priority freight escalation or consignment changes?
                            </span>
                            <span className="text-zinc-500 text-[11px] block">
                                Direct Line: {CONTACT_CONFIG.phone} &bull; {CONTACT_CONFIG.hours}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href={CONTACT_CONFIG.getWhatsAppUrl(
                                    `Hello ${CONTACT_CONFIG.companyName}, inquiring about order status for reference ${order.order_number}`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition font-semibold"
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                WhatsApp Desk <ExternalLink className="h-3 w-3" />
                            </a>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                Submit Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-12 text-zinc-100">
            <Suspense
                fallback={
                    <div className="max-w-4xl mx-auto py-24 text-center text-xs font-mono text-zinc-500">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-cyan-400 mb-2" />
                        Connecting to tracking telemetry gateway...
                    </div>
                }
            >
                <TrackContent />
            </Suspense>
        </div>
    );
}