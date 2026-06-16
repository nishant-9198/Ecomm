import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";

const ProductModal = ({ product, onClose }) => {
  const { user, setUser } = useContext(AppContext);

  // ✅ LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!product) return null;

  const addToCart = () => {
    if (!user?.name) {
      toast("Please login first");
      return;
    }

    setUser((prev) => ({
      ...prev,
      cart: [...(prev.cart || []), { ...product, quantity: 1 }],
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* ✅ UPDATED BACKDROP (LANDING STYLE) */}
      <div
        className="
          absolute inset-0
          bg-black/80
          backdrop-blur-lg
        "
        onClick={onClose}
      ></div>

      {/* ✅ UPDATED MODAL (LANDING THEME) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10
          w-full max-w-4xl

          /* ✅ LANDING THEME BACKGROUND */
          bg-gradient-to-br from-[#020617] via-black to-[#020617]

          backdrop-blur-xl
          border border-white/10
          rounded-xl

          /* ✅ SOFT DEPTH SHADOW */
          shadow-[0_0_40px_rgba(0,0,0,0.8)]

          p-6 md:p-8
        "
      >

        {/* ✅ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* ✅ CONTENT */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* ✅ IMAGE */}
          <div
            className="
              relative
              bg-white/5
              rounded-xl
              flex items-center justify-center
              h-[250px] md:h-[300px]
              overflow-hidden
              group
              transition-all duration-500 ease-out
              hover:shadow-2xl hover:shadow-yellow-400/20
              hover:scale-[1.02]
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

            {/* ✅ LIGHT GLOW */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t from-yellow-400/10 via-transparent to-transparent
                opacity-0
                group-hover:opacity-100
                transition duration-500
              "
            />
          </div>

          {/* ✅ DETAILS */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">

            <h2 className="text-lg md:text-2xl font-semibold text-white">
              {product.name}
            </h2>

            <p className="text-gray-400 text-sm">
              {product.description}
            </p>

            {/* ✅ PRICE */}
            <div className="text-2xl font-bold text-yellow-400">
              ₹{product.price}
            </div>

            {/* ✅ FEATURES */}
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✔ High quality product</li>
              <li>✔ Fast delivery available</li>
              <li>✔ Easy return policy</li>
            </ul>

            {/* ✅ BUTTON */}
            <button
              onClick={addToCart}
              className="
                mt-4
                bg-yellow-400 text-black
                hover:bg-yellow-500
                py-2 rounded-md font-semibold
                transition

                hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]
              "
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
