'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import {
    Search,
    ShoppingCart,
    Check,
    Cpu,
    Package,
} from 'lucide-react';

export default function ProductsPage() {
    const { addItem } = useCart();
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [addedSku, setAddedSku] = useState<string | null>(null);

    const handleQuickAdd = (p: Product) => {
        addItem(p, 1);
        setAddedSku(p.sku);
        setTimeout(() => setAddedSku(null), 1500);
    };

    const categories = useMemo(() => {
        const list = Array.from(new Set(PRODUCTS.map((p) => p.category)));
        return ['ALL', ...list];
    }, []);

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter((product) => {
            const matchesCategory =
                selectedCategory === 'ALL' || product.category === selectedCategory;
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-12 text-zinc-100 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="border-b border-zinc-800/80 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Cpu className="h-4 w-4 text-cyan-400" />
                            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                                Hardware Infrastructure
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Enterprise Catalog
                        </h1>
                        <p className="mt-1 text-xs font-mono text-zinc-400">
                            Verified commercial specifications, volume peripherals, and connectivity docks.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-500">
                            {filteredProducts.length} Hardware Units Displayed
                        </span>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition uppercase ${isSelected
                                            ? 'bg-cyan-400 text-zinc-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                                            : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by SKU, name, switch..."
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 py-20 text-center text-xs font-mono text-zinc-500">
                        No hardware components match the specified filter criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((p) => {
                            const isAdded = addedSku === p.sku;
                            // Detect image property variant safely
                            const imageSrc =
                                (p as any).imageUrl ||
                                (p as any).image ||
                                ((p as any).images && (p as any).images[0]);

                            return (
                                <div
                                    key={p.id}
                                    className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700 hover:bg-zinc-900/50 backdrop-blur-sm transition duration-200"
                                >
                                    <div>
                                        {/* Visual Product Showcase */}
                                        <div className="relative w-full aspect-[16/10] mb-4 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                                            {imageSrc ? (
                                                <Image
                                                    src={imageSrc}
                                                    alt={p.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-zinc-600 gap-2">
                                                    <Package className="h-8 w-8 stroke-[1.5]" />
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                                                        Telemetry Preview
                                                    </span>
                                                </div>
                                            )}

                                            {/* Stock Badge Overlay */}
                                            <span className="absolute top-2.5 right-2.5 font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-cyan-400 backdrop-blur-md">
                                                {p.stockStatus || 'IN STOCK'}
                                            </span>
                                        </div>

                                        {/* Metadata Header */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 border border-zinc-800 bg-zinc-950 px-2 py-0.5 rounded">
                                                {p.category}
                                            </span>
                                            <span className="font-mono text-[10px] text-zinc-400">
                                                SKU: {p.sku}
                                            </span>
                                        </div>

                                        {/* Title & Short Description */}
                                        <h2 className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                                            {p.name}
                                        </h2>
                                        <p className="mt-1.5 text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                                            {p.shortDescription}
                                        </p>

                                        {/* Hardware Specifications Snapshot */}
                                        {p.specifications && (
                                            <div className="mt-4 pt-3 border-t border-zinc-800/60 space-y-1.5">
                                                {Object.entries(p.specifications)
                                                    .slice(0, 3)
                                                    .map(([key, val]) => (
                                                        <div
                                                            key={key}
                                                            className="flex items-center justify-between text-[11px] font-mono"
                                                        >
                                                            <span className="text-zinc-500 capitalize">{key}:</span>
                                                            <span className="text-zinc-300 font-medium">{String(val)}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing & Add Trigger */}
                                    <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase">
                                                Baseline Unit
                                            </div>
                                            <div className="text-base font-bold font-mono text-cyan-400">
                                                ${p.price.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuickAdd(p)}
                                                disabled={isAdded}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition ${isAdded
                                                        ? 'bg-emerald-500 text-zinc-950'
                                                        : 'bg-zinc-800 hover:bg-cyan-400 hover:text-zinc-950 text-zinc-200'
                                                    }`}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5 stroke-[2.5]" /> Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="h-3.5 w-3.5" /> Stage
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}