'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalIndicativeAmount, setIsOpen } = useCart();

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-6 transition"
                >
                    <ArrowLeft className="h-3 w-3" /> Continue Browsing Catalog
                </Link>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">B2B Enquiry Docket</h1>

                {items.length === 0 ? (
                    <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-12 text-center">
                        <p className="text-sm text-zinc-400">No hardware references loaded into current cart.</p>
                        <Link
                            href="/products"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                        >
                            Inspect Catalog <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-3">
                            {items.map(({ productId, quantity, product }) => (
                                <div
                                    key={productId}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <h2 className="text-sm font-semibold text-zinc-200">{product.name}</h2>
                                        <p className="text-xs font-mono text-zinc-500">{product.sku}</p>
                                        <p className="text-xs text-cyan-400 font-mono mt-1">
                                            ${product.price.toFixed(2)} baseline
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                                            <button
                                                onClick={() => updateQuantity(productId, quantity - 1)}
                                                className="p-1.5 text-zinc-400 hover:text-white"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-mono text-zinc-200">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(productId, quantity + 1)}
                                                className="p-1.5 text-zinc-400 hover:text-white"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(productId)}
                                            className="p-1.5 text-zinc-500 hover:text-rose-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 h-fit">
                            <span className="text-xs font-mono text-zinc-500 uppercase">Docket Valuation</span>
                            <p className="text-2xl font-bold font-mono text-cyan-400 mt-1 mb-6">
                                ${totalIndicativeAmount.toFixed(2)}
                            </p>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="w-full rounded bg-cyan-400 py-3 font-mono text-xs font-semibold text-zinc-950 hover:bg-cyan-300 transition"
                            >
                                Open Quotation Drawer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}