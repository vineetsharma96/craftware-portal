export function getWhatsAppEscalationUrl(message: string): string {
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+15550192834';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
}