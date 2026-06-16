import { motion } from "framer-motion";

import { models, getRelativePosition } from "../../LandingData/products";
import { useAutoCarousel } from "../../hooks/useAutoCarousel";

import ModelCard from "./ModelCard";
import NavArrows from "./NavArrows";
import CarouselDots from "./CarouselDots";

export default function FashionShowcase() {
  const {
    activeIndex,
    next,
    prev,
    pause,
    resume,
    setActiveIndex,
  } = useAutoCarousel({
    total: models.length,
    interval: 4000,
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
    .filter(({ relativePos }) => Math.abs(relativePos) <= 2)
    .sort((a, b) => a.relativePos - b.relativePos);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-full overflow-hidden mt-8"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* ✅ CARDS */}
      <div className="w-full overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex justify-center">
          <div className="flex items-end gap-4 md:gap-6">

            {orderedModels.map(({ model, index, relativePos }) => (
              <ModelCard
                key={model.id}
                model={model}
                index={index}
                relativePos={relativePos}
              />
            ))}

          </div>
        </div>
      </div>

      {/* ✅ CONTROLS (FINAL FIX ✅) */}
      <div className="max-w-[1200px] mx-auto mt-6 flex items-center justify-center gap-6">

        <CarouselDots
          total={models.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        <NavArrows onPrev={prev} onNext={next} />

      </div>
    </motion.div>
  );
}