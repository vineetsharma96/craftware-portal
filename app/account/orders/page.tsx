import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { OrderRecord } from '@/types';

export default async function OrdersHistoryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirectTo=/account/orders');
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, status, total_indicative_amount, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const typedOrders = (orders as OrderRecord[]) || [];

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Account Summary
                </Link>

                <h1 className="text-2xl font-bold text-white mb-6">Historical Quotations & Orders</h1>

                {typedOrders.length === 0 ? (
                    <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-12 text-center">
                        <Package className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-400">No previous dockets on record.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {typedOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm font-semibold text-zinc-200">
                                            {order.order_number}
                                        </span>
                                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p className="mt-1 font-mono text-xs text-zinc-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-sm font-bold text-cyan-400">
                                        ${Number(order.total_indicative_amount).toFixed(2)}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-zinc-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}