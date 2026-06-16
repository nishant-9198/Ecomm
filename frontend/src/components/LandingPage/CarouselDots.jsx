import { motion } from "framer-motion";

export default function CarouselDots({
  total,
  activeIndex,
  onSelect,
}) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">

      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="group flex items-center justify-center"
          >
            <motion.span
              animate={{
                width: isActive ? 28 : 6,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                block h-[6px] rounded-full
                bg-white
                transition-all
              "
            />
          </button>
        );
      })}

    </div>
  );
}
