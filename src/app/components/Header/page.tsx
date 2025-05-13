"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const SlideHeader = () => {
  return (
    <motion.div
      className="bg-gradient-to-r from-rose-500 to-amber-950 text-white py-0.5 w-full fixed top-0 left-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 flex justify-center items-center relative h-8">
        {/* Moving Truck Animation */}
        <motion.div
          className="absolute left-4"
          animate={{ x: ["-100%", "120vw"] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "linear"
          }}
        >
          <Image
            src="/truck.png"
            alt="Free Delivery"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        </motion.div>

        {/* Announcement Text */}
        <span className="text-xs md:text-sm font-bold tracking-wider whitespace-nowrap">
          🚚 FREE NATIONWIDE DELIVERY ON ALL ORDERS 🚚
        </span>
      </div>
    </motion.div>
  );
};