'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedMessage } from '@/components/chat/FormattedMessage';
import {
    Bot,
    User,
    X,
    Send,
    Loader2,
    RefreshCw,
    Terminal,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const QUICK_PROMPTS = [
    'What keyboards are in stock?',
    'Track order status',
    'Volume quote policy',
];

export function ChatAssistant() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'assistant',
            content:
                'Hello. I am the **CRAFTWARE Telemetry Assistant**.\n\nI can assist with:\n* Enterprise hardware specifications\n* Live tracking queries\n* Volume procurement inquiries\n\nHow can I help you today?',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    if (!mounted) return null;

    const handleSend = async (textToSend?: string) => {
        const query = (textToSend || input).trim();
        if (!query || loading) return;

        const userMessage: Message = {
            id: `usr-${Date.now()}`,
            role: 'user',
            content: query,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Option A: Pointing directly to /api/ai/chat
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Telemetry link unreachable.');
            }

            const assistantMessage: Message = {
                id: `ast-${Date.now()}`,
                role: 'assistant',
                content: data.reply || data.message || 'No response generated.',
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: 'assistant',
                    content: `**Error:** ${err.message || 'Unable to communicate with assistant telemetry.'}`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Launcher Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Open AI Assistant"
                className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-zinc-950 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:scale-105 hover:border-cyan-400 transition"
            >
                <Bot className="h-5 w-5" />
            </button>

            {/* Slide-Up Chat Terminal Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 z-50 flex h-[520px] max-h-[80vh] w-[calc(100vw-2rem)] sm:w-[420px] flex-col rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl font-sans overflow-hidden"
                        style={{ bottom: '5.5rem' }} // Guaranteed fallback position (88px above screen bottom)
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
                                    <Terminal className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                                        CRAFTWARE Telemetry
                                    </span>
                                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Operational Assistant
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessages([
                                            {
                                                id: `init-${Date.now()}`,
                                                role: 'assistant',
                                                content: 'Session reset. How can I assist your procurement team?',
                                            },
                                        ])
                                    }
                                    title="Clear Session"
                                    className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    title="Close"
                                    className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m) => {
                                const isUser = m.role === 'user';
                                return (
                                    <div
                                        key={m.id}
                                        className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${isUser
                                                    ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                                                    : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400'
                                                }`}
                                        >
                                            {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                        </div>

                                        <div
                                            className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs shadow-md ${isUser
                                                    ? 'bg-cyan-400 text-zinc-950 font-medium'
                                                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200'
                                                }`}
                                        >
                                            {isUser ? m.content : <FormattedMessage content={m.content} />}
                                        </div>
                                    </div>
                                );
                            })}

                            {loading && (
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
                                        <Bot className="h-3 w-3" />
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5">
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            <span>Processing telemetry...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Inquiry Chips */}
                        <div className="border-t border-zinc-800/80 bg-zinc-950 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleSend(prompt)}
                                    disabled={loading}
                                    className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-mono text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-300 transition disabled:opacity-50"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        {/* Message Input Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="border-t border-zinc-800 bg-zinc-900/60 p-3 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about SKU specifications, quotes..."
                                className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none transition"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-400 text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 transition"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}