import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, company, subject, message } = body || {};

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'INVALID_PAYLOAD', message: 'Name, email, and message are required.' },
                },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
                },
                { status: 400 }
            );
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const businessEmail = process.env.BUSINESS_EMAIL;
        // Uses verified custom domain sender if provided, otherwise falls back to Resend's required sandbox address
        const senderEmail = process.env.RESEND_FROM_EMAIL || 'CRAFTWARE <onboarding@resend.dev>';

        if (!resendApiKey) {
            console.warn('[CONTACT SKIPPED] RESEND_API_KEY is not defined in .env.local');
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'CONFIG_ERROR', message: 'Email service is temporarily offline.' },
                },
                { status: 503 }
            );
        }

        const resend = new Resend(resendApiKey);
        const referenceId = `CW-MSG-${Date.now().toString().slice(-6)}`;

        // 1. Send Internal Alert to Business Email
        if (businessEmail) {
            try {
                const { data: adminData, error: adminErr } = await resend.emails.send({
                    from: senderEmail,
                    to: businessEmail,
                    subject: `[Contact Form] ${subject || 'General Inquiry'} — ${name}`,
                    html: `
            <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 24px; border-radius: 8px;">
              <h2 style="color: #22d3ee; margin-top: 0;">New Contact Form Message</h2>
              <p><strong>Reference:</strong> ${referenceId}</p>
              <p><strong>Sender:</strong> ${name} (<a href="mailto:${email}" style="color: #22d3ee;">${email}</a>)</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
              <hr style="border: 0; border-top: 1px solid #27272a; margin: 16px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
          `,
                });

                if (adminErr) {
                    console.error('[RESEND CONTACT ADMIN ERROR]:', adminErr);
                } else {
                    console.log('[RESEND CONTACT ADMIN SENT]:', adminData?.id);
                }
            } catch (err) {
                console.error('[RESEND CONTACT ADMIN EXCEPTION]:', err);
            }
        }

        // 2. Send Customer Confirmation
        try {
            const { data: userData, error: userErr } = await resend.emails.send({
                from: senderEmail,
                to: email,
                subject: `Message Received [${referenceId}] — CRAFTWARE Systems`,
                html: `
          <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 32px; border-radius: 8px;">
            <h2 style="color: #22d3ee; margin-top: 0;">We have received your message</h2>
            <p>Hello ${name},</p>
            <p>Thank you for getting in touch with CRAFTWARE Systems. Your inquiry has been logged under reference <strong>${referenceId}</strong>.</p>
            <p style="color: #a1a1aa; font-size: 13px;">Our hardware specialist team will review your message and reply back to this email address within 24 business hours.</p>
            <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
            <p style="font-size: 12px; color: #71717a;">
              Craftware Hardware Systems &bull; Enterprise Peripherals &amp; Procurement
            </p>
          </div>
        `,
            });

            if (userErr) {
                console.error('[RESEND CONTACT USER ERROR]:', userErr);
            } else {
                console.log('[RESEND CONTACT USER SENT]:', userData?.id);
            }
        } catch (err) {
            console.error('[RESEND CONTACT USER EXCEPTION]:', err);
        }

        return NextResponse.json({
            success: true,
            data: {
                referenceId,
                message: 'Your message has been dispatched successfully.',
            },
        });
    } catch (error: any) {
        console.error('[CONTACT ROUTE ERROR]:', error);
        return NextResponse.json(
            {
                success: false,
                error: { code: 'SERVER_ERROR', message: error?.message || 'Failed to dispatch message.' },
            },
            { status: 500 }
        );
    }
}