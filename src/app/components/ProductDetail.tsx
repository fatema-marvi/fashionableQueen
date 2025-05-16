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
    colorOptions?: string[] // New field for color options
    image: { asset: { url: string } }
    imageUrl: string
    gallery?: { asset: { url: string } }[]
    sizeChart?: { asset: { url: string } }
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
  const [selectedColor, setSelectedColor] = useState<string>("") // ✅ empty string
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // ✅ Initialize with null
  const [reviews, setReviews] = useState(product?.reviews || [])
  const [reviewFormVisible, setReviewFormVisible] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])

  const piecesIncluded =
    product && Array.isArray(product.piecesIncluded)
      ? product.piecesIncluded
      : product && typeof product?.piecesIncluded === "string"
        ? [product.piecesIncluded]
        : []

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
        const res = await fetch(
          `/api/related-products?productId=${product._id}&fabric=${encodeURIComponent(product.fabric)}`,
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch related products: ${res.status}`)
        }

        const data = await res.json()
        setRelatedProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching related products:", error)
        setRelatedProducts([])
      }
    }

    if (product?._id) {
      fetchReviews()
      fetchRelatedProducts()
    }
  }, [product?._id, product?.fabric])

  if (!product) {
    return <p className="text-center text-red-500">⚠️ Product not found.</p>
  }

  const handleAddToCart = () => {
    // Alert only for 'stitch' and 'trouser' categories
    if ((product?.category === "stitch" || product?.category === "trouser") && !selectedSize) {
      alert("Please select a size.")
      return
    }

    // Make sure we have a valid image URL
    const imageUrl = product.imageUrl || product.image?.asset?.url || ""

    const newItem = {
      productId: product._id,
      name: product.title,
      price: product.discountedPrice || product.price,
      quantity: 1,
      imageUrl: imageUrl,
      selectedSize,
      selectedColor: selectedColor ?? "", // ✅ Also correct
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
    <div className="container mx-auto mt-6 p-6">
      <div className="flex flex-wrap md:flex-nowrap">
        {/* Main Image */}
        <div className="w-full md:w-1/2 p-4">
          <div
            className="relative w-full h-[500px] overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setSelectedImage(product.imageUrl)}
          >
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>

          {product.isFeatured && (
            <span className="inline-block bg-yellow-300 text-sm font-semibold px-2 py-1 rounded-full mt-1">
              ⭐ Featured
            </span>
          )}

          <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>

          {product.fabric && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              <strong>Fabric:</strong> {product.fabric}
            </p>
          )}

          {/* Fix: Use our safe piecesIncluded array instead of product.piecesIncluded */}
          {piecesIncluded.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Pieces Included</h2>
              <ul className="list-disc pl-5">
                {piecesIncluded.map((piece, index) => (
                  <li key={index} className="text-gray-700">
                    {piece}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xl">
            {product.discountedPrice ? (
              <>
                <span className="text-gray-500 dark:text-gray-200 line-through">PKR {product.price}</span>
                <span className="text-blue-600 font-bold">PKR {product.discountedPrice}</span>
              </>
            ) : (
              <span className="text-blue-600 font-bold">PKR {product.price}</span>
            )}
          </div>

          {/* Size Radio Buttons */}
          {product.sizeOptions?.length ? (
            <div className="mt-4 w-full max-w-full">
              <p className="block mb-1 text-sm font-medium">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {/* Size Chart */}
          {product.sizeChart?.asset.url && (
            <div className="mt-6 w-full max-w-full">
              <p className="text-sm font-medium mb-2">Size Chart</p>
              <div
                className="relative w-full h-80 overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedImage(product.sizeChart?.asset.url || "")}
              >
                <Image
                  src={product.sizeChart.asset.url || "/placeholder.svg"}
                  alt="Size Chart"
                  fill
                  className="border rounded-md object-contain"
                />
              </div>
            </div>
          )}
          {product.colorOptions?.length ? (
            <div className="mt-4 w-full max-w-full">
              <p className="block mb-1 text-sm font-medium">Select Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colorOptions.map((color) => (
                  <label key={color} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {/* Add to Cart */}
          <div className="mt-6 group">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg 
           shadow-sm hover:bg-blue-700 hover:shadow-md 
           active:bg-blue-700 active:shadow-md 
           transition duration-300 ease-in-out"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {product.gallery?.length ? (
        <div className="w-full mt-10 p-4">
          <h3 className="text-lg font-semibold mb-4">Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {product.gallery.map((imgObj, idx) => (
              <div
                key={idx}
                className="relative w-full h-40 border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(imgObj.asset.url)}
              >
                <Image
                  src={imgObj.asset.url || "/placeholder.svg"}
                  alt={`${product.title} thumbnail`}
                  fill
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
                  <p className="mt-2 text-gray-700 dark:text-gray-200">{review.review}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-200 italic">
                    - {review.author}
                    {review.createdAt && <> • {timeAgo(review.createdAt)}</>}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-200 italic">No reviews yet.</p>
        )}

        {!reviewFormVisible && (
          <div className="mt-10">
            <button
              onClick={() => setReviewFormVisible(true)}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-all duration-300"
            >
              Leave a Review
            </button>
          </div>
        )}

        {reviewFormVisible && (
          <div className="mt-6 max-w-lg border rounded-lg p-6 shadow bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const rating = Number((form.elements.namedItem("rating") as HTMLInputElement).value)
                const review = (form.elements.namedItem("review") as HTMLTextAreaElement).value
                const author = (form.elements.namedItem("author") as HTMLInputElement).value

                try {
                  await handleReviewSubmit(rating, review, author)
                  // Optional: clear form or hide form after submission
                  form.reset()
                } catch (err) {
                  console.error("Review submission failed:", err)
                  alert("Error submitting review. Please try again.")
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  required
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-white text-gray-800 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating (1–5)
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  min={1}
                  max={5}
                  required
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-white text-gray-800 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                  Review
                </label>
                <textarea
                  name="review"
                  id="review"
                  rows={3}
                  required
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-white text-gray-800 border-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className={`w-full py-2 px-4 text-white text-sm font-semibold rounded-md transition 
          ${isSubmittingReview ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* You May Also Like Section */}
      <div className="mt-16">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">You May Also Like</h3>

        {relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <Link href={getProductUrl(item)} key={item._id} className="block group">
                <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 ease-in-out bg-white">
                  <div className="relative w-full h-80">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title || "Product Image"}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition">
                      {item.title}
                    </h4>
                    <div className="text-sm mt-2">
                      {item.discountedPrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">PKR {item.price}</span>
                          <span className="text-blue-600 font-bold">PKR {item.discountedPrice}</span>
                        </>
                      ) : (
                        <span className="text-blue-600 font-bold">PKR {item.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading related products...</p>
        )}

        {/* Modal for Image Preview */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4">
            <div className="relative max-w-[95vw] max-h-[95vh]">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Full View"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white text-black p-2 rounded-full text-lg hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ProductDetail
