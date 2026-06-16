import { motion } from "framer-motion";
import Navbar from "./Navbar";
import FashionShowcase from "./FashionShowcase";

export default function HeroSection() {
  return (
    <section id="lookbook" className="min-h-screen w-full overflow-hidden pt-[80px] px-6 md:px-10 flex flex-col">

      {/* ✅ NAVBAR */}
      <Navbar />

      {/* ✅ MAIN LAYOUT (FIXED ✅) */}
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between gap-6">

        {/* ✅ LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="flex-shrink-0"
        >
          <h1 className="text-[clamp(3rem,6vw,5rem)] leading-[1.1]">

            <span className="bg-gradient-to-r from-white via-gray-300 to-[#9ca3ff] bg-clip-text text-transparent">
              Shop
            </span>

            <br />

            <span className="bg-gradient-to-r from-white via-gray-400 to-[#6c7bff] bg-clip-text text-transparent font-medium">
              Ease
            </span>

          </h1>
        </motion.div>

        {/* ✅ RIGHT SIDE (FIXED WIDTH + CENTERED) */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col max-w-[420px]"
        >
          <p className="text-xs tracking-widest text-white/40 mb-4">
            SPRING / SUMMER 2026
          </p>

          <h2 className="text-2xl md:text-3xl font-light leading-tight mb-4">
            Designed to make <br />
            <span className="italic text-white/70">
              an entrance
            </span>
          </h2>

          <p className="text-sm text-white/50 mb-8">
            Sculpted silhouettes, fluid fabrics and timeless looks
            crafted for modern elegance.
          </p>

          {/* ✅ CAROUSEL */}
          <div className="w-full overflow-hidden">
            <FashionShowcase />
          </div>

        </motion.div>

      </div>

    </section>
  );
}