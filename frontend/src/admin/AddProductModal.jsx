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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

      {/* ✅ MODAL BOX */}
      <div className="
        w-[750px] max-h-[90vh] overflow-y-auto p-8 rounded-xl
        bg-gradient-to-br from-[#020617] via-black to-[#020617]
        border border-white/10
        shadow-[0_0_40px_rgba(250,204,21,0.1)]
      ">

        {/* ✅ HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-yellow-400">Add Product</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">✖</button>
        </div>

        {/* ✅ IMAGE */}
        <div className="mb-4">
          <label className="text-xs text-gray-400">PRODUCT IMAGE *</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="input mt-1"
          />

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-20 h-20 object-cover mt-2 rounded border border-white/10"
            />
          )}
        </div>

        {/* ✅ FORM GRID */}
        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="input col-span-2"
          />

          <input name="brand" placeholder="Brand" onChange={handleChange} className="input" />
          <input name="category" placeholder="Category" onChange={handleChange} className="input" />

          <input name="price" placeholder="Price" onChange={handleChange} className="input" />
          <input name="material" placeholder="Material" onChange={handleChange} className="input" />

          <input name="sizes" placeholder="Sizes (S,M,L)" onChange={handleChange} className="input col-span-2" />
          <input name="colors" placeholder="Colors" onChange={handleChange} className="input col-span-2" />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="input col-span-2 h-24"
          />

        </div>

        {/* ✅ FLAGS */}
        <div className="flex gap-6 text-sm mt-4">

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => setFlags({ ...flags, inStock: e.target.checked })}
            />
            In Stock
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={(e) => setFlags({ ...flags, newArrival: e.target.checked })}
            />
            New Arrival
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={(e) => setFlags({ ...flags, featured: e.target.checked })}
            />
            Featured
          </label>

        </div>

        {/* ✅ FOOTER */}
        <div className="flex justify-end gap-4 mt-6">

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="
              bg-yellow-400 text-black px-5 py-2 rounded-md font-semibold
              transition duration-300
              hover:bg-yellow-500
              hover:shadow-[0_0_20px_rgba(250,204,21,0.7)]
              active:scale-95
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