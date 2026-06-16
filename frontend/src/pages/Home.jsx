import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../utils/getProducts";
import Footer from "../components/LandingPage/Footer";

const Home = () => {
  const { search } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]); // ✅ NEW
  const [selectedCategory, setSelectedCategory] = useState("ALL"); // ✅ CATEGORY STATE

  // ✅ LOAD PRODUCTS (backend / local / fallback)
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  // ✅ DYNAMIC CATEGORIES EXTRACT
  const categories = [
    "ALL",
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

  // ✅ FILTER BY SEARCH AND CATEGORY
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-black to-[#020617] flex flex-col justify-between">

      <div>
        {/* ✅ HEADER */}
        <div className="px-6 md:px-12 pt-10 pb-6">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
            {search ? `Results for "${search}"` : "Explore Collection"}
          </h2>

          <p className="text-white/50 text-sm mt-2">
            Discover premium products designed for modern living.
          </p>
        </div>

        {/* ✅ CATEGORIES FILTER BAR */}
        <div className="px-6 md:px-12 pb-8 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 text-xs tracking-wider uppercase border rounded-md
                transition duration-300 cursor-pointer
                ${
                  selectedCategory === cat
                    ? "bg-yellow-400 text-black border-yellow-400 font-semibold shadow-[0_0_15px_rgba(250,204,21,0.35)]"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ✅ PRODUCTS */}
        <div className="px-6 md:px-12 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="transform transition duration-300 hover:-translate-y-2"
                >
                  <ProductCard
                    product={product}
                    setSelectedProduct={setSelectedProduct}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-20">
                <p className="text-white/50">No products found</p>
              </div>
            )}

          </div>
        </div>

        {/* ✅ STORY */}
        <div className="px-6 md:px-12 py-16 text-center border-t border-white/10 bg-black/20">
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Designed for modern lifestyles. Every product is crafted with detail,
            precision, and purpose — bringing elegance into everyday living.
          </p>
        </div>
      </div>

      {/* ✅ PREMIUM FOOTER */}
      <Footer />

      {/* ✅ MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};

export default Home;