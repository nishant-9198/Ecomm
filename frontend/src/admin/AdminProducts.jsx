import { useEffect, useState } from "react";
import { getProducts } from "../utils/getProducts";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

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
  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  // ✅ SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl text-yellow-400">Products</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-yellow-400 text-black px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* ✅ SEARCH */}
      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 bg-black border border-white/10 rounded"
      />

      {/* ✅ COUNT */}
      <p className="text-gray-400 mb-2 text-sm">
        {filtered.length} PRODUCTS
      </p>

      {/* ✅ TABLE */}
      <div className="border border-white/10 rounded overflow-hidden">

        <table className="w-full text-sm">
          <thead className="text-white/50 border-b border-white/10">
            <tr>
              <th className="p-3 text-left">IMAGE</th>
              <th className="p-3 text-left">PRODUCT</th>
              <th className="p-3">CATEGORY</th>
              <th className="p-3">PRICE</th>
              <th className="p-3">STOCK</th>
              <th className="p-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/10">

                {/* ✅ IMAGE */}
                <td className="p-3">
                  <div className="w-12 h-12 bg-gray-800 flex items-center justify-center overflow-hidden rounded">
                    {typeof p.img === "string" ? (
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      p.img
                    )}
                  </div>
                </td>

                {/* ✅ NAME */}
                <td className="p-3">
                  {p.name || "Untitled Product"}
                </td>

                {/* ✅ CATEGORY */}
                <td className="p-3 text-center">
                  {p.category || "General"}
                </td>

                {/* ✅ PRICE */}
                <td className="p-3 text-center text-yellow-400">
                  ₹{p.price}
                </td>

                {/* ✅ STOCK */}
                <td className="p-3 text-green-400 text-center">
                  In Stock
                </td>

                {/* ✅ ACTIONS */}
                <td className="p-3 flex justify-center gap-3">

                  {/* ✅ EDIT */}
                  <button
                    onClick={() => setEditProduct(p)}
                    className="text-blue-400 hover:scale-110 transition"
                  >
                    ✏️
                  </button>

                  {/* ✅ DELETE */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 hover:scale-110 transition"
                  >
                    🗑
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
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