import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

import {
  getCarouselSlot,
  getCarouselSlotMd,
} from "../../LandingData/products";

import { useIsMd } from "../../hooks/useMediaQuery";
import { SafeImage } from "./SafeImage";

export default function ModelCard({ model, index, relativePos }) {
  const [hasEntered, setHasEntered] = useState(false);
  const isMd = useIsMd();

  const navigate = useNavigate(); // ✅ ADD THIS

  const slot = isMd
    ? getCarouselSlotMd(relativePos)
    : getCarouselSlot(relativePos);

  const isCenter = relativePos === 0;

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (Math.abs(relativePos) > 2) return null;

  // ✅ CLICK HANDLER
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 80, scale: 0.75 }}
      animate={{
        width: slot.width,
        opacity: isCenter ? 1 : 0.6,
        y: slot.y,
        scale: isCenter ? 1.05 : 0.88,
      }}
      transition={{
        type: "spring",
        stiffness: hasEntered ? 150 : 90,
        damping: 24,
        delay: hasEntered ? 0 : index * 0.08,
      }}
      style={{ zIndex: slot.zIndex }}
      className="relative aspect-[2/3] shrink-0 max-w-[260px] md:max-w-[300px]"
    >
      <motion.div
        onClick={handleClick}  // ✅ ADD THIS LINE
        animate={{ y: [0, isCenter ? -8 : -4, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="group relative h-full w-full cursor-pointer" // ✅ already good
      >
        {/* ✅ IMAGE */}
        <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-black shadow-xl">

          <SafeImage
            src={model.image}
            alt={model.collection}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {!isCenter && (
            <div className="absolute inset-0 backdrop-blur-[1.5px] bg-black/40" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* ✅ LABEL */}
        <AnimatePresence>
          {isCenter && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-sm tracking-wide text-white/70">
                {model.collection}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}