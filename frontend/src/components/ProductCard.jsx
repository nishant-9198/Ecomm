const ProductCard = ({ product, setSelectedProduct }) => {
  return (
    <div
      className="
        relative
        bg-white
        w-full
        rounded-xl
        border border-gray-200
        p-3
        flex flex-col
        transition-all duration-300 ease-out
        group

        /* ✅ GLOW EFFECT */
        hover:shadow-[0_0_25px_5px_rgba(250,204,21,0.4)]
        hover:border-yellow-400
      "
    >

      {/* ✅ IMAGE */}
      <div
        className="
          h-44 flex items-center justify-center
          bg-gray-100 rounded-md
          overflow-hidden
        "
      >
        <img
          src={product.img}
          alt={product.name}
          className="
            h-full object-contain
            transition-transform duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* ✅ CONTENT */}
      <div className="flex flex-col flex-grow mt-2">

        <p className="font-medium text-black">
          {product.name}
        </p>

        <p className="
  text-sm text-gray-500 mt-1
  line-clamp-2
  leading-[20px]
  h-[40px]
  overflow-hidden
">
          {product.description || ""}
        </p>
        ``

        {/* ✅ PRICE + BUTTON */}
        <div className="mt-auto flex justify-between items-center pt-3">

          <span className="font-semibold text-black">
            ₹{product.price}
          </span>

          <button
            onClick={() => setSelectedProduct(product)}
            className="
              bg-black text-white 
              px-3 py-1 rounded-md
              transition duration-300

              /* ✅ BUTTON GLOW */
              hover:bg-gray-800
              hover:shadow-[0_0_12px_rgba(250,204,21,0.6)]
            "
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;
