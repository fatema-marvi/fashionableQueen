"use client";
import { useCart } from "@/app/components/context/cartContext";
import Image from "next/image";
import { useEffect } from "react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    console.log("🛒 Cart contents:", cart);
  }, [cart]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fashionable-queen.vercel.app/"; // Replace as needed

  const handleCheckout = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

   const message = cart
  .map((item, index) => {
    const rawImageUrl = item.imageUrl || "";
    const imageUrl = rawImageUrl.startsWith("http")
      ? rawImageUrl
      : `${baseUrl}${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`;

    return `${index + 1}) ${item.name}
Size: ${item.selectedSize || "N/A"}, Color: ${item.selectedColor || "N/A"}, Qty: ${item.quantity}
Price: PKR ${item.price.toFixed(2)}
Image: ${imageUrl}`;
  })
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 250;

    const finalMessage = `Hello! I'd like to place the following order:\n\n${message}\n\nGrand Total: PKR ${total.toFixed(2)}`;

    const whatsappURL = `https://wa.me/923232979158?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappURL, "_blank");
  };

  const deliveryCharge = 0;
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
              className="flex items-center border-b py-4"
            >
             <Image
  src={
    item.imageUrl?.startsWith("http")
      ? item.imageUrl
      : item.imageUrl
        ? `${baseUrl}${item.imageUrl}`
        : "/placeholder.svg"
  }
  alt={item.name}
  width={80}
  height={80}
  className="rounded-lg"
/>

              <div className="ml-4 flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  Size: {item.selectedSize} | Color: {item.selectedColor}
                </p>
                <p className="text-gray-800 font-semibold">PKR {item.price.toFixed(2)}</p>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.selectedSize, item.selectedColor, Math.max(1, item.quantity - 1))
                    }
                    className="px-2 py-1 bg-gray-200 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                className="text-red-600 ml-4"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <p>Subtotal: PKR {subtotal.toFixed(2)}</p>
            <p>Delivery Charges: PKR {deliveryCharge}</p>
            <p className="text-lg font-bold">Grand Total: PKR {grandTotal.toFixed(2)}</p>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={clearCart} className="text-red-600">
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Checkout via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
