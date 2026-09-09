import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { OrderRecord } from '@/types';

const ORDER_STEPS = [
    { key: 'ENQUIRY_RECEIVED', label: 'Enquiry Received' },
    { key: 'QUOTATION_SENT', label: 'Quotation Sent' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
];

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/login?redirectTo=/account/orders/${orderId}`);

    const { data: order } = await supabase
        .from('orders')
        .select(`
      id,
      order_number,
      status,
      total_indicative_amount,
      message,
      created_at,
      order_items (
        id,
        product_id,
        product_name_snapshot,
        sku_snapshot,
        quantity,
        price_snapshot
      )
    `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

    if (!order) notFound();

    const typedOrder = order as unknown as OrderRecord;
    const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === typedOrder.status);

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Account
                </Link>

                <div className="border-b border-zinc-800/80 pb-6 flex justify-between items-end">
                    <div>
                        <span className="font-mono text-xs text-zinc-500 uppercase">Docket Ref</span>
                        <h1 className="text-2xl font-bold text-white mt-0.5">{typedOrder.order_number}</h1>
                        <p className="text-xs font-mono text-zinc-400 mt-1">
                            {new Date(typedOrder.created_at).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Baseline Valuation</span>
                        <p className="font-mono text-xl font-bold text-cyan-400">
                            ${Number(typedOrder.total_indicative_amount).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2">
                        {ORDER_STEPS.map((step, idx) => {
                            const isPast = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;

                            return (
                                <div key={step.key} className="flex-1 flex flex-row md:flex-col items-center gap-3">
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs border ${isPast
                                                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                                                : 'border-zinc-800 bg-zinc-900 text-zinc-600'
                                            }`}
                                    >
                                        {isPast ? <Check className="h-4 w-4" /> : idx + 1}
                                    </div>
                                    <p
                                        className={`text-xs font-mono ${isCurrent ? 'text-cyan-400 font-bold' : isPast ? 'text-zinc-200' : 'text-zinc-600'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Snapshot Items List */}
                <div className="mt-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                    <div className="divide-y divide-zinc-900 font-mono text-xs">
                        {typedOrder.order_items?.map((item) => (
                            <div key={item.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-zinc-200 font-semibold">{item.product_name_snapshot}</p>
                                    <p className="text-zinc-500 text-[11px]">{item.sku_snapshot}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-300">
                                        {item.quantity} × ${Number(item.price_snapshot).toFixed(2)}
                                    </p>
                                    <p className="text-cyan-400 font-bold">
                                        ${(item.quantity * Number(item.price_snapshot)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}