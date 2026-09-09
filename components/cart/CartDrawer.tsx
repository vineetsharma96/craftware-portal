'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import {
    X,
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    ArrowRight,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

export function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
    } = useCart();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successRef, setSuccessRef] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: items.map((i) => ({
                        productId: i.product.id,
                        quantity: i.quantity,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error?.message || 'Failed to submit enquiry.');
            }

            setSuccessRef(data.data.orderNumber);
            clearCart();
            setShowEnquiryForm(false);
        } catch (err: any) {
            setErrorMsg(err.message || 'Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden font-sans">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                    />

                    {/* Slide-out Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
                    >
                        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/40">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-cyan-400" />
                                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-zinc-200">
                                        Procurement Cart
                                    </h2>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                                    aria-label="Close cart"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {successRef ? (
                                    <div className="text-center py-12 space-y-4">
                                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                                        <h3 className="text-lg font-bold text-white font-sans">
                                            Enquiry Dispatched
                                        </h3>
                                        <p className="text-xs font-mono text-zinc-400">
                                            Reference number: <span className="text-cyan-400 font-bold">{successRef}</span>
                                        </p>
                                        <p className="text-xs text-zinc-500 font-sans">
                                            A confirmation email with an itemized snapshot has been sent.
                                        </p>
                                        <div className="pt-4 flex flex-col gap-2">
                                            <Link
                                                href={`/track?ref=${encodeURIComponent(successRef)}`}
                                                onClick={closeCart}
                                                className="w-full py-2.5 rounded-md bg-cyan-400 text-zinc-950 text-xs font-mono font-semibold hover:bg-cyan-300 transition text-center"
                                            >
                                                Track Real-Time Status
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSuccessRef(null);
                                                    closeCart();
                                                }}
                                                className="w-full py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200"
                                            >
                                                Close Window
                                            </button>
                                        </div>
                                    </div>
                                ) : items.length === 0 ? (
                                    /* Empty State View */
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                                        <div className="h-16 w-16 rounded-full border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600">
                                            <ShoppingCart className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-300 font-mono">
                                                Your cart is empty
                                            </h3>
                                            <p className="mt-1 text-xs text-zinc-500 max-w-xs">
                                                No hardware line items staged for quotation enquiry.
                                            </p>
                                        </div>
                                        <Link
                                            href="/products"
                                            onClick={closeCart}
                                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 transition"
                                        >
                                            Browse Hardware Catalog <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                ) : showEnquiryForm ? (
                                    /* Form View */
                                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                            <span className="text-xs font-mono text-cyan-400 uppercase">
                                                Client Specifications
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowEnquiryForm(false)}
                                                className="text-[11px] font-mono text-zinc-400 hover:text-white"
                                            >
                                                Back to Items
                                            </button>
                                        </div>

                                        {errorMsg && (
                                            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 shrink-0" />
                                                <span>{errorMsg}</span>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                                Work Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">
                                                Procurement Notes
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Volume delivery dates, custom key switches, etc."
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs font-mono text-zinc-100 focus:border-cyan-400 focus:outline-none resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Procurement Enquiry <Send className="h-3.5 w-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    /* Item List */
                                    <div className="divide-y divide-zinc-800/80">
                                        {items.map((item) => (
                                            <div key={item.product.id} className="py-4 flex gap-3">
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-semibold text-zinc-200">
                                                        {item.product.name}
                                                    </h4>
                                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                                        SKU: {item.product.sku}
                                                    </span>
                                                    <div className="mt-1 text-xs font-mono text-cyan-400">
                                                        ${item.product.price.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex flex-col items-end justify-between">
                                                    <button
                                                        onClick={() => removeFromCart(item.product.id)}
                                                        className="text-zinc-500 hover:text-red-400 transition p-1"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>

                                                    <div className="flex items-center gap-1.5 border border-zinc-800 rounded bg-zinc-900 px-1.5 py-0.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="text-zinc-400 hover:text-white p-0.5"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="text-xs font-mono px-1">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            className="text-zinc-400 hover:text-white p-0.5"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer / Subtotal */}
                            {items.length > 0 && !showEnquiryForm && !successRef && (
                                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-mono">
                                        <span className="text-zinc-400">Estimated Subtotal:</span>
                                        <span className="text-base font-bold text-cyan-400">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowEnquiryForm(true)}
                                        className="w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 transition"
                                    >
                                        Proceed to Commercial Enquiry <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}