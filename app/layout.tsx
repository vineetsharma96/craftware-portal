import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/layout/Navbar';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { Footer } from '@/components/layout/Footer';

const fontSans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const fontMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export const viewport: Viewport = {
    themeColor: '#09090b',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: 'CRAFTWARE Systems // B2B Hardware Procurement',
        template: '%s | CRAFTWARE Systems',
    },
    description:
        'Enterprise-grade peripheral infrastructure, volume mechanical keyboards, high-bandwidth docks, and real-time logistics telemetry.',
    keywords: [
        'hardware procurement',
        'B2B electronics',
        'enterprise peripherals',
        'workstation hardware',
        'logistics tracking',
    ],
    icons: {
        icon: '/favicon.ico',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`dark ${fontSans.variable} ${fontMono.variable}`}
        >
            <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
                <CartProvider>
                    {/* Hardware Telemetry Cursor & Dynamic Ambient Spotlight */}
                    <CustomCursor />

                    {/* Main Viewport Shell */}
                    <div className="relative flex min-h-screen flex-col">
                        {/* Global Sticky Navigation */}
                        <Navbar />

                        {/* Main Route Content Area */}
                        <main className="flex-1">{children}</main>

                        {/* Corporate Telemetry Footer */}
                        <Footer />
                    </div>

                    {/* Slide-out Cart Drawer */}
                    <CartDrawer />

                    {/* Interactive AI Telemetry Assistant */}
                    <ChatAssistant />
                </CartProvider>
            </body>
        </html>
    );
}