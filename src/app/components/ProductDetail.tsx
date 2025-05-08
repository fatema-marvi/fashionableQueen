"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useCart } from "@/app/components/context/cartContext"
import Link from "next/link"

interface ProductDetailProps {
  product: {
    category: any
    _id: string
    title: string
    slug?: string
    price: number
    discountedPrice?: number
    description: string
    fabric: string
    sizeOptions?: string[]
    image: { asset: { url: string } }
    imageUrl: string
    gallery?: { asset: { url: string } }[]
    sizechart?: { asset: { url: string } }
    piecesIncluded?: string[]
    reviews?: {
      rating: number
      review: string
      author: string
      createdAt?: string
    }[]
    isFeatured?: boolean
    createdAt?: string
  } | null
}

interface RelatedProduct {
  _id: string
  _type: string
  title: string
  slug?: string
  price: number
  discountedPrice?: number
  imageUrl: string
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ]

  for (const [secondsPerUnit, label] of intervals) {
    const interval = Math.floor(seconds / secondsPerUnit)
    if (interval >= 1) return `${interval} ${label}${interval !== 1 ? "s" : ""} ago`
  }

  return "Just now"
}

// Helper function to get the correct product URL based on product type
const getProductUrl = (product: RelatedProduct) => {
  if (!product._type) return `/product/${product._id}`

  switch (product._type) {
    case "stitch":
      return `/stitch/${product._id}`
    case "unstitch":
      return `/unstitch/${product._id}`
    case "trouser":
      return `/trouser/${product._id}`
    default:
      return `/product/${product._id}`
  }
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string>(product?.imageUrl || "")
  const [reviews, setReviews] = useState(product?.reviews || [])
  const [reviewFormVisible, setReviewFormVisible] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review?product=${product?._id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.reviews) {
            setReviews(data.reviews)
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    const fetchRelatedProducts = async () => {
      if (!product?._id || !product?.fabric) return

      try {
        console.log(`Fetching related products for ID: ${product._id}, fabric: ${product.fabric}`)
        const res = await fetch(
          `/api/related-products?productId=${product._id}&fabric=${encodeURIComponent(product.fabric)}`,
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch related products: ${res.status}`)
        }

        const data = await res.json()
        console.log("Related products data:", data)
        setRelatedProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching related products:", error)
        setRelatedProducts([])
      }
    }

    // Only run these effects when the product ID changes
    if (product?._id) {
      fetchReviews()
      fetchRelatedProducts()
    }
  }, [product?._id, product?.fabric])

  if (!product) {
    return <p className="text-center text-red-500">⚠️ Product not found.</p>
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.")
      return
    }

    const newItem = {
      productId: product._id,
      name: product.title,
      price: product.discountedPrice || product.price,
      quantity: 1,
      imageUrl: selectedImage,
      selectedSize,
      selectedColor: "",
    }

    addToCart(newItem)
    alert("Product added to cart!")
  }

  const handleReviewSubmit = async (rating: number, review: string, author: string) => {
    if (isSubmittingReview) return

    setIsSubmittingReview(true)

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product?._id,
          rating,
          review,
          author,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to submit review: ${errorData.error}`)
        return
      }

      const resJson = await response.json()
      console.log("Review submitted successfully:", resJson)

      // Refresh reviews
      const res = await fetch(`/api/review?product=${product?._id}`)
      const data = await res.json()
      setReviews(data.reviews)
      setReviewFormVisible(false)
      alert("Thank you for your review!")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Unexpected error submitting review")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap md:flex-nowrap">
        {/* Main Image */}
        <div className="w-full md:w-1/2 p-4">
          {selectedImage && (
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.title}
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>

          {product.isFeatured && (
            <span className="inline-block bg-yellow-300 text-sm font-semibold px-2 py-1 rounded-full mt-1">
              ⭐ Featured
            </span>
          )}

          <p className="text-gray-600 mt-2">{product.description}</p>

          {product.fabric && (
            <p className="mt-2 text-sm text-gray-700">
              <strong>Fabric:</strong> {product.fabric}
            </p>
          )}

          {(product.piecesIncluded ?? []).length > 0 && (
            <div className="mt-2 text-sm text-gray-700">
              <strong>Includes:</strong>
              <ul className="list-disc list-inside">
                {(product.piecesIncluded ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xl">
            {product.discountedPrice ? (
              <>
                <span className="text-gray-500 line-through">PKR {product.price}</span>
                <span className="text-blue-600 font-bold">PKR {product.discountedPrice}</span>
              </>
            ) : (
              <span className="text-blue-600 font-bold">PKR {product.price}</span>
            )}
          </div>

          {/* Size Dropdown */}
          {product.sizeOptions?.length ? (
            <div className="mt-6">
              <label className="block text-lg font-medium mb-2">Select Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="p-2 border rounded-md w-full"
              >
                <option value="">Select Size</option>
                {product.sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* Size Chart */}
          {product.sizechart?.asset.url && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-1">Size Chart</p>
              <Image
                src={product.sizechart.asset.url || "/placeholder.svg"}
                alt="Size Chart"
                width={300}
                height={300}
                className="border rounded-md"
              />

            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Gallery */}
      {product.gallery?.length ? (
        <div className="w-full mt-10 p-4">
          <h3 className="text-lg font-semibold mb-2">Gallery</h3>
          <div className="flex flex-wrap gap-2">
            {product.gallery.map((imgObj, idx) => (
              <div
                key={idx}
                className="w-20 h-20 border rounded-md overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(imgObj.asset.url)}
              >
                <Image
                  src={imgObj.asset.url || "/placeholder.svg"}
                  alt={`${product.title} thumbnail`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Reviews */}
      <div className="mt-10">
        {reviews?.length ? (
          <>
            <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <p>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)} ({review.rating}/5)
                    </p>
                  </div>
                  <p className="mt-2 text-gray-700">{review.review}</p>
                  <p className="mt-1 text-sm text-gray-500 italic">
                    - {review.author}
                    {review.createdAt && <> • {timeAgo(review.createdAt)}</>}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">No reviews yet.</p>
        )}

        {!reviewFormVisible && (
          <div className="mt-8">
            <button
              onClick={() => setReviewFormVisible(true)}
              className="text-blue-600 underline hover:text-blue-800 text-sm"
            >
              Leave a Review
            </button>
          </div>
        )}

        {reviewFormVisible && (
          <div className="mt-4 max-w-md border rounded-md p-4 shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const rating = Number((form.elements.namedItem("rating") as HTMLInputElement).value)
                const review = (form.elements.namedItem("review") as HTMLInputElement).value
                const author = (form.elements.namedItem("author") as HTMLInputElement).value

                await handleReviewSubmit(rating, review, author)
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm">Name</label>
                <input type="text" name="author" required className="w-full border p-1 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm">Rating (1–5)</label>
                <input
                  type="number"
                  name="rating"
                  min={1}
                  max={5}
                  required
                  className="w-full border p-1 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm">Review</label>
                <textarea name="review" rows={3} required className="w-full border p-1 rounded-md text-sm" />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className={`px-4 py-1 text-white text-sm rounded ${
                  isSubmittingReview ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmittingReview ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* You May Also Like Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
        {relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedProducts.map((item) => (
              <Link href={getProductUrl(item)} key={item._id}>
                <div className="border rounded-lg p-4 hover:shadow-md transition duration-200">
                  <div className="relative w-full h-64">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="mt-2 font-medium text-lg">{item.title}</h4>
                  <div className="text-sm mt-1">
                    {item.discountedPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">PKR {item.price}</span>
                        <span className="text-blue-600 font-bold">PKR {item.discountedPrice}</span>
                      </>
                    ) : (
                      <span className="text-blue-600 font-bold">PKR {item.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading related products...</p>
        )}
      </div>
    </div>
  )
}
export default ProductDetail