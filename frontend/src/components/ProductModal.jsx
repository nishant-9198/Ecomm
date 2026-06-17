import { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";
import { Truck, RotateCcw, ShieldCheck, Heart, Minus, Plus } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "./ui/InfiniteScroll";
import { getProductsPaged } from "../utils/getProducts";

const ProductModal = ({ product, onClose }) => {
  const { user, setUser } = useContext(AppContext);
  const [activeProduct, setActiveProduct] = useState(product);

  // Sync activeProduct when prop changes
  useEffect(() => {
    setActiveProduct(product);
  }, [product]);

  // ✅ LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ✅ PARSE ATTRIBUTES
  const colorsList = useMemo(() => {
    return activeProduct?.colors
      ? activeProduct.colors.split(",").map((c) => c.trim()).filter(Boolean)
      : ["Default"];
  }, [activeProduct]);

  const sizesList = useMemo(() => {
    return activeProduct?.sizes
      ? activeProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["One Size"];
  }, [activeProduct]);

  // ✅ LOCAL STATE
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  // Reset local selection states when activeProduct changes
  useEffect(() => {
    if (activeProduct) {
      setSelectedColor(colorsList[0] || "Default");
      setSelectedSize(sizesList[0] || "One Size");
      setQuantity(1);
      setActiveTab("details");
    }
  }, [activeProduct, colorsList, sizesList]);

  // Load related products using Infinite Scroll
  const {
    data: relatedData,
    fetchNextPage: fetchNextRelatedPage,
    hasNextPage: hasNextRelatedPage,
    isFetchingNextPage: isFetchingNextRelatedPage,
    status: relatedStatus
  } = useInfiniteQuery({
    queryKey: ["relatedProducts", activeProduct?.id, activeProduct?.category],
    queryFn: ({ pageParam = 1 }) =>
      getProductsPaged({
        page: pageParam,
        pageSize: 4, // Page size of 4 for small compact list
        category: activeProduct?.category || "ALL",
        search: ""
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!activeProduct
  });

  // Extract and filter current product out of related items
  const relatedItems = useMemo(() => {
    if (!relatedData || !activeProduct) return [];
    const items = relatedData.pages.reduce((acc, pageObj) => {
      return [...acc, ...(pageObj.items || [])];
    }, []);
    return items.filter((item) => item.id !== activeProduct.id);
  }, [relatedData, activeProduct]);

  if (!activeProduct) return null;

  // ✅ DYNAMIC REVIEW COUNT BASED ON PRODUCT ID
  const reviewsCount = activeProduct.id 
    ? (typeof activeProduct.id === "string" ? activeProduct.id.charCodeAt(0) % 40 + 20 : activeProduct.id % 40 + 20) 
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
          ...activeProduct,
          quantity: quantity,
          selectedColor: selectedColor,
          selectedSize: selectedSize
        }
      ],
    }));

    toast(`${activeProduct.name} added to cart`);
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
        className="modal-container-scroll relative z-10 w-full max-w-4xl bg-gradient-to-br from-[#020617] via-black to-[#020617] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)] p-6 md:p-8 max-h-[90vh] overflow-y-auto"
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
                <img src={activeProduct.img} alt="thumbnail" className="object-contain max-h-full" />
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
                src={activeProduct.img}
                alt={activeProduct.name}
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
              {activeProduct.brand || "SHOP EASE"}
            </p>

            {/* TITLE */}
            <h2 className="text-xl md:text-2xl font-serif font-light tracking-wide text-white leading-snug">
              {activeProduct.name}
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
              ₹{activeProduct.price?.toLocaleString()}
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
                {activeProduct.inStock ? "12 available" : "Out of stock"}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={addToCart}
                disabled={!activeProduct.inStock}
                className={`
                  flex-1 py-3 text-[10px] tracking-[0.25em] uppercase transition duration-300 font-medium cursor-pointer border
                  ${
                    activeProduct.inStock
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
                <p>{activeProduct.description}</p>
                <ul className="space-y-1 pl-4 list-disc text-white/45">
                  {activeProduct.material && <li>Material: {activeProduct.material}</li>}
                  {activeProduct.brand && <li>Brand: {activeProduct.brand}</li>}
                  {activeProduct.category && <li className="capitalize">Style: {activeProduct.category}</li>}
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

        {/* ✅ RELATED PRODUCTS SECTION (Infinite Scroll) */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-sm font-serif font-light tracking-wide uppercase text-white/95 mb-6 text-left">
            You Might Also Like
          </h3>
          {relatedStatus === "pending" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 border border-white/5 rounded-xl p-3 h-44" />
              ))}
            </div>
          ) : relatedItems.length === 0 ? (
            <p className="text-xs text-white/40 text-left">No related products found</p>
          ) : (
            <InfiniteScroll
              loadMore={fetchNextRelatedPage}
              hasMore={!!hasNextRelatedPage}
              isLoading={isFetchingNextRelatedPage}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {relatedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveProduct(item);
                      const container = document.querySelector(".modal-container-scroll");
                      if (container) {
                        container.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)] transition cursor-pointer group"
                  >
                    <div className="h-24 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                      <img src={item.img} alt={item.name} className="h-full object-contain group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-medium text-white line-clamp-1 leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-yellow-400 font-serif">₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
