"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SlideHeader = () => {
  return (
    <motion.div
      className="bg-yellow-600 text-white py-2 flex items-center justify-center px-4 relative"
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, duration: 1 }}
    >
      {/* Animated Truck Icon */}
      <motion.div
        className="absolute left-0"
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 5,
          ease: "linear",
        }}
      >
        <Image
          src="/truck.png" // Replace with your own truck image path
          alt="Courier Truck"
          width={50}
          height={50}
          priority
        />
      </motion.div>

      {/* Centered FREE DELIVERY Text */}
      <div className="flex items-center space-x-3 justify-center">
        <span className="text-4xl text-green-800 font-semibold">FREE DELIVERY</span>
      </div>
    </motion.div>
  );
};

export default SlideHeader;
