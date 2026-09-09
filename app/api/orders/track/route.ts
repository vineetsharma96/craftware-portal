import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const orderNumber = searchParams.get('orderNumber')?.trim();

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Order reference number is required.' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Query order record and related line item snapshots
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        id,
        order_number,
        status,
        guest_name,
        total_indicative_amount,
        created_at,
        updated_at,
        order_items (
          id,
          product_name_snapshot,
          sku_snapshot,
          quantity,
          price_snapshot
        )
      `)
            .ilike('order_number', orderNumber)
            .maybeSingle();

        if (error) {
            console.error('[TRACK API SUPABASE ERROR]:', error);
            return NextResponse.json(
                { success: false, error: 'Database service query failed.' },
                { status: 500 }
            );
        }

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'No matching order record found for this reference.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order,
        });
    } catch (err: any) {
        console.error('[TRACK API UNHANDLED ERROR]:', err);
        return NextResponse.json(
            { success: false, error: 'Internal telemetry lookup error.' },
            { status: 500 }
        );
    }
}