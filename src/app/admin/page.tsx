"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const AdminPanel = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState("")
  const [sizeOptionsText, setSizeOptionsText] = useState("")
  const [piecesIncludedText, setPiecesIncludedText] = useState("")
  const [fabric, setFabric] = useState("")
  const [color, setColor] = useState("")
  const [category, setCategory] = useState("product") // Default category
  const [image, setImage] = useState<File | null>(null)
  const [gallery, setGallery] = useState<File[]>([])
  const [sizeChart, setSizeChart] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!title || !description || !price || !fabric || !category || !image) {
        alert("Please fill all required fields and upload a product image")
        setIsSubmitting(false)
        return
      }

      // Convert comma-separated strings to arrays
      const sizeOptions = sizeOptionsText
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size.length > 0)

      const piecesIncluded = piecesIncludedText
        .split(",")
        .map((piece) => piece.trim())
        .filter((piece) => piece.length > 0)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("discountedPrice", discountedPrice || "0")
      formData.append("sizeOptions", JSON.stringify(sizeOptions))
      formData.append("piecesIncluded", JSON.stringify(piecesIncluded))
      formData.append("fabric", fabric)
      formData.append("color", color)
      formData.append("category", category)

      if (image) formData.append("image", image)
      if (gallery.length > 0) gallery.forEach((file) => formData.append("gallery", file))
      if (sizeChart) formData.append("sizeChart", sizeChart)

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        alert("Product added successfully!")
        // Reset form
        setTitle("")
        setDescription("")
        setPrice("")
        setDiscountedPrice("")
        setSizeOptionsText("")
        setPiecesIncludedText("")
        setFabric("")
        setColor("")
        setCategory("product")
        setImage(null)
        setGallery([])
        setSizeChart(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to add product"}`)
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-lg font-medium">Product Title*</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Product Category*</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          >
            <option value="product">General Product</option>
            <option value="stitch">Stitched</option>
            <option value="unstitch">Unstitched</option>
            <option value="trouser">Trouser</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Product Description*</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
            rows={4}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium">Price*</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded mt-2"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Discounted Price</label>
            <input
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="w-full p-2 border rounded mt-2"
              placeholder="Leave empty if no discount"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Size Options (comma separated)</label>
          <input
            type="text"
            value={sizeOptionsText}
            onChange={(e) => setSizeOptionsText(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            placeholder="S, M, L, XL"
          />
          <p className="text-sm text-gray-500 mt-1">Example: S, M, L, XL</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Pieces Included (comma separated)</label>
          <input
            type="text"
            value={piecesIncludedText}
            onChange={(e) => setPiecesIncludedText(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            placeholder="Top, Bottom, Dupatta"
          />
          <p className="text-sm text-gray-500 mt-1">Example: Top, Bottom, Dupatta</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Fabric*</label>
          <input
            type="text"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
            placeholder="Cotton, Lawn, Linen, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            placeholder="Red, Blue, Black, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Product Image*</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded mt-2"
            accept="image/*"
            required
          />
          {image && <p className="text-sm text-green-600 mt-1">Image selected: {image.name}</p>}
        </div>

        <div className="mb-4">
  <label className="block text-lg font-medium">Product Gallery (Optional)</label>
  <input
    type="file"
    multiple
    onChange={(e) =>
      setGallery(e.target.files && e.target.files.length > 0 ? Array.from(e.target.files) : [])
    }
    className="w-full p-2 border rounded mt-2"
    accept="image/*"
  />
  {gallery.length > 0 && (
    <p className="text-sm text-green-600 mt-1">{gallery.length} images selected</p>
  )}
</div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Size Chart (Optional)</label>
          <input
            type="file"
            onChange={(e) => setSizeChart(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded mt-2"
            accept="image/*"
          />
          {sizeChart && <p className="text-sm text-green-600 mt-1">Size chart selected: {sizeChart.name}</p>}
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white p-3 rounded-md mt-4 w-full ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  )
}

export default AdminPanel
