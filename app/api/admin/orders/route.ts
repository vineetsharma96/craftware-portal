import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';
import { createAdminClient } from '@/lib/supabase/admin'; // Admin service client
import { OrderStatus } from '@/types';
import { Resend } from 'resend';

const VALID_STATUSES: OrderStatus[] = [
    'ENQUIRY_RECEIVED',
    'QUOTATION_SENT',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
];

export async function GET() {
    try {
        const { isAdmin } = await verifyAdminSession();
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Admin privileges required.' },
                { status: 403 }
            );
        }

        // Bypass RLS using service role
        const supabase = createAdminClient();
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, order_items (*)')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: orders || [] });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err?.message || 'Failed to fetch orders.' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { isAdmin } = await verifyAdminSession();
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Admin privileges required.' },
                { status: 403 }
            );
        }

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { success: false, error: 'Invalid JSON payload provided.' },
                { status: 400 }
            );
        }

        const { orderId, status } = body;

        if (!orderId || !status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Valid order ID and supported status are required.' },
                { status: 400 }
            );
        }

        // Bypass RLS using service role
        const supabase = createAdminClient();

        const { data: updatedOrder, error: updateErr } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
            .single();

        if (updateErr || !updatedOrder) {
            return NextResponse.json(
                { success: false, error: updateErr?.message || 'Order update failed.' },
                { status: 500 }
            );
        }

        // Buyer Notification Dispatch via Resend
        const buyerEmail = updatedOrder.guest_email;
        const resendApiKey = process.env.RESEND_API_KEY;
        const senderEmail = process.env.RESEND_FROM_EMAIL || 'CRAFTWARE <onboarding@resend.dev>';

        if (resendApiKey && buyerEmail) {
            const resend = new Resend(resendApiKey);
            const friendlyStatus = status.replace(/_/g, ' ');

            try {
                await resend.emails.send({
                    from: senderEmail,
                    to: buyerEmail,
                    subject: `Status Update: Order ${updatedOrder.order_number} is now ${friendlyStatus}`,
                    html: `
            <div style="background-color: #09090b; color: #f4f4f5; font-family: monospace; padding: 28px; border-radius: 8px;">
              <h2 style="color: #22d3ee; margin-top: 0;">Order Status Update</h2>
              <p>Reference: <strong>${updatedOrder.order_number}</strong></p>
              <p>Your hardware procurement request has been updated to:</p>
              <div style="display: inline-block; padding: 8px 16px; background-color: #22d3ee1a; border: 1px solid #22d3ee66; border-radius: 4px; color: #22d3ee; font-weight: bold; margin: 12px 0;">
                ${friendlyStatus}
              </div>
              <p style="color: #a1a1aa; font-size: 12px; margin-top: 20px;">
                Track this live at: <a href="/track?ref=${updatedOrder.order_number}" style="color: #22d3ee;">Order Tracker</a>
              </p>
            </div>
          `,
                });
            } catch (mailErr) {
                console.warn('[STATUS UPDATE MAIL WARNING]:', mailErr);
            }
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err?.message || 'Server error while processing status update.' },
            { status: 500 }
        );
    }
}