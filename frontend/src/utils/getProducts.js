import { Product as StaticProducts } from "../data/Product";
import { apiFetch } from "./api";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// Helper to get raw products (static + local storage)
export const getRawProductsLocal = () => {
  const localProducts = JSON.parse(localStorage.getItem("products")) || [];
  const map = new Map();

  StaticProducts.forEach((product) => {
    map.set(product.id, product);
  });

  localProducts.forEach((product) => {
    map.set(product.id, product);
  });

  return Array.from(map.values());
};

// Client-side pagination helper for fallback
export const getPagedProductsLocal = (
  allProducts,
  { page = 1, pageSize = 20, search = "", category = "ALL", brand = "", minPrice, maxPrice, rating, inStock, sortBy }
) => {
  let filtered = [...allProducts];

  // Search filter
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }

  // Category filter
  if (category && category !== "ALL") {
    filtered = filtered.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Brand filter
  if (brand) {
    filtered = filtered.filter(
      (p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  // Price filter
  if (minPrice !== undefined && minPrice !== "" && minPrice !== null) {
    filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== "" && maxPrice !== null) {
    filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
  }

  // Availability filter
  if (inStock !== undefined && inStock !== "" && inStock !== null) {
    const stockBool = inStock === "true" || inStock === true;
    filtered = filtered.filter((p) => p.inStock === stockBool);
  }

  // Rating filter (Mock 4.5 average for local products)
  if (rating !== undefined && rating !== "" && rating !== null) {
    const minRating = parseFloat(rating);
    // Mock rating: items with even IDs are 5 stars, odd are 4 stars
    filtered = filtered.filter((p) => {
      const pRating = p.id % 2 === 0 ? 5 : 4;
      return pRating >= minRating;
    });
  }

  // Sorting
  if (sortBy) {
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

// Main paginated fetcher
export const getProductsPaged = async (params) => {
  const {
    page = 1,
    pageSize = 20,
    search = "",
    category = "ALL",
    brand = "",
    minPrice = "",
    maxPrice = "",
    rating = "",
    inStock = "",
    sortBy = ""
  } = params;

  if (useBackend) {
    try {
      const queryParams = new URLSearchParams({
        paged: "true",
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: search || "",
        category: category || "ALL",
        brand: brand || "",
        minPrice: minPrice?.toString() || "",
        maxPrice: maxPrice?.toString() || "",
        rating: rating?.toString() || "",
        inStock: inStock?.toString() || "",
        sortBy: sortBy || ""
      });

      const res = await apiFetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.log("Backend paginated fetch failed → falling back to local");
    }
  }

  const raw = getRawProductsLocal();
  return getPagedProductsLocal(raw, params);
};

// Legacy backward-compatible export
export const getProducts = async () => {
  if (useBackend) {
    try {
      const res = await apiFetch("/api/products");
      return await res.json();
    } catch {
      console.log("Backend failed → fallback static");
    }
  }
  return getRawProductsLocal();
};
