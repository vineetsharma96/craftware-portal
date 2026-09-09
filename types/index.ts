export interface Product {
    id: string;
    name: string;
    slug: string;
    category: 'Keyboards' | 'Mice' | 'Connectivity' | 'Audio & Video' | 'Accessories';
    price: number;
    currency: string;
    sku: string;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
    shortDescription: string;
    description: string;
    specifications: Record<string, string>;
    featured: boolean;
    tags: string[];
}

export type OrderStatus =
    | 'ENQUIRY_RECEIVED'
    | 'QUOTATION_SENT'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';

export interface OrderItemRecord {
    id: string;
    product_id: string;
    product_name_snapshot: string;
    sku_snapshot: string;
    quantity: number;
    price_snapshot: number;
}

export interface OrderRecord {
    id: string;
    order_number: string;
    status: OrderStatus;
    guest_name?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
    message?: string | null;
    total_indicative_amount: number;
    created_at: string;
    updated_at?: string;
    order_items?: OrderItemRecord[];
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}


// types/index.ts
export interface Product {
    id: string;
    name: string;
    slug: string;
    category: 'Keyboards' | 'Mice' | 'Connectivity' | 'Audio & Video' | 'Accessories';
    price: number;
    currency: string;
    sku: string;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
    shortDescription: string;
    description: string;
    image: string; // <-- Ensure this is present
    specifications: Record<string, string>;
    featured: boolean;
    tags: string[];
}