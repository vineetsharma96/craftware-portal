'use client';

import React from 'react';

interface FormattedMessageProps {
    content: string;
}

export function FormattedMessage({ content }: FormattedMessageProps) {
    // Split into lines
    const lines = content.split('\n');

    // Helper to parse **bold** and `code` inline
    const renderInline = (text: string) => {
        // Regex splits on **bold** and `code`
        const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-semibold text-zinc-100">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={index}
                        className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[11px] text-cyan-300"
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }
            return part;
        });
    };

    // Group lines into bullet lists or standard paragraphs
    const renderedElements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = () => {
        if (currentList.length > 0) {
            renderedElements.push(
                <ul key={`list-${renderedElements.length}`} className="my-2 space-y-1.5 pl-1">
                    {currentList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            <span>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // Match bullet points: * Item or - Item
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            currentList.push(trimmed.slice(2));
        } else {
            flushList();
            if (trimmed.length === 0) {
                // Empty line spacer
                renderedElements.push(<div key={`spacer-${idx}`} className="h-2" />);
            } else {
                renderedElements.push(
                    <p key={`p-${idx}`} className="text-xs leading-relaxed text-zinc-300">
                        {renderInline(trimmed)}
                    </p>
                );
            }
        }
    });

    flushList();

    return <div className="space-y-1 font-sans">{renderedElements}</div>;
}