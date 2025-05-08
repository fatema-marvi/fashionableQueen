"use client"; // Add this directive to indicate it's a client component

import { useState, ChangeEvent, FormEvent } from "react";

// Define types for form data
interface FormData {
  title: string;
  description: string;
  price: string;
  discountedPrice: string;
  fabric: string;
  sizeOptions: string;
  category: string;
  image: File | null;
  gallery: File[];
  sizeChart: File | null;
}

export default function AdminPanel() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    discountedPrice: "",
    fabric: "",
    sizeOptions: "",
    category: "",
    image: null,
    gallery: [],
    sizeChart: null,
  });

  // handleChange
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      if (name === "gallery") {
        setFormData((prev) => ({ ...prev, gallery: Array.from(files) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handleSubmit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();

    // Append all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "gallery" && Array.isArray(value)) {
        value.forEach((file) => data.append("gallery", file));
      } else if (key !== "sizeOptions") {
        data.append(key, value as string | Blob); // Specify appropriate types for the FormData
      } else {
        // Handling sizeOptions as a JSON string to send as an array
        data.append(key, JSON.stringify(value));
      }
    });

    const res = await fetch("/api/products", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ Product added successfully!");
    } else {
      alert("❌ Failed to add product: " + result.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Admin Panel – Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          name="title"
          type="text"
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border"
        />
        {/* Description */}
        <textarea
          name="description"
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border"
        />
        {/* Price */}
        <input
          name="price"
          type="number"
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border"
        />
        {/* Discounted Price */}
        <input
          name="discountedPrice"
          type="number"
          onChange={handleChange}
          placeholder="Discounted Price"
          className="w-full p-2 border"
        />
        {/* Fabric */}
        <input
          name="fabric"
          type="text"
          onChange={handleChange}
          placeholder="Fabric"
          className="w-full p-2 border"
        />
        {/* Size Options */}
        <input
          name="sizeOptions"
          type="text"
          onChange={handleChange}
          placeholder='Sizes (e.g. ["S","M","L"])'
          className="w-full p-2 border"
        />
        {/* Category Dropdown */}
        <label>Category:</label>
        <select
          name="category"
          onChange={handleChange}
          className="w-full p-2 border"
          value={formData.category}
        >
          <option value="">-- Select Category --</option>
          <option value="stitched">Stitched</option>
          <option value="unstitched">Unstitched</option>
          <option value="trouser">Trouser</option>
        </select>

        {/* Images */}
        <label>Thumbnail Image:</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <label>Gallery Images:</label>
        <input
          name="gallery"
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
        />

        <label>Size Chart:</label>
        <input
          name="sizeChart"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}
