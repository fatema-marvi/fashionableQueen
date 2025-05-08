import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/navbar/page"; // Adjust path if needed
import { CartProvider } from "./components/context/cartContext";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Fashionable Queen",
  description: "Best stitched, unstitched, and trouser collections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
