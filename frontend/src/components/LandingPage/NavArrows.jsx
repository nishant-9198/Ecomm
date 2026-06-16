import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavArrows({ onPrev, onNext }) {
  return (
    <div className="flex items-center gap-3">

      <ArrowButton onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </ArrowButton>

      <ArrowButton onClick={onNext}>
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </ArrowButton>

    </div>
  );
}

// ✅ PREMIUM BUTTON
function ArrowButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="
        flex h-11 w-11 items-center justify-center
        rounded-full
        bg-white/10
        hover:bg-white/20
        text-white
        backdrop-blur-md
        transition-all duration-300
      "
    >
      {children}
    </motion.button>
  );
}