'use client';

import React, { useState } from 'react';
import { CONTACT_CONFIG } from '@/lib/contact';
import {
    Mail,
    Phone,
    MessageSquare,
    MapPin,
    Clock,
    Send,
    Building,
    User,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: 'idle' | 'success' | 'error';
        message: string;
    }>({ type: 'idle', message: '' });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: 'idle', message: '' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error?.message || 'Failed to dispatch transmission.');
            }

            setStatus({
                type: 'success',
                message: `Transmission logged under reference: ${data.data.referenceId}. Commercial desk will review within 24 business hours.`,
            });

            setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: '',
            });
        } catch (err: any) {
            setStatus({
                type: 'error',
                message: err.message || 'An unexpected error occurred. Please use direct hotline.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-12 text-zinc-100 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="border-b border-zinc-800/80 pb-6 mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-cyan-400" />
                        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                            Commercial Liaison // Technical Procurement
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                        Direct Corporate Contact
                    </h1>
                    <p className="mt-2 text-xs font-mono text-zinc-400 max-w-2xl">
                        For hardware tenders, enterprise quotations, compatibility audits, or priority SLA support.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Dynamic Contact Telemetry from ENV */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
                            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-6 flex items-center gap-2">
                                <Building className="h-4 w-4" /> Operational Desks
                            </h2>

                            <div className="space-y-5 text-xs font-mono">
                                {/* Email Channel */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                                        <Mail className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-zinc-500 block">
                                            Tenders & Commercial RFQ
                                        </span>
                                        <a
                                            href={`mailto:${CONTACT_CONFIG.email}`}
                                            className="text-zinc-200 hover:text-cyan-400 transition"
                                        >
                                            {CONTACT_CONFIG.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Direct Phone Hotline */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                                        <Phone className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-zinc-500 block">
                                            Direct Voice Hotline
                                        </span>
                                        <a
                                            href={`tel:${CONTACT_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
                                            className="text-zinc-200 hover:text-cyan-400 transition"
                                        >
                                            {CONTACT_CONFIG.phone}
                                        </a>
                                    </div>
                                </div>

                                {/* WhatsApp Channel */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                                        <MessageSquare className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-zinc-500 block">
                                            Instant Logistics Desk (WhatsApp)
                                        </span>
                                        <a
                                            href={CONTACT_CONFIG.getWhatsAppUrl()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition"
                                        >
                                            Connect Live on WhatsApp <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                {/* Physical Depot / Address */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                                        <MapPin className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-zinc-500 block">
                                            Corporate Headquarters & Depot
                                        </span>
                                        <span className="text-zinc-300 leading-relaxed font-sans block text-[13px]">
                                            {CONTACT_CONFIG.address}
                                        </span>
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="flex items-start gap-3 pt-2 border-t border-zinc-800/80">
                                    <div className="h-8 w-8 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                                        <Clock className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase text-zinc-500 block">
                                            Commercial Desk Schedule
                                        </span>
                                        <span className="text-zinc-400">{CONTACT_CONFIG.hours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Transmission Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
                            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-4 pb-2 border-b border-zinc-800">
                                Transmit Procurement Specification
                            </h2>

                            {status.type === 'success' && (
                                <div className="mb-6 flex items-center gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>{status.message}</span>
                                </div>
                            )}

                            {status.type === 'error' && (
                                <div className="mb-6 flex items-center gap-3 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-xs font-mono text-red-400">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                            Contact Representative *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Alex Morgan"
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                            Corporate Work Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="a.morgan@enterprise.com"
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                            Company / Organization
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Apex Cloud Corp"
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                            Inquiry Scope
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Volume Quotation / Tender"
                                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                                        Message Details & Technical Specs *
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Provide hardware units required, deployment timeframe, or SLA requirements..."
                                        className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 py-2.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" /> Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            Transmit Transmission <Send className="h-3.5 w-3.5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}