'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

interface TrouserProduct {
  discountedPrice: undefined;
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
}

const TrouserPage = () => {
  const [products, setProducts] = useState<TrouserProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "trouser"]{
        _id,
        title,
        price,
        discountedPrice,
        "imageUrl": image.asset->url
      }`;

      const data = await client.fetch(query);
      console.log('Fetched Trousers:', data); // Optional: Check data
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Unstitched Wear</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {products.map((product) => {
      const isDiscounted = product.discountedPrice !== undefined && product.discountedPrice < product.price;
  
      return (
        <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <div className="relative w-full h-64">
                <Image src={product.imageUrl} alt={product.title} layout="fill" objectFit="cover" />
              </div>
              <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
              <p className="text-gray-700">{isDiscounted ? (
                <>
                  <span className="text-gray-500 line-through">PKR {product.price}</span>
                  <span className="text-blue-600 font-bold">PKR {product.discountedPrice}</span>
                </>
              ) : (
                <span className="text-blue-600 font-bold">PKR {product.discountedPrice}</span>
              )}</p>
              <Link href={`/trouser/${product._id}`}>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg w-full">
                  View Details
                </button>
              </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default TrouserPage;
  