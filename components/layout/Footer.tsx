import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-6 text-zinc-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded border border-cyan-500/40 bg-zinc-900 flex items-center justify-center text-cyan-400">
                            <Cpu className="h-3 w-3" />
                        </div>
                        <span className="font-mono text-xs font-bold tracking-widest text-zinc-100 uppercase">
                            CRAFT<span className="text-cyan-400">WARE</span>
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 max-w-sm">
                        Commercial PC accessories and hardware solutions engineered for high-cadence enterprise workflows.
                    </p>
                </div>

                <div className="flex flex-wrap gap-8 text-xs font-mono">
                    <Link href="/products" className="hover:text-cyan-400 transition">Catalog</Link>
                    <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
                    <Link href="/contact" className="hover:text-cyan-400 transition">Procurement Desk</Link>
                    <Link href="/account" className="hover:text-cyan-400 transition">Portal</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-8 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-zinc-600">
                <p>© {new Date().getFullYear()} CRAFTWARE Systems Inc. All rights reserved.</p>
                <p className="mt-2 sm:mt-0">Enterprise Quotation & Specification Platform</p>
            </div>
        </footer>
    );
}