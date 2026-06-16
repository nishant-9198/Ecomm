import { ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { navLinks } from "../../LandingData/products";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); // ✅ IMPORTANT

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 w-screen z-50 backdrop-blur-md bg-black/40"
    >
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-6 py-4">

        {/* ✅ LOGO */}
        <h1 className="text-xl md:text-2xl tracking-widest text-white font-light">
          SHOP <span className="font-semibold">EASE</span>
        </h1>

        {/* ✅ NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ✅ RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* ✅ USER ICON */}
          <Icon
            onClick={() => navigate("/login")}
            className="hidden sm:flex"
          >
            <User className="h-4 w-4" />
          </Icon>

          {/* ✅ BAG */}
          <div
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center gap-2 text-sm text-white/70 hover:text-white transition cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            Bag (0)
          </div>

          {/* ✅ CONTACT */}
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-5 py-2 rounded-full text-sm cursor-pointer"
          >
            Explore 
          </motion.button>

        </div>

      </div>
    </motion.header>
  );
}

// ✅ FIXED ICON COMPONENT (VERY IMPORTANT)
function Icon({ children, className = "", onClick }) {
  return (
    <button
      onClick={onClick}  // ✅ THIS WAS MISSING EARLIER
      className={`h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition ${className}`}
    >
      {children}
    </button>
  );
}