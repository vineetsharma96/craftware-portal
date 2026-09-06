'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, MessageSquare, Terminal, ExternalLink, Loader2 } from 'lucide-react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
}

const INITIAL_MESSAGE: ChatMessage = {
    id: 'init_msg',
    sender: 'assistant',
    text: "CRAFTWARE Technical Assistant initialized.\n\nI can verify hardware specifications, compatibility matrices, and procurement availability across our peripheral lineup. How may I assist your team?",
    timestamp: 'Just now',
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            inputRef.current?.focus();
        }
    }, [isOpen, messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const query = input.trim();
        if (!query || isLoading) return;

        const userMessage: ChatMessage = {
            id: `usr_${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query }),
            });

            const json = await res.json();

            if (json.success && json.data?.reply) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `asst_${Date.now()}`,
                        sender: 'assistant',
                        text: json.data.reply,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                ]);
            } else {
                throw new Error(json.error?.message || 'Inference failed');
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `err_${Date.now()}`,
                    sender: 'assistant',
                    text: "System notification: Hardware telemetry link degraded.\n\nPlease escalate your specification query directly to engineering via WhatsApp.",
                    timestamp: 'Just now',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+15550192834';

    return (
        <>
            {/* Floating Trigger Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Open AI Assistant"
                    className="relative group flex items-center justify-center h-13 w-13 rounded-full border border-cyan-500/40 bg-zinc-950/90 text-cyan-400 shadow-2xl backdrop-blur-md hover:border-cyan-400 hover:scale-105 transition duration-200"
                >
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                    </span>
                    <Bot className="h-6 w-6" />
                </button>
            </div>

            {/* Slide-out Terminal Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-22 right-6 z-50 w-[92vw] max-w-md h-[550px] rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/60">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-cyan-400" />
                                <span className="font-mono text-xs font-semibold text-zinc-200">
                                    CRAFTWARE // SPEC_ENGINE
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-lg p-3 leading-relaxed whitespace-pre-wrap select-text ${msg.sender === 'user'
                                                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                                                : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="mt-1 text-[10px] text-zinc-600 px-1">{msg.timestamp}</span>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs pl-2">
                                    <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                                    <span>Parsing hardware specifications...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* WhatsApp Fallback Link */}
                        <div className="border-t border-zinc-900 px-4 py-2 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                            <span>Need custom quotes?</span>
                            <a
                                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Craftware%2C%20I%20have%20a%20commercial%20hardware%20procurement%20enquiry.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                            >
                                WhatsApp Direct <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>

                        {/* Input Footer */}
                        <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-zinc-900/40">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about specs, switches, ports..."
                                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-md bg-cyan-400 p-2 text-zinc-950 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}