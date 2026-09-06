import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProductBySlug } from '@/data/products';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
    return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) notFound();

    return <ProductDetailClient product={product} />;
}