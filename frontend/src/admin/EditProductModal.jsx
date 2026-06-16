import { useState } from "react";

const EditProductModal = ({ product, onClose }) => {
  const [form, setForm] = useState({ ...product });
  const [image, setImage] = useState(product.img);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE UPDATE
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = () => {
    const updatedProduct = {
      ...form,
      price: Number(form.price),
      img: image,
    };

    const existing =
      JSON.parse(localStorage.getItem("products")) || [];

    const updatedList = existing.map((p) =>
      p.id === product.id ? updatedProduct : p
    );

    localStorage.setItem("products", JSON.stringify(updatedList));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

      <div className="
        w-[750px] max-h-[90vh] overflow-y-auto p-8 rounded-xl
        bg-gradient-to-br from-[#020617] via-black to-[#020617]
        border border-white/10
      ">

        {/* ✅ HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-yellow-400 text-xl">
            Edit Product
          </h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* ✅ IMAGE */}
        <input type="file" onChange={handleImageUpload} className="input mb-4" />

        {image && (
          <img src={image} className="w-20 mb-4 rounded" />
        )}

        {/* ✅ FORM */}
        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input col-span-2"
          />

          <input name="brand" value={form.brand || ""} onChange={handleChange} className="input" />
          <input name="category" value={form.category || ""} onChange={handleChange} className="input" />

          <input name="price" value={form.price} onChange={handleChange} className="input" />
          <input name="material" value={form.material || ""} onChange={handleChange} className="input" />

          <input name="sizes" value={form.sizes || ""} onChange={handleChange} className="input col-span-2" />
          <input name="colors" value={form.colors || ""} onChange={handleChange} className="input col-span-2" />

          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="input col-span-2 h-24"
          />

        </div>

        {/* ✅ FOOTER */}
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleUpdate}
            className="
              bg-yellow-400 px-5 py-2 text-black rounded
              hover:shadow-[0_0_20px_rgba(250,204,21,0.6)]
            "
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;
