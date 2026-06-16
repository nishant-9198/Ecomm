import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SafeImage } from "./SafeImage";

export function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <article
      onClick={handleClick}
      className="group flex cursor-pointer flex-col"
    >
      {/* ✅ IMAGE */}
      <div className="relative mb-4 overflow-hidden rounded-[8px] bg-black">

        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6 }}
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover object-center"
            loading="lazy"
            draggable={false}
          />
        </motion.div>

        {/* ✅ DARK OVERLAY (MAIN FIX ✅) */}
        <div className="absolute inset-0 bg-black/35" />

        {/* ✅ CATEGORY TAG (VISIBLE ✅) */}
        <span
          className="
            absolute top-3 left-3
            px-3 py-1 text-[10px] font-medium
            rounded-full
            bg-black/60 text-white
            backdrop-blur-md
          "
        >
          {product.category}
        </span>

        {/* ✅ WISHLIST */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Add to wishlist"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        >
          <Heart className="h-3.5 w-3.5" />
        </motion.button>

      </div>

      {/* ✅ DETAILS */}
      <div className="space-y-1">

        <div className="flex items-start justify-between gap-3">

          <h3 className="text-sm font-medium text-white line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-white/80 shrink-0">
            €{product.price}
          </p>

        </div>

        <p className="text-xs text-white/60">
          ★ {product.rating.toFixed(1)}
        </p>

      </div>
    </article>
  );
}