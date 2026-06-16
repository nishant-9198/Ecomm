import { Product as StaticProducts } from "../data/Product";
import { apiFetch } from "./api";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// ✅ FINAL FUNCTION
export const getProducts = async () => {

  // ✅ ✅ BACKEND MODE (SEPARATE ONLY)
  if (useBackend) {
    try {
      const res = await apiFetch("/api/products");
      const data = await res.json();

      return data || [];
    } catch {
      console.log("Backend failed → fallback static");
      return StaticProducts;
    }
  }

  // ✅ ✅ LOCAL STORAGE
  const localProducts =
    JSON.parse(localStorage.getItem("products")) || [];

  // ✅ ✅ FINAL FIX: MERGE + REMOVE DUPLICATES
  const map = new Map();

  // ✅ Add static first
  StaticProducts.forEach((product) => {
    map.set(product.id, product);
  });

  // ✅ Add local (overwrite if same ID)
  localProducts.forEach((product) => {
    map.set(product.id, product);
  });

  // ✅ FINAL ARRAY
  const mergedProducts = Array.from(map.values());

  return mergedProducts;
};
