"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [piecesIncluded, setPiecesIncluded] = useState<string[]>([]);
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [sizeChart, setSizeChart] = useState<File | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountedPrice", discountedPrice);
    formData.append("sizeOptions", JSON.stringify(sizeOptions));
    formData.append("piecesIncluded", JSON.stringify(piecesIncluded));
    formData.append("fabric", fabric);
    formData.append("color", color);

    if (image) formData.append("image", image);
    if (gallery.length > 0) gallery.forEach((file) => formData.append("gallery", file));
    if (sizeChart) formData.append("sizeChart", sizeChart);

    try {
      const response = await axios.post("/api/products", formData);
      if (response.status === 200) {
        router.push("/admin"); // Redirect to admin panel or confirmation page
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium">Product Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block text-lg font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded mt-2"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-lg font-medium">Discounted Price</label>
            <input
              type="number"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Size Options (comma separated)</label>
          <input
            type="text"
            value={sizeOptions.join(",")}
            onChange={(e) => setSizeOptions(e.target.value.split(","))}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Size Options (comma separated)</label>
          <input
            type="text"
            value={piecesIncluded.join(",")}
            onChange={(e) => setPiecesIncluded(e.target.value.split(","))}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Fabric</label>
          <input
            type="text"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Product Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded mt-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Product Gallery</label>
          <input
            type="file"
            multiple
            onChange={(e) => setGallery(Array.from(e.target.files || []))}
            className="w-full p-2 border rounded mt-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Size Chart (Optional)</label>
          <input
            type="file"
            onChange={(e) => setSizeChart(e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border rounded mt-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md mt-4 w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );  
};

export default AdminPanel;
