import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);
        const messages = body?.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Valid messages array is required.' },
                { status: 400 }
            );
        }

        const latestUserQuery = messages[messages.length - 1]?.content || '';

        // Snapshot of hardware catalog for grounded context
        const catalogContext = PRODUCTS.map(
            (p) =>
                `- ${p.name} (SKU: ${p.sku}) | Price: $${p.price.toFixed(2)} | Stock: ${p.stockStatus || 'IN STOCK'
                } | Category: ${p.category}
  Description: ${p.shortDescription}
  Specs: ${JSON.stringify(p.specifications || {})}`
        ).join('\n\n');

        const systemPrompt = `
You are the CRAFTWARE Enterprise Hardware Procurement Assistant.
You assist corporate engineering and IT procurement teams with hardware specifications, compatibility, and quotation workflows.

CRAFTWARE LIVE CATALOG:
${catalogContext}

FORMATTING RULES:
1. Always complete all sentences and specification lists. Do not cut off text mid-sentence.
2. Structure item recommendations cleanly:
   **Product Name** (SKU: CW-XXX)
   * Price: $XX.XX
   * Availability: In Stock
   * Overview: Clear description.

   **Technical Specifications:**
   * Attribute: Value
3. Keep responses concise, objective, and commercial-focused.
`;

        const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

        // Upstream LLM integration (OpenAI or Groq)
        if (apiKey) {
            const isGroq = Boolean(process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY);
            const endpoint = isGroq
                ? 'https://api.groq.com/openai/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';
            const model = isGroq ? 'llama-3.1-70b-versatile' : 'gpt-4o-mini';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    temperature: 0.2,
                    max_tokens: 1200,
                    messages: [{ role: 'system', content: systemPrompt }, ...messages],
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[AI CHAT UPSTREAM ERROR]:', errText);
                throw new Error('AI gateway error. Falling back to local catalog lookup.');
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'No telemetry response received.';

            return NextResponse.json({
                success: true,
                reply,
                message: reply, // Dual property for universal client compatibility
            });
        }

        // Heuristic Fallback (Runs when no external API key is configured in .env.local)
        const query = latestUserQuery.toLowerCase();
        const matched = PRODUCTS.filter(
            (p) =>
                query.includes(p.name.toLowerCase()) ||
                query.includes(p.category.toLowerCase()) ||
                query.includes(p.sku.toLowerCase())
        );

        if (matched.length > 0) {
            const p = matched[0];
            const specList = Object.entries(p.specifications || {})
                .map(([k, v]) => `* ${k.toUpperCase()}: ${v}`)
                .join('\n');

            const fallbackReply = `Here is the matching hardware from the **CRAFTWARE** catalog:

**${p.name}** (SKU: ${p.sku})

* Price: $${p.price.toFixed(2)} USD
* Availability: ${p.stockStatus || 'In Stock'}
* Overview: ${p.shortDescription}

**Technical Specifications:**
${specList}

You can stage this item directly to your cart for bulk quotation.`;

            return NextResponse.json({
                success: true,
                reply: fallbackReply,
                message: fallbackReply,
            });
        }

        const defaultReply = `I received your procurement inquiry: "${latestUserQuery}".\n\nYou can explore mechanical keyboards, docks, and displays under the **Hardware** tab, or track shipments at **/track**. Let me know if you need specific technical parameters or volume pricing.`;

        return NextResponse.json({
            success: true,
            reply: defaultReply,
            message: defaultReply,
        });
    } catch (err: any) {
        console.error('[AI CHAT HANDLER EXCEPTION]:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Internal AI assistant error.' },
            { status: 500 }
        );
    }
}