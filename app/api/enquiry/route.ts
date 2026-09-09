import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/data/products';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message, items } = body;

        // Strict validation
        if (!name || !email || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'INVALID_PAYLOAD', message: 'Name, email, and items are required.' },
                },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: { code: 'INVALID_EMAIL', message: 'Invalid email address.' } },
                { status: 400 }
            );
        }

        // Authenticated session check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Verify catalog line items
        let calculatedTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = getProductById(item.productId);
            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${item.productId} not found.` },
                    },
                    { status: 400 }
                );
            }

            const cleanQty = Math.max(1, Math.floor(Number(item.quantity) || 1));
            calculatedTotal += product.price * cleanQty;

            validatedItems.push({
                product_id: product.id,
                product_name_snapshot: product.name,
                sku_snapshot: product.sku,
                quantity: cleanQty,
                price_snapshot: product.price,
            });
        }

        const orderNumber = `CW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        // Supabase DB storage
        let orderId = `local_${Date.now()}`;
        try {
            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .insert({
                    user_id: user ? user.id : null,
                    order_number: orderNumber,
                    status: 'ENQUIRY_RECEIVED',
                    guest_name: user ? null : name,
                    guest_email: user ? null : email,
                    guest_phone: user ? null : phone,
                    message: message || '',
                    total_indicative_amount: calculatedTotal,
                })
                .select()
                .single();

            if (!orderErr && order) {
                orderId = order.id;
                const orderItemsWithId = validatedItems.map((vi) => ({
                    ...vi,
                    order_id: order.id,
                }));
                await supabase.from('order_items').insert(orderItemsWithId);
            }
        } catch (dbErr) {
            console.warn('[SUPABASE WARNING]:', dbErr);
        }

        // Dispatch Emails via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        const businessEmail = process.env.BUSINESS_EMAIL;
        // Use your verified custom domain address if set (e.g. orders@craftware.com), else sandbox default
        const senderEmail = process.env.RESEND_FROM_EMAIL || 'CRAFTWARE <onboarding@resend.dev>';

        if (resendApiKey) {
            const resend = new Resend(resendApiKey);

            const itemsHtml = validatedItems
                .map(
                    (i) => `
          <tr style="border-bottom: 1px solid #27272a;">
            <td style="padding: 10px 0; font-family: monospace; color: #f4f4f5;">
              <strong>${i.product_name_snapshot}</strong><br/>
              <span style="color: #71717a; font-size: 11px;">SKU: ${i.sku_snapshot}</span>
            </td>
            <td style="padding: 10px 0; text-align: center; color: #a1a1aa; font-family: monospace;">
              ${i.quantity}
            </td>
            <td style="padding: 10px 0; text-align: right; color: #22d3ee; font-family: monospace;">
              $${(i.price_snapshot * i.quantity).toFixed(2)}
            </td>
          </tr>`
                )
                .join('');

            // 1. Customer Order Confirmation Email Template
            const customerEmailHtml = `
        <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 32px; border-radius: 8px;">
          <h2 style="color: #22d3ee; margin-top: 0;">Enquiry Received</h2>
          <p>Hello ${name},</p>
          <p>Thank you for your commercial procurement enquiry. We have logged your request under reference <strong>${orderNumber}</strong>.</p>
          <p style="color: #a1a1aa; font-size: 13px;">Our hardware team will review your quantities and follow up within one business day with stock availability and formal freight terms.</p>
          
          <h3 style="margin-top: 24px; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
            <thead>
              <tr style="color: #a1a1aa; font-size: 12px; border-bottom: 1px solid #3f3f46;">
                <th style="padding-bottom: 8px;">Item</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Indicative Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; text-align: right; font-family: monospace; font-size: 16px;">
            <strong>Total Estimate: </strong><span style="color: #22d3ee;">$${calculatedTotal.toFixed(2)} USD</span>
          </div>

          <p style="margin-top: 32px; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; padding-top: 16px;">
            Craftware Hardware Systems &bull; High-Performance Enterprise Peripherals
          </p>
        </div>
      `;

            // 2. Admin Alert Email Template
            const adminEmailHtml = `
        <h2>New B2B Procurement Request [${orderNumber}]</h2>
        <p><strong>Customer:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Notes:</strong> ${message || 'No notes'}</p>
        <hr/>
        <table style="width: 100%; text-align: left;">
          ${itemsHtml}
        </table>
        <p><strong>Total Value:</strong> $${calculatedTotal.toFixed(2)}</p>
      `;

            // Dispatch Customer Confirmation
            try {
                const { data: custData, error: custErr } = await resend.emails.send({
                    from: senderEmail,
                    to: email, // <--- Sends directly to customer email
                    subject: `Enquiry Received: ${orderNumber} - CRAFTWARE`,
                    html: customerEmailHtml,
                });

                if (custErr) {
                    console.error('[RESEND CUSTOMER DISPATCH ERROR]:', custErr);
                } else {
                    console.log('[RESEND CUSTOMER EMAIL SENT]:', custData?.id);
                }
            } catch (err) {
                console.error('[RESEND CUSTOMER EXCEPTION]:', err);
            }

            // Dispatch Internal Admin Alert (if business email defined)
            if (businessEmail) {
                try {
                    await resend.emails.send({
                        from: senderEmail,
                        to: businessEmail,
                        subject: `[NEW LEAD] ${name} submitted enquiry ${orderNumber}`,
                        html: adminEmailHtml,
                    });
                } catch (err) {
                    console.warn('[RESEND ADMIN ALERT EXCEPTION]:', err);
                }
            }
        } else {
            console.warn('[EMAIL SKIPPED] RESEND_API_KEY is not defined in .env.local');
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId,
                orderNumber,
                total: calculatedTotal,
                message: 'Enquiry submitted successfully.',
            },
        });
    } catch (error: any) {
        console.error('[ENQUIRY ERROR]:', error);
        return NextResponse.json(
            { success: false, error: { code: 'SERVER_ERROR', message: error?.message || 'Submission error.' } },
            { status: 500 }
        );
    }
}