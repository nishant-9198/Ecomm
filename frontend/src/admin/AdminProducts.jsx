import { useEffect, useState } from "react";
import { getProducts } from "../utils/getProducts";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { apiFetch } from "../utils/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null); // ✅ NEW

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // ✅ DELETE PRODUCT
  const handleDelete = async (id) => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch(`/api/products/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) {
          alert("Failed to delete product from backend");
          return;
        }
      } catch (err) {
        alert("Error deleting product from backend");
        return;
      }
    }

    const updated = products.filter((p) => p.id !== id);

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  // ✅ SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl tracking-[0.15em] uppercase font-light text-white">
            Manage <span className="font-semibold text-yellow-400">Products</span>
          </h1>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.2em] font-semibold">
            Inventory & Catalog Management
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-full
            text-xs font-bold tracking-wider uppercase transition-all duration-300
            shadow-[0_4px_14px_rgba(250,204,21,0.2)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.35)]
            flex items-center gap-2 cursor-pointer active:scale-95
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ✅ SEARCH & INFO */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            placeholder="Search products by title, category, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl
              text-white text-xs outline-none transition-all duration-300
              placeholder-white/20 focus:border-yellow-400/30 focus:bg-white/[0.04]
              hover:border-white/20 focus:ring-0
            "
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 px-1">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/40">
            {filtered.length} {filtered.length === 1 ? "Product" : "Products"} Found
          </span>
        </div>
      </div>

      {/* ✅ TABLE CONTAINER */}
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40 border-b border-white/10 bg-white/[0.01]">
              <tr>
                <th className="p-4 text-center font-semibold w-24">Image</th>
                <th className="p-4 font-semibold">Product Detail</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right w-32">Price</th>
                <th className="p-4 font-semibold text-center w-36">Stock Status</th>
                <th className="p-4 font-semibold text-center w-32">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                  
                  {/* ✅ IMAGE */}
                  <td className="p-4">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden rounded-xl shadow-inner mx-auto">
                      {typeof p.img === "string" ? (
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        p.img
                      )}
                    </div>
                  </td>

                  {/* ✅ DETAILS */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white/95 text-sm">
                        {p.name || "Untitled Product"}
                      </span>
                      {p.brand && (
                        <span className="text-[9px] tracking-wider uppercase font-semibold text-white/30">
                          {p.brand}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ✅ CATEGORY */}
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/5 text-white/70">
                      {p.category || "General"}
                    </span>
                  </td>

                  {/* ✅ PRICE */}
                  <td className="p-4 text-right font-semibold text-yellow-400 text-sm font-serif">
                    ₹{p.price?.toLocaleString()}
                  </td>

                  {/* ✅ STOCK */}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      In Stock
                    </span>
                  </td>

                  {/* ✅ ACTIONS */}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5">
                      {/* ✅ EDIT */}
                      <button
                        onClick={() => setEditProduct(p)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-400 text-white/70 transition-all duration-300 cursor-pointer"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* ✅ DELETE */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-white/70 transition-all duration-300 cursor-pointer"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ ADD PRODUCT MODAL */}
      {open && (
        <AddProductModal
          onClose={() => {
            setOpen(false);
            loadProducts();
          }}
        />
      )}

      {/* ✅ EDIT PRODUCT MODAL */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => {
            setEditProduct(null);
            loadProducts();
          }}
        />
      )}

    </div>
  );
};

export default AdminProducts;