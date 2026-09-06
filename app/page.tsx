import React from 'react';
import { Hero } from '@/components/home/Hero';

export const metadata = {
    title: 'CRAFTWARE | PC Accessories Built for Better Work',
    description: 'Enterprise B2B procurement for commercial PC accessories, keyboards, optical mice, and Thunderbolt docks.',
};

export default function HomePage() {
    return (
        <main className="relative min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
            <Hero />
        </main>
    );
}