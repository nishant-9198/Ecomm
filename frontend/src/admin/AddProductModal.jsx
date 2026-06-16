import { useState } from "react";
import { apiFetch } from "../utils/api";

const AddProductModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    material: "",
    sizes: "",
    colors: "",
    description: "",
  });

  const [flags, setFlags] = useState({
    inStock: true,
    newArrival: false,
    featured: false,
  });

  const [image, setImage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name || !form.price || !image) {
      alert("Fill all required fields");
      return;
    }

    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    
    const newProduct = {
      ...form,
      price: Number(form.price),
      img: image,
      ...flags,
    };

    if (useBackend) {
      try {
        const res = await apiFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(newProduct)
        });
        if (!res.ok) {
          alert("Failed to create product on backend");
          return;
        }
      } catch (err) {
        alert("Error connecting to backend");
        return;
      }
    } else {
      // ✅ LOCAL STORAGE
      const localProduct = {
        id: Date.now() + Math.random(),
        ...newProduct
      };
      const existing =
        JSON.parse(localStorage.getItem("products")) || [];

      localStorage.setItem(
        "products",
        JSON.stringify([...existing, localProduct])
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">

      {/* ✅ MODAL BOX */}
      <div className="
        w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl
        bg-[#09090b] border border-white/10
        shadow-[0_0_50px_rgba(0,0,0,0.8)]
        relative
      ">

        {/* ✅ HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h2 className="text-lg tracking-[0.2em] uppercase font-light text-white">
            Add New <span className="font-semibold text-yellow-400">Product</span>
          </h2>
          <button 
            onClick={onClose} 
            className="text-white/40 hover:text-white hover:scale-110 transition duration-200 cursor-pointer"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ✅ IMAGE UPLOAD SECTION */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-white/[0.01] border border-white/5">
          <div className="flex-1 w-full">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">
              Product Image <span className="text-yellow-400">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="
                mt-2 block w-full text-xs text-white/40
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-semibold
                file:bg-white/5 file:text-white/70
                file:cursor-pointer hover:file:bg-white/10
                file:transition-all duration-300
              "
            />
          </div>

          {image && (
            <div className="relative group">
              <img
                src={image}
                alt="preview"
                className="w-20 h-20 object-cover rounded-xl border border-white/15 shadow-md"
              />
              <button 
                onClick={() => setImage("")}
                className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] border border-black hover:bg-rose-600 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* ✅ FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Product Title *</label>
            <input
              name="name"
              placeholder="e.g. Modern Desk Lamp"
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Brand</label>
            <input name="brand" placeholder="e.g. Atelier Noir" onChange={handleChange} className="input" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Category</label>
            <input name="category" placeholder="e.g. Home Decor" onChange={handleChange} className="input" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Price (₹) *</label>
            <input name="price" placeholder="e.g. 1299" onChange={handleChange} className="input" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Material</label>
            <input name="material" placeholder="e.g. Brushed Brass" onChange={handleChange} className="input" />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Sizes (Comma separated)</label>
            <input name="sizes" placeholder="e.g. Standard, Custom" onChange={handleChange} className="input" />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Colors (Comma separated)</label>
            <input name="colors" placeholder="e.g. Gold, Matte Black, Charcoal" onChange={handleChange} className="input" />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Description</label>
            <textarea
              name="description"
              placeholder="Provide a detailed description of the product features, specifications, and aesthetics..."
              onChange={handleChange}
              className="input h-28 resize-none"
            />
          </div>

        </div>

        {/* ✅ FLAGS */}
        <div className="flex flex-wrap gap-6 text-xs mt-6 p-4 rounded-xl bg-white/[0.01] border border-white/5">

          <label className="flex gap-2.5 items-center text-white/70 hover:text-white cursor-pointer transition select-none">
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => setFlags({ ...flags, inStock: e.target.checked })}
              className="accent-yellow-400 w-4 h-4 cursor-pointer"
            />
            In Stock
          </label>

          <label className="flex gap-2.5 items-center text-white/70 hover:text-white cursor-pointer transition select-none">
            <input
              type="checkbox"
              onChange={(e) => setFlags({ ...flags, newArrival: e.target.checked })}
              className="accent-yellow-400 w-4 h-4 cursor-pointer"
            />
            New Arrival
          </label>

          <label className="flex gap-2.5 items-center text-white/70 hover:text-white cursor-pointer transition select-none">
            <input
              type="checkbox"
              onChange={(e) => setFlags({ ...flags, featured: e.target.checked })}
              className="accent-yellow-400 w-4 h-4 cursor-pointer"
            />
            Featured
          </label>

        </div>

        {/* ✅ FOOTER */}
        <div className="flex justify-end items-center gap-4 mt-8 border-t border-white/5 pt-5">

          <button
            onClick={onClose}
            className="
              px-6 py-3 bg-transparent text-white/60 border border-white/10 hover:border-white/30 hover:text-white
              text-[10px] tracking-[0.2em] uppercase font-bold transition duration-300 rounded-md cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="
              bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-md
              text-[10px] tracking-[0.2em] uppercase font-extrabold transition-all duration-300
              shadow-[0_4px_14px_rgba(250,204,21,0.25)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.45)]
              active:scale-95 cursor-pointer
            "
          >
            Create Product
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddProductModal;