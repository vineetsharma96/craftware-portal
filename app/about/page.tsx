import React from 'react';
import { Shield, Layers, HardDrive, Terminal } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-6 lg:px-16 text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <span className="font-mono text-xs uppercase text-cyan-400">Engineering Heritage</span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                    Built for High-Throughput Engineering
                </h1>

                <p className="mt-6 text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                    CRAFTWARE designs and manufactures mission-critical desktop accessories tailored specifically for commercial workstations, software engineering teams, and enterprise operational infrastructure.
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <Layers className="h-6 w-6 text-cyan-400 mb-3" />
                        <h2 className="text-sm font-mono font-bold text-zinc-200">No Consumer Fluff</h2>
                        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                            We eliminate RGB bloatware and unnecessary proprietary drivers. Every peripheral operates on standard HID protocols and firmware standards like QMK/VIA.
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <Shield className="h-6 w-6 text-cyan-400 mb-3" />
                        <h2 className="text-sm font-mono font-bold text-zinc-200">Verified B2B Procurement</h2>
                        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                            Quotation dockets are validated against real physical inventories, preventing unexpected backorders and stock cancellations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}