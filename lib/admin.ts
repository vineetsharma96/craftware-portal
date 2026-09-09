import { createClient } from '@/lib/supabase/server';

export async function verifyAdminSession(): Promise<{ isAdmin: boolean; email?: string | null }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user || !user.email) {
            console.warn('[ADMIN CHECK FAILED]: No active Supabase session found on server.', error?.message);
            return { isAdmin: false };
        }

        const rawAdminEmails = process.env.ADMIN_EMAILS || '';
        const adminEmails = rawAdminEmails
            .split(',')
            .map((e) => e.trim().toLowerCase().replace(/['"]/g, ''))
            .filter(Boolean);

        const userEmail = user.email.trim().toLowerCase();
        const isAdmin = adminEmails.includes(userEmail);

        if (!isAdmin) {
            console.warn(
                `[ADMIN ACCESS DENIED]: Logged-in email (${userEmail}) does not match ADMIN_EMAILS:`,
                adminEmails
            );
        } else {
            console.log(`[ADMIN ACCESS GRANTED]: ${userEmail}`);
        }

        return { isAdmin, email: userEmail };
    } catch (err) {
        console.error('[AUTH CHECK EXCEPTION]:', err);
        return { isAdmin: false };
    }
}