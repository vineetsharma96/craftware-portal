'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
    ArrowRight,
    Cpu,
    PackageCheck,
    ShieldCheck,
    Terminal,
    Zap,
} from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
};

const wordVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
        filter: 'blur(4px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export function Hero() {
    const words = ['PC', 'accessories,', 'built', 'for', 'better', 'work.'];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-20 bg-zinc-950 text-zinc-100 font-sans">
            {/* Background Grid & Ambient Cyan Glow */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
                <div className="absolute top-1/2 right-10 h-72 w-72 bg-cyan-400/5 blur-[100px] rounded-full" />
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Top Status Pill */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                        </span>
                        <span className="uppercase tracking-wider text-[11px]">
                            Commercial Hardware Infrastructure // Q3 Staging
                        </span>
                    </motion.div>

                    {/* Staggered Word-by-Word Title */}
                    <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                        {words.map((word, idx) => {
                            const isHighlight = word.toLowerCase().includes('better');

                            return (
                                <motion.span
                                    key={idx}
                                    variants={wordVariants}
                                    className={`inline-block mr-3 md:mr-4 ${isHighlight
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 font-extrabold drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]'
                                            : 'text-zinc-100'
                                        }`}
                                >
                                    {word}
                                </motion.span>
                            );
                        })}
                    </motion.h1>

                    {/* Subtitle / Description */}
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 font-mono leading-relaxed"
                    >
                        Engineered hardware, custom mechanical workstations, and precision desk
                        gear designed for sustained enterprise cadence and technical ergonomics.
                    </motion.p>

                    {/* Action CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 font-mono text-xs font-semibold"
                    >
                        <Link
                            href="/products"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 py-3 text-zinc-950 hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                        >
                            <Cpu className="h-4 w-4" />
                            Explore Hardware Catalog
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                            href="/track"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition backdrop-blur-sm"
                        >
                            <Terminal className="h-4 w-4 text-cyan-400" />
                            Track Consignment
                        </Link>
                    </motion.div>

                    {/* Commercial Proof Badges */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-10 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono"
                    >
                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40 border border-zinc-900">
                            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-zinc-200 text-xs block font-bold">Commercial SLA</span>
                                <span className="text-zinc-500 text-[10px]">Direct replacement warranty</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40 border border-zinc-900">
                            <PackageCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-zinc-200 text-xs block font-bold">24-Hour Dispatch</span>
                                <span className="text-zinc-500 text-[10px]">Verified staged inventory</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40 border border-zinc-900">
                            <Zap className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-zinc-200 text-xs block font-bold">Instant Quotation</span>
                                <span className="text-zinc-500 text-[10px]">Live telemetry RFQ engine</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40 border border-zinc-900">
                            <Terminal className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-zinc-200 text-xs block font-bold">Volume Tenders</span>
                                <span className="text-zinc-500 text-[10px]">Dedicated corporate desk</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}