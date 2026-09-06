import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';

export async function GET() {
    try {
        const { isAdmin } = await verifyAdminSession();
        return NextResponse.json({ isAdmin });
    } catch (err) {
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
}