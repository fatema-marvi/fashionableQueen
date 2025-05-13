"use client";

import React from "react";
import Image from "next/image"; // ✅ Add this
import StitchPage from "./stitch/page";
import UnStitchPage from "./unstitch/page";
import TrouserPage from "./trouser/page";
import { motion } from "framer-motion";
import { SlideHeader } from "./components/Header/page"; // ✅ Import Header

// Reusable Section Heading with Gradient Colors & Animation
interface SectionHeadingProps {
  text: string;
  gradient: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ text, gradient }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-3xl font-extrabold text-center mb-1 bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}
    >
      {text}
    </motion.h2>
  );
};

const Home = () => {
  return (
    
    <div>
      {/* ✅ Header with Animation */}
      <SlideHeader />
      {/* ✅ Hero Image below Navbar */}
      <div className="relative w-full h-[200px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] mb-4">
  <Image
    src="/hero.jpeg"
    alt="Hero Image"
    fill
    className="object-contain object-top"
  />
</div>

      {/* Stitched Section */}
      <section className="w-full flex flex-col items-center">
        <SectionHeading
          text="✨ Stitched Collection"
          gradient="from-purple-500 via-pink-500 to-red-500"
        />
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <StitchPage />
        </div>
      </section>

      {/* Unstitched Section */}
      <section className="w-full flex flex-col items-center">
        <SectionHeading
          text="🌸 Unstitched Collection"
          gradient="from-green-400 via-blue-500 to-purple-600"
        />
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <UnStitchPage />
        </div>
      </section>

      {/* Trouser Section */}
      <section className="w-full flex flex-col items-center">
        <SectionHeading
          text="🌟 Trouser Collection"
          gradient="from-yellow-400 via-orange-500 to-pink-500"
        />
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <TrouserPage />
        </div>
      </section>
    </div>
  );
};

export default Home;
