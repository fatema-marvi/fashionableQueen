import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const productId = searchParams.get('productId');
  const fabric = searchParams.get('fabric');

  if (!productId || !fabric) {
    return NextResponse.json(
      { error: 'Missing productId or fabric' },
      { status: 400 }
    );
  }

  try {
    // Modified query to search across all product types and include the _type field
    const query = `*[(_type == "stitch" || _type == "unstitch" || _type == "trouser" || _type == "product") && 
    fabric == $fabric && _id != $productId][0...6]{
_id,
_type,
title,
slug,
price,
discountedPrice,
"imageUrl": image.asset->url
}`

    const relatedProducts = await client.fetch(query, { productId, fabric });

    return NextResponse.json(relatedProducts);
  } catch (err) {
    console.error('Error fetching related products:', err);
    return NextResponse.json({ error: 'Failed to load related products' }, { status: 500 });
  }
}
