"use client"

import { useEffect, useState } from "react"
import { client } from "@/sanity/lib/client"
import Image from "next/image"
import Link from "next/link"

interface Product {
  _id: string
  title: string
  price: number
  discountedPrice: number
  imageUrl: string
}

const StitchPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "stitch"]{
          _id,
          title,
          price,
          discountedPrice,
          "imageUrl": image.asset->url
        }`

        const data = await client.fetch(query)
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">Stitched Wear</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 my-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300">
          {products.map((product) => {
            const isDiscounted = product.discountedPrice !== undefined && product.discountedPrice < product.price

            return (
              <div
                key={product._id}
                className="group bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 ease-in-out"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mt-4 line-clamp-2">{product.title}</h2>

                <p className="mt-2">
                  {isDiscounted ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">PKR {product.price}</span>
                      <span className="text-green-600 font-bold">PKR {product.discountedPrice}</span>
                    </>
                  ) : (
                    <span className="text-blue-600 font-bold">PKR {product.price || product.discountedPrice}</span>
                  )}
                </p>

                <Link href={`/stitch/${product._id}`} passHref>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 hover:shadow-md transition duration-300 ease-in-out">
                    View Details
                  </button>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StitchPage
