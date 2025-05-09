// app/you-may-like/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/app/components/ProductCard'; // Make sure path is correct

interface Product {
    _id: string;
    title: string;
    price: number;
    discountedPrice?: number;
    imageUrl: string;
  }
  

const YouMayLike = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/related-products'); // or your actual API route
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch related products', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">You May Also Like</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default YouMayLike;
