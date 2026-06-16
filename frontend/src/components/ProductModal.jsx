import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";
import { Truck, RotateCcw, ShieldCheck, Heart, Minus, Plus } from "lucide-react";

const ProductModal = ({ product, onClose }) => {
  const { user, setUser } = useContext(AppContext);

  // ✅ LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ✅ PARSE ATTRIBUTES
  const colorsList = product?.colors
    ? product.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : ["Default"];

  const sizesList = product?.sizes
    ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    : ["One Size"];

  // ✅ LOCAL STATE
  const [selectedColor, setSelectedColor] = useState(colorsList[0]);
  const [selectedSize, setSelectedSize] = useState(sizesList[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  if (!product) return null;

  // ✅ DYNAMIC REVIEW COUNT BASED ON PRODUCT ID
  const reviewsCount = product.id 
    ? (typeof product.id === "string" ? product.id.charCodeAt(0) % 40 + 20 : product.id % 40 + 20) 
    : 31;

  const addToCart = () => {
    if (!user?.name) {
      toast("Please login first");
      return;
    }

    setUser((prev) => ({
      ...prev,
      cart: [
        ...(prev.cart || []),
        {
          ...product,
          quantity: quantity,
          selectedColor: selectedColor,
          selectedSize: selectedSize
        }
      ],
    }));

    toast(`${product.name} added to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* ✅ BACKDROP */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* ✅ MODAL CONTAINER */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10
          w-full max-w-4xl
          bg-gradient-to-br from-[#020617] via-black to-[#020617]
          border border-white/10
          rounded-2xl
          shadow-[0_0_50px_rgba(0,0,0,0.95)]
          p-6 md:p-8
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* ✅ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-white text-xl cursor-pointer transition z-20"
        >
          ✕
        </button>

        {/* ✅ CONTENT LAYOUT */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT: IMAGE COLUMN */}
          <div className="w-full md:w-1/2 flex gap-4">
            
            {/* THUMBNAIL PREVIEWS (DESKTOP) */}
            <div className="hidden sm:flex flex-col gap-3">
              <div className="w-16 h-16 bg-white/5 border border-white/20 rounded-lg overflow-hidden p-1 flex items-center justify-center cursor-default">
                <img src={product.img} alt="thumbnail" className="object-contain max-h-full" />
              </div>
              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center cursor-not-allowed opacity-40">
                <span className="text-[10px] text-white/30 text-center font-light uppercase tracking-wider">
                  View 2
                </span>
              </div>
            </div>

            {/* MAIN IMAGE CONTAINER */}
            <div
              className="
                flex-1 relative
                bg-white/5
                rounded-2xl
                border border-white/5
                flex items-center justify-center
                h-[280px] sm:h-[380px]
                overflow-hidden
                group
                transition-all duration-500 ease-out
                hover:shadow-2xl hover:shadow-yellow-400/10
              "
            >
              <img
                src={product.img}
                alt={product.name}
                className="
                  max-h-full object-contain
                  transition-transform duration-700 ease-out
                  group-hover:scale-105
                "
              />
              
              {/* IMAGE HOVER GLOW */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            </div>

          </div>

          {/* RIGHT: DETAILS COLUMN */}
          <div className="w-full md:w-1/2 flex flex-col text-left">
            
            {/* BRAND */}
            <p className="text-[10px] tracking-[0.25em] font-sans font-light text-white/40 uppercase mb-1">
              {product.brand || "SHOP EASE"}
            </p>

            {/* TITLE */}
            <h2 className="text-xl md:text-2xl font-serif font-light tracking-wide text-white leading-snug">
              {product.name}
            </h2>

            {/* RATINGS */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-yellow-400 text-xs tracking-tighter select-none">★★★★★</span>
              <span className="text-[11px] text-white/50 font-light mt-0.5">
                4.8 ({reviewsCount} reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="text-2xl font-serif font-light text-white mt-4">
              ₹{product.price?.toLocaleString()}
            </div>

            <div className="border-t border-white/10 my-4" />

            {/* COLOR SELECTOR */}
            <div className="mb-4">
              <p className="text-[10px] tracking-widest text-white/40 uppercase mb-2.5">
                Color: <span className="text-white font-medium ml-1">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      px-3 py-1.5 text-xs tracking-wider uppercase border transition duration-300 cursor-pointer
                      ${
                        selectedColor === color
                          ? "bg-white text-black border-white font-medium"
                          : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                      }
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2.5">
                <p className="text-[10px] tracking-widest text-white/40 uppercase">
                  Size: <span className="text-white font-medium ml-1">{selectedSize}</span>
                </p>
                <button className="text-[10px] tracking-widest text-white/40 hover:text-white transition uppercase cursor-pointer">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      w-11 h-11 text-[11px] tracking-widest uppercase border flex items-center justify-center transition duration-300 cursor-pointer
                      ${
                        selectedSize === size
                          ? "bg-white text-black border-white font-medium"
                          : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY COUNTER & STOCK */}
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center border border-white/10 rounded-md bg-white/5 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1.5 text-white/60 hover:text-white transition hover:bg-white/5 cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-xs font-medium text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1.5 text-white/60 hover:text-white transition hover:bg-white/5 cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="text-[11px] text-white/40 font-light">
                {product.inStock ? "12 available" : "Out of stock"}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={addToCart}
                disabled={!product.inStock}
                className={`
                  flex-1 py-3 text-[10px] tracking-[0.25em] uppercase transition duration-300 font-medium cursor-pointer border
                  ${
                    product.inStock
                      ? "bg-white text-black border-white hover:bg-transparent hover:text-white"
                      : "bg-white/5 text-white/20 border-white/5 cursor-not-allowed"
                  }
                `}
              >
                Add to Bag
              </button>
              <button className="px-3 py-3 border border-white/10 hover:border-white/30 rounded-md hover:bg-white/5 text-white/50 hover:text-white transition cursor-pointer">
                <Heart size={15} />
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM: VALUE BADGES */}
        <div className="border-t border-white/10 mt-10 pt-6 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={16} className="text-white/60" />
            <span className="text-[10px] text-white/50 font-light">Free shipping over ₹5,000</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw size={16} className="text-white/60" />
            <span className="text-[10px] text-white/50 font-light">Free returns within 30 days</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={16} className="text-white/60" />
            <span className="text-[10px] text-white/50 font-light">Authenticity guaranteed</span>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 mb-5" />

        {/* BOTTOM: INFORMATION TABS */}
        <div className="text-left">
          
          {/* TAB BUTTONS */}
          <div className="flex border-b border-white/5 mb-4 gap-6">
            {[
              { id: "details", label: "Product Details" },
              { id: "care", label: "Care" },
              { id: "shipping", label: "Shipping & Returns" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-2.5 text-[10px] tracking-widest uppercase transition duration-200 font-medium cursor-pointer relative
                  ${activeTab === tab.id ? "text-white" : "text-white/30 hover:text-white/60"}
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="text-xs text-white/60 leading-relaxed font-light min-h-[90px]">
            {activeTab === "details" && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <ul className="space-y-1 pl-4 list-disc text-white/45">
                  {product.material && <li>Material: {product.material}</li>}
                  {product.brand && <li>Brand: {product.brand}</li>}
                  {product.category && <li className="capitalize">Style: {product.category}</li>}
                  <li>Status: In Stock</li>
                </ul>
              </div>
            )}
            
            {activeTab === "care" && (
              <div>
                Professional dry clean only. Do not bleach. Do not tumble dry. Iron on low heat.
              </div>
            )}
            
            {activeTab === "shipping" && (
              <ul className="space-y-1.5 pl-4 list-disc text-white/45">
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days (₹599)</li>
                <li>Free shipping on orders over ₹5,000</li>
                <li>Free returns within 30 days of delivery</li>
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductModal;

