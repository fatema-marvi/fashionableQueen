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
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">Trouser</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isDiscounted =
            product.discountedPrice !== undefined &&
            product.discountedPrice < product.price;

          return (
            <div
              key={product._id}
              className="group bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-xl">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mt-4 line-clamp-2">
                {product.title}
              </h2>

              <p className="mt-2">
                {isDiscounted ? (
                  <>
                    <span className="text-gray-400 line-through mr-2">
                      PKR {product.price}
                    </span>
                    <span className="text-green-600 font-bold">
                      PKR {product.discountedPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-blue-600 font-bold">
                    PKR {product.discountedPrice}
                  </span>
                )}
              </p>

              <Link href={`/trouser/${product._id}`} passHref>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 hover:shadow-md transition duration-300 ease-in-out">
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
