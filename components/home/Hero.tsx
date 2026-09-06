'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Cpu, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const HEADLINE = 'PC accessories, built for better work.';

export function Hero() {
    const shouldReduceMotion = useReducedMotion();
    const { addItem } = useCart();

    const words = HEADLINE.split(' ');

    // Explicit Variants typing solves the line 62 type-check error
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.07,
                delayChildren: shouldReduceMotion ? 0 : 0.1,
            },
        },
    };

    const wordVariants: Variants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden px-6 lg:px-16 pt-24 pb-16">
            {/* Precision Background Tech Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 -z-10 pointer-events-none" />

            {/* Subtle Cyan Radiant Flare */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto w-full">
                {/* Brand Kicker / Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono text-zinc-400 mb-6 backdrop-blur-md"
                >
                    <Terminal className="h-3 w-3 text-cyan-400" />
                    <span className="tracking-wide uppercase text-[11px]">CRAFTWARE ENTERPRISE COMMERCE</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    <span className="text-zinc-500">Rev 2026</span>
                </motion.div>

                {/* Word-by-Word Revealed Headline */}
                <motion.h1
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl"
                >
                    {words.map((word, idx) => (
                        <motion.span
                            key={idx}
                            variants={wordVariants}
                            className={`inline-block mr-3 md:mr-4 ${word.toLowerCase().includes('better')
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'
                                    : ''
                                }`}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Supporting Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal"
                >
                    Engineered peripherals for engineering teams, operational clusters, and enterprise procurement.
                    Zero consumer clutter. Clean quotation dockets with validated factory inventories.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="mt-8 flex flex-wrap items-center gap-4"
                >
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 rounded-md bg-cyan-400 px-6 py-3 font-mono text-xs font-semibold text-zinc-950 hover:bg-cyan-300 transition duration-150"
                    >
                        Explore Equipment Catalog
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-6 py-3 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white backdrop-blur-sm transition"
                    >
                        Contact Procurement Sales
                    </Link>
                </motion.div>

                {/* Quick Highlights / Featured Line Items Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800/80 pt-8"
                >
                    <div className="flex items-start gap-3 rounded-lg border border-zinc-900 bg-zinc-950/40 p-4">
                        <Cpu className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-xs font-mono font-semibold text-zinc-200">TACTILE HARDWARE</h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                Gasket-mounted aerospace alloy keyboards with sound dampening.
                            </p>
                            <button
                                onClick={() => addItem('prod_cw_mech_01', 10)}
                                className="mt-2 text-[11px] font-mono text-cyan-400 hover:underline"
                            >
                                + Add Batch (10 Units)
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-zinc-900 bg-zinc-950/40 p-4">
                        <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-xs font-mono font-semibold text-zinc-200">COMMERCIAL PIPELINE</h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                Thunderbolt 4 workstation hubs with passive monolithic heat sinking.
                            </p>
                            <button
                                onClick={() => addItem('prod_cw_hub_03', 5)}
                                className="mt-2 text-[11px] font-mono text-cyan-400 hover:underline"
                            >
                                + Add Batch (5 Units)
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-zinc-900 bg-zinc-950/40 p-4">
                        <Terminal className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-xs font-mono font-semibold text-zinc-200">DIRECT SPEC QUOTATIONS</h2>
                            <p className="mt-1 text-xs text-zinc-400">
                                No checkout lock-ins. Generate validated PDF quotations for approval.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}