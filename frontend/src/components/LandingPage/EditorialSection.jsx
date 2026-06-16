import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ ADD

import {
  models,
  getRelativePosition,
} from "../../LandingData/products";

import { useAutoCarousel } from "../../hooks/useAutoCarousel";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import { SafeImage } from "./SafeImage";
import CarouselDots from "./CarouselDots";
import NavArrows from "./NavArrows";

export default function EditorialSection() {
  const sectionRef = useRef(null);
  const navigate = useNavigate(); // ✅ ADD

  const isLg = useMediaQuery("(min-width: 1024px)");

  const {
    activeIndex,
    next,
    prev,
    pause,
    resume,
    setActiveIndex,
  } = useAutoCarousel({
    total: models.length,
    interval: 4500,
  });

  const orderedModels = models
    .map((model, index) => ({
      model,
      index,
      relativePos: getRelativePosition(
        index,
        activeIndex,
        models.length
      ),
    }))
    .filter(({ relativePos }) => Math.abs(relativePos) <= 1)
    .sort((a, b) => a.relativePos - b.relativePos);

  return (
    <section id="atelier" ref={sectionRef} className="w-full py-20">

      {/* ✅ MAIN */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex items-center justify-between gap-12">

        {/* ✅ LEFT */}
        <div className="max-w-[520px]">
          <p className="text-xs tracking-widest text-white/40 mb-4">
            The Atelier
          </p>

          <h2 className="text-[clamp(2.5rem,4.5vw,3.5rem)] font-light leading-[1.2] text-white">
            Where craft meets <br />
            <span className="italic text-white/70">
              contemporary elegance
            </span>
          </h2>

          <p className="text-white/50 text-sm mt-6 leading-relaxed">
            Each piece is cut, draped, and finished by hand in our Paris atelier —
            a celebration of precision, restraint, and quiet luxury.
          </p>

          <motion.a
            href="#"
            whileHover={{ x: 3 }}
            className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-white/70 hover:text-white transition"
          >
            Discover the process
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </div>

        {/* ✅ RIGHT SIDE */}
        <div
          className="flex flex-col justify-end gap-6 min-h-[340px]"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >

          {/* ✅ CAROUSEL */}
          <div className="flex items-end justify-center gap-4">
            {orderedModels.map(({ model, relativePos }) => {
              const isCenter = relativePos === 0;

              return (
                <motion.div
                  key={model.id}
                  onClick={() => navigate("/login")} // ✅ CLICK HANDLER
                  animate={{
                    x: relativePos * 40,
                    y: isCenter ? -10 : 0,
                    scale: isCenter ? 1.05 : 0.9,
                    opacity: isCenter ? 1 : 0.6,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="relative w-[180px] md:w-[220px] aspect-[2/3] shrink-0 overflow-hidden rounded-[10px] cursor-pointer" // ✅ POINTER
                >
                  {/* ✅ IMAGE */}
                  <SafeImage
                    src={model.cardImage}
                    alt={model.collection}
                    className="w-full h-full object-cover"
                  />

                  {/* ✅ OVERLAY */}
                  <div className="absolute inset-0 bg-black/25" />
                </motion.div>
              );
            })}
          </div>

          {/* ✅ CONTROLS */}
          <div className="flex items-center justify-between mt-2">
            <CarouselDots
              total={models.length}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />

            <NavArrows onPrev={prev} onNext={next} />
          </div>

        </div>

      </div>
    </section>
  );
}
