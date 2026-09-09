import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const supabase = await createClient();

    // Enforce session presence
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
            { status: 401 }
        );
    }

    // Fetch using RLS and explicit user_id constraint
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select(`
      id,
      order_number,
      status,
      total_indicative_amount,
      message,
      created_at,
      order_items (
        id,
        product_id,
        product_name_snapshot,
        sku_snapshot,
        quantity,
        price_snapshot
      )
    `)
        .eq('id', orderId)
        .eq('user_id', user.id) // Authorization barrier preventing IDOR
        .single();

    if (orderErr || !order) {
        return NextResponse.json(
            { success: false, error: { code: 'NOT_FOUND', message: 'Order reference not found or access denied.' } },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        data: order,
    });
}