'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  price,
  discountedPrice,
  imageUrl,
}) => {
  const isDiscounted = discountedPrice !== undefined && discountedPrice < price;

  return (
    <div className="border rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md transition-transform transform hover:scale-105"
        />
      </div>

      <h2 className="text-lg font-semibold mt-3">{title}</h2>

      <div className="mt-1">
      {isDiscounted ? (
              <>
                <span className="text-gray-500 line-through">PKR {price}</span>
                <span className="text-blue-600 font-bold">PKR {discountedPrice}</span>
              </>
            ) : (
              <span className="text-blue-600 font-bold">PKR {discountedPrice}</span>
            )}
      </div>

      <Link href={`/product/${_id}`}>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md w-full hover:bg-blue-700 transition-transform duration-200">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
