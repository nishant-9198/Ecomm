import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../utils/getProducts";

const Home = () => {
  const { search } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]); // ✅ NEW

  // ✅ LOAD PRODUCTS (backend / local / fallback)
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  // ✅ FILTER
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-black to-[#020617]">

      {/* ✅ HEADER */}
      <div className="px-6 md:px-12 pt-10 pb-6">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
          {search ? `Results for "${search}"` : "Explore Collection"}
        </h2>

        <p className="text-white/50 text-sm mt-2">
          Discover premium products designed for modern living.
        </p>
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
      <div className="px-6 md:px-12 py-16 text-center border-t border-white/10">
        <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
          Designed for modern lifestyles. Every product is crafted with detail,
          precision, and purpose — bringing elegance into everyday living.
        </p>
      </div>

      {/* ✅ FOOTER */}
      <div className="px-6 md:px-12 py-8 border-t border-white/10 text-sm text-white/50 flex flex-col md:flex-row justify-between gap-4">
        <span>© 2026 ShopEase</span>
        <span>Instagram • Twitter • Contact</span>
      </div>

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