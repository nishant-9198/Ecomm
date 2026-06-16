import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

import { products } from "../../LandingData/products";
import { ProductCard } from "./ProductCard";

export default function CollectionSection() {
  const trackRef = useRef(null);

  const loopItems = [...products, ...products]; // ✅ duplicate for infinite loop

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    // ✅ START POSITION
    gsap.set(track, { x: 0 });

    // ✅ FINAL PERFECT LOOP (NO BREAK ✅)
    gsap.to(track, {
      x: -totalWidth,
      duration: 25, // speed (reduce = faster, increase = slower)
      ease: "none",
      repeat: -1,

      // ✅ MAGIC PART (INFINITE WITHOUT RESET)
      modifiers: {
        x: (x) => {
          return `${parseFloat(x) % totalWidth}px`;
        },
      },
    });

  }, []);

  return (
    <section  id="collections" className="w-full py-16 md:py-20">

      {/* ✅ HEADER */}
      <div className="max-w-[1200px] mx-auto flex items-end justify-between px-6 md:px-10 mb-12">

        <div>
          <p className="text-xs tracking-widest text-white/40 mb-3">
            Curated Selection
          </p>

          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-light text-white">
            The Collection
          </h2>
        </div>

        <motion.a
          href="#"
          whileHover={{ x: 3 }}
          className="hidden sm:flex items-center gap-1 text-sm text-white/60 hover:text-white transition"
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </motion.a>

      </div>

      {/* ✅ CAROUSEL */}
      <div className="w-full overflow-hidden">

        {/* ✅ CENTER WRAPPER */}
        <div className="max-w-[1200px] mx-auto flex justify-center overflow-hidden">

          {/* ✅ TRACK */}
          <div
            ref={trackRef}
            className="flex w-max gap-6 will-change-transform"
          >
            {loopItems.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-[180px] sm:w-[200px] md:w-[220px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}