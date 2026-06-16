import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ✅ Custom Brand SVGs since brand icons are removed in lucide-react
const InstagramIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837z" />
    <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="black" />
  </svg>
);

export default function Footer() {
  return (
    <footer id="footer" className="w-full relative py-16 bg-black text-white border-t border-white/5">

      {/* ✅ BACKGROUND BLEND & LEFT GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/85 to-black pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-[30vw] max-w-[420px] bg-gradient-to-r from-[#0a0f2c]/40 via-transparent to-transparent pointer-events-none" />

      {/* ✅ CONTENT */}
      <div className="relative max-w-[1250px] mx-auto px-6 md:px-10">

        {/* ✅ SHOP EASE LARGE OUTLINED BANNER */}
        <div className="w-full flex flex-col items-center justify-center pt-4 pb-16 select-none">
          <h1 className="shop-ease-outline-logo text-[8vw] md:text-[9vw] leading-none uppercase text-center cursor-default">
            SHOP EASE
          </h1>
          <div className="w-2.5 h-2.5 rounded-full bg-[#6c7bff]/70 mt-6 shadow-[0_0_10px_#6c7bff]" />
        </div>

        {/* ✅ FIVE COLUMNS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 relative z-10 text-left">

          {/* COLUMN 1: BRAND INFO */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base tracking-[0.2em] font-serif font-light text-white uppercase">
                SHOP EASE
              </h2>
              <p className="text-white/40 text-xs mt-3 leading-relaxed max-w-[220px]">
                Crafted for those who understand that elegance is the only true luxury.
              </p>
            </div>
            
            {/* SOCIAL ICONS */}
            <div className="flex gap-4 items-center">
              <a
                href="#"
                className="text-white/40 hover:text-white transition duration-300 p-2 rounded-full border border-white/5 hover:border-white/20 bg-white/5"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white transition duration-300 p-2 rounded-full border border-white/5 hover:border-white/20 bg-white/5"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white transition duration-300 p-2 rounded-full border border-white/5 hover:border-white/20 bg-white/5"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* COLUMN 2: COLLECTIONS */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-5">
              Collections
            </h3>
            <ul className="space-y-3 text-xs text-white/40">
              {["Women", "Men", "Bags", "Shoes", "Accessories", "New Arrivals", "Sale"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition duration-200 block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-5">
              Company
            </h3>
            <ul className="space-y-3 text-xs text-white/40">
              {["Our Story", "Sustainability", "Craftsmanship", "Careers", "Press", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition duration-200 block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CLIENT SERVICES */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-5">
              Client Services
            </h3>
            <ul className="space-y-3 text-xs text-white/40">
              {[
                "Shipping & Returns",
                "Size Guide",
                "Care Instructions",
                "Order Tracking",
                "FAQs",
                "Contact Us"
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition duration-200 block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: THE ATELIER LETTER */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-widest text-white/50 uppercase">
              The Atelier Letter
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-[220px]">
              Private access to new arrivals, exclusive editorials, and invitations to events.
            </p>
            
            {/* EMAIL SUBSCRIPTION */}
            <div className="relative mt-2 max-w-[220px]">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-xs focus:outline-none focus:border-white transition duration-300 pr-8 text-white placeholder-white/25"
              />
              <button
                type="button"
                className="absolute right-0 bottom-2 text-white/40 hover:text-white transition duration-300 cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* ✅ DIVIDER */}
        <div className="border-t border-white/10 mb-6" />

        {/* ✅ BOTTOM */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-xs">
          <span>© 2026 ShopEase. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}