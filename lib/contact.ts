export const CONTACT_CONFIG = {
    companyName:
        process.env.NEXT_PUBLIC_COMPANY_NAME || 'CRAFTWARE Systems',
    email:
        process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'procurement@craftware.com',
    phone:
        process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 019-2834',
    whatsappNumber:
        process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '15550192834',
    address:
        process.env.NEXT_PUBLIC_CONTACT_ADDRESS ||
        '450 Technology Parkway, Suite 800, Austin, TX 78701',
    hours:
        process.env.NEXT_PUBLIC_CONTACT_HOURS ||
        'Mon - Fri: 08:00 - 18:00 EST',
    getWhatsAppUrl(message?: string) {
        const cleanNumber = this.whatsappNumber.replace(/[^0-9]/g, '');
        const encoded = message
            ? `?text=${encodeURIComponent(message)}`
            : `?text=${encodeURIComponent('Hello Craftware Commercial Desk, inquiring about enterprise hardware...')}`;
        return `https://wa.me/${cleanNumber}${encoded}`;
    },
};