import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'CRAFTWARE — PC Accessories Built for Better Work',
    description: 'Enterprise B2B procurement for commercial PC accessories, keyboards, optical mice, and Thunderbolt docks.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
        title: 'CRAFTWARE — B2B Hardware Commerce',
        description: 'PC accessories, built for better work.',
        siteName: 'CRAFTWARE',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`}>
            <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
                <CartProvider>
                    <CustomCursor />
                    <Navbar />
                    <CartDrawer />
                    <AIAssistant />
                    <main>{children}</main>
                </CartProvider>
            </body>
        </html>
    );
}