'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { ArrowLeft, CheckCircle2, Shield, Plus, Minus, Check } from 'lucide-react';

export function ProductDetailClient({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem(product.id, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 mb-8 transition"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Hardware Catalog
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="font-mono text-xs text-zinc-500 uppercase">{product.sku}</span>
                            <span className="text-xs font-mono text-cyan-400">{product.category}</span>
                        </div>

                        <div className="relative aspect-4/3 w-full my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-800 pt-4">
                            <div className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4 text-cyan-400" /> Enterprise SLA
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Factory Calibrated
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${product.stockStatus === 'IN_STOCK'
                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                        }`}
                                >
                                    {product.stockStatus.replace('_', ' ')}
                                </span>
                            </div>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">{product.name}</h1>
                            <p className="mt-3 font-mono text-xl font-bold text-cyan-400">
                                ${product.price.toFixed(2)}{' '}
                                <span className="text-xs font-normal text-zinc-400 font-sans">
                                    indicative baseline price
                                </span>
                            </p>

                            <p className="mt-6 text-sm text-zinc-300 leading-relaxed font-normal">
                                {product.description}
                            </p>

                            <div className="mt-8 border-t border-zinc-800/80 pt-6">
                                <h2 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-4">
                                    Engineering Specifications
                                </h2>
                                <dl className="grid grid-cols-1 gap-2 text-xs">
                                    {Object.entries(product.specifications || {}).map(([key, val]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between border-b border-zinc-900 pb-2 font-mono"
                                        >
                                            <dt className="text-zinc-500">{key}</dt>
                                            <dd className="text-zinc-200 text-right">{val}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-zinc-800 rounded-md bg-zinc-900/60 self-start">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2.5 text-zinc-400 hover:text-white"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-10 text-center text-xs font-mono text-zinc-200 font-bold">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2.5 text-zinc-400 hover:text-white"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 py-3 font-mono text-xs font-semibold text-zinc-950 hover:bg-cyan-300 transition"
                            >
                                {added ? (
                                    <>
                                        <Check className="h-4 w-4" /> Added to Enquiry Cart
                                    </>
                                ) : (
                                    `Add ${quantity} Unit${quantity > 1 ? 's' : ''} to Enquiry Cart`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}