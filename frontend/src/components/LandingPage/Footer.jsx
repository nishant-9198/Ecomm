import { motion } from "framer-motion";
import { useRef } from "react";

// ✅ DATA
import { navLinks } from "../../LandingData/products";

// ✅ OPTIONAL GSAP HOOK (safe)
import { useGsapReveal } from "../../hooks/useGsapReveal";

const footerLinks = {
  Shop: ["New Arrivals", "Dresses", "Tailoring", "Accessories"],
  House: ["Our Story", "Atelier", "Sustainability", "Careers"],
  Client: ["Contact", "Shipping", "Returns", "Size Guide"],
};

export default function Footer() {
  return (
    <footer id="footer" className="w-full relative py-20">

      {/* ✅ BACKGROUND BLEND */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black pointer-events-none" />

      {/* ✅ OPTIONAL LEFT GRADIENT MATCH */}
      <div className="absolute left-0 top-0 h-full w-[30vw] max-w-[420px] bg-gradient-to-r from-[#0a0f2c] via-[#0a0f2c] to-transparent opacity-80 pointer-events-none" />

      {/* ✅ CONTENT */}
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

          <div>
            <h2 className="text-xl tracking-widest text-white">
              SHOP <span className="font-semibold">EASE</span>
            </h2>

            <p className="text-white/50 text-sm mt-3 max-w-sm">
              Discover timeless fashion crafted with precision,
              elegance, and modern design.
            </p>
          </div>

          <div className="flex gap-12">

            <div>
              <p className="text-white/60 mb-3">Company</p>
              <ul className="space-y-2 text-white/40 text-sm">
                <li>About</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>

            <div>
              <p className="text-white/60 mb-3">Support</p>
              <ul className="space-y-2 text-white/40 text-sm">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>

          </div>

        </div>

        {/* ✅ DIVIDER */}
        <div className="border-t border-white/10 mb-6" />

        {/* ✅ BOTTOM */}
        <div className="text-center text-white/30 text-sm">
          © 2026 Shop Ease. All rights reserved.
        </div>

      </div>
    </footer>
  );
}