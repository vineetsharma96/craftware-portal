'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    Cpu,
    Package,
    RotateCcw,
} from 'lucide-react';

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
    } = useCart();

    // Backward-compatibility aliases for local variables
    const removeItem = removeFromCart;
    const totalIndicativeAmount = totalPrice;

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-12 text-zinc-100 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="border-b border-zinc-800/80 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Cpu className="h-4 w-4 text-cyan-400" />
                            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                                Procurement Staging
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Commercial Hardware Cart
                        </h1>
                        <p className="mt-1 text-xs font-mono text-zinc-400">
                            Review staged SKUs before generating an enterprise quotation or dispatching an RFQ.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-red-400 transition self-start sm:self-auto"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset Staged Items
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-4">
                        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-600" />
                        <h2 className="text-base font-bold font-mono text-zinc-300">
                            No hardware staged in your cart
                        </h2>
                        <p className="text-xs font-mono text-zinc-500 max-w-md mx-auto">
                            Your procurement manifest is empty. Explore our enterprise hardware catalog to stage units.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                            >
                                Browse Catalog <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Item Line Specifications */}
                        <div className="lg:col-span-8 space-y-3">
                            {items.map((item) => {
                                const { product, quantity } = item;
                                const imageSrc =
                                    (product as any).imageUrl ||
                                    (product as any).image ||
                                    ((product as any).images && (product as any).images[0]);

                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm hover:border-zinc-700 transition"
                                    >
                                        {/* Thumbnail & Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="relative h-16 w-16 shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center">
                                                {imageSrc ? (
                                                    <Image
                                                        src={imageSrc}
                                                        alt={product.name}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-6 w-6 text-zinc-600" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                                                    SKU: {product.sku}
                                                </span>
                                                <h3 className="font-semibold text-sm text-zinc-200 truncate">
                                                    {product.name}
                                                </h3>
                                                <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">
                                                    ${product.price.toFixed(2)}{' '}
                                                    <span className="text-[10px] text-zinc-500 font-normal">/ unit</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Controls & Line Total */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                                            <div className="flex items-center rounded-md border border-zinc-800 bg-zinc-950 p-1">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-9 text-center font-mono text-xs font-bold text-zinc-200">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <div className="text-right min-w-[80px]">
                                                <div className="text-xs font-mono font-bold text-zinc-100">
                                                    ${(product.price * quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeItem(product.id)}
                                                className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column: Indicative Valuation & RFQ Trigger */}
                        <div className="lg:col-span-4">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md space-y-5 sticky top-24">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                                        Order Telemetry
                                    </span>
                                    <span className="font-mono text-xs text-cyan-400">
                                        {totalItems} Units Staged
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs font-mono">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Baseline Hardware:</span>
                                        <span className="text-zinc-200">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Freight Assessment:</span>
                                        <span className="text-zinc-500">Calculated at RFQ</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Commercial Tariff:</span>
                                        <span className="text-zinc-500">Exempt / B2B</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline font-mono">
                                    <span className="text-xs uppercase text-zinc-400">Total Indicative:</span>
                                    <span className="text-xl font-bold text-cyan-400">
                                        ${totalIndicativeAmount.toFixed(2)}{' '}
                                        <span className="text-xs font-normal text-zinc-500">USD</span>
                                    </span>
                                </div>

                                <Link
                                    href="/contact"
                                    className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 py-3 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                >
                                    Request Official Quotation <ArrowRight className="h-3.5 w-3.5" />
                                </Link>

                                <div className="pt-2 text-[11px] font-mono text-zinc-500 flex items-start gap-2">
                                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>
                                        Staging an item locks current commercial pricing for 14 business days upon RFQ transmission.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}