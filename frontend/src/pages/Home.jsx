import { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { getProductsPaged, getRawProductsLocal } from "../utils/getProducts";
import Footer from "../components/LandingPage/Footer";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import Pagination from "../components/ui/Pagination";
import InfiniteScroll from "../components/ui/InfiniteScroll";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { apiFetch } from "../utils/api";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

const Home = () => {
  const { search } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  // Filter & Sorting States
  const [page, setPage] = useState(1);
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Determine active view mode
  const isSearchOrCategoryMode = useMemo(() => {
    return !!search || selectedCategory !== "ALL";
  }, [search, selectedCategory]);

  // Reset page to 1 when search or any filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, brand, minPrice, maxPrice, rating, inStock, sortBy]);

  // Query all categories for the filter buttons
  const { data: allCategories } = useQuery({
    queryKey: ["globalCategories"],
    queryFn: async () => {
      if (useBackend) {
        try {
          const res = await apiFetch("/api/products/categories");
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {
          console.log("Failed to load categories from backend, using local fallback");
        }
      }
      const raw = getRawProductsLocal();
      return [...new Set(raw.map((p) => p.category).filter(Boolean))];
    }
  });

  // CASE 1: Infinite Query for Home View (No search, category is "ALL")
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
    error: infiniteError,
    refetch: refetchInfinite
  } = useInfiniteQuery({
    queryKey: ["infiniteProducts"],
    queryFn: ({ pageParam = 1 }) =>
      getProductsPaged({
        page: pageParam,
        pageSize: 20,
        category: "ALL",
        search: ""
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !isSearchOrCategoryMode
  });

  // CASE 2: Standard Paged Query for Search/Category View (with filters and sorting)
  const {
    data: pagedData,
    status: pagedStatus,
    error: pagedError,
    refetch: refetchPaged
  } = useQuery({
    queryKey: [
      "pagedProducts",
      page,
      search,
      selectedCategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy
    ],
    queryFn: () =>
      getProductsPaged({
        page,
        pageSize: 20,
        search,
        category: selectedCategory,
        brand,
        minPrice,
        maxPrice,
        rating,
        inStock,
        sortBy
      }),
    enabled: isSearchOrCategoryMode
  });

  // Flattened items for Infinite Scroll list
  const infiniteItems = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.reduce((acc, pageObj) => {
      return [...acc, ...(pageObj.items || [])];
    }, []);
  }, [infiniteData]);

  // Query all products matching search (without category filter) to extract active categories
  const { data: searchAllData } = useQuery({
    queryKey: ["searchAllProducts", search],
    queryFn: () =>
      getProductsPaged({
        page: 1,
        pageSize: 1000,
        search,
        category: "ALL"
      }),
    enabled: !!search
  });

  // Compute available categories dynamically from searched products (or all categories if no search)
  const categoriesList = useMemo(() => {
    if (search) {
      const items = searchAllData?.items || [];
      const activeCats = [...new Set(items.map((p) => p.category).filter(Boolean))];
      return ["ALL", ...activeCats];
    }
    const base = ["ALL"];
    if (allCategories) {
      base.push(...allCategories);
    }
    return base;
  }, [search, allCategories, searchAllData]);

  // Auto-reset category to "ALL" if search changes and selected category is no longer available
  useEffect(() => {
    if (selectedCategory !== "ALL") {
      const isAvailable = categoriesList.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (!isAvailable) {
        setSelectedCategory("ALL");
      }
    }
  }, [categoriesList, selectedCategory]);

  const handleRetry = () => {
    if (isSearchOrCategoryMode) {
      refetchPaged();
    } else {
      refetchInfinite();
    }
  };

  // Render Loader State
  const isLoading = isSearchOrCategoryMode
    ? pagedStatus === "pending"
    : infiniteStatus === "pending";

  // Render Error State
  const isError = isSearchOrCategoryMode
    ? pagedStatus === "error"
    : infiniteStatus === "error";

  const errorMessage = isSearchOrCategoryMode
    ? pagedError?.message
    : infiniteError?.message;

  const currentProducts = isSearchOrCategoryMode
    ? pagedData?.items || []
    : infiniteItems;

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
          {categoriesList.map((cat) => (
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

        {/* ✅ FILTERS & PRODUCTS GRID */}
        <div className="px-6 md:px-12 pb-20 flex flex-col lg:flex-row gap-8 items-start">
          {/* ✅ DYNAMIC FILTERS BAR (only shown in Search or Category mode) */}
          {isSearchOrCategoryMode && (
            <div className="w-full lg:w-64 shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-white/80">Filters</h3>
              </div>

              {/* Sorting */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-white/40">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none cursor-pointer hover:border-white/30"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-white/40">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none cursor-pointer hover:border-white/30"
                >
                  <option value="">All Brands</option>
                  <option value="Lumina">Lumina</option>
                  <option value="Nomad">Nomad</option>
                  <option value="Acoustic">Acoustic</option>
                  <option value="Chronos">Chronos</option>
                  <option value="Sonic">Sonic</option>
                  <option value="Razer">Razer</option>
                  <option value="Intel">Intel</option>
                  <option value="Hydra">Hydra</option>
                  <option value="Ergo">Ergo</option>
                  <option value="Keychron">Keychron</option>
                  <option value="Nike">Nike</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-white/40">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none hover:border-white/30"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none hover:border-white/30"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-white/40">Avg. Customer Review</label>
                <div className="space-y-1.5 text-xs text-white/80">
                  <button
                    onClick={() => setRating(rating === "4" ? "" : "4")}
                    className={`flex items-center gap-1.5 w-full text-left transition ${
                      rating === "4" ? "text-yellow-400 font-medium" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span>★★★★☆</span> & Up
                  </button>
                  <button
                    onClick={() => setRating(rating === "3" ? "" : "3")}
                    className={`flex items-center gap-1.5 w-full text-left transition ${
                      rating === "3" ? "text-yellow-400 font-medium" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span>★★★☆☆</span> & Up
                  </button>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-white/40">Availability</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="instock"
                    checked={inStock === "true"}
                    onChange={(e) => setInStock(e.target.checked ? "true" : "")}
                    className="accent-yellow-400 rounded cursor-pointer"
                  />
                  <label htmlFor="instock" className="text-xs text-white/70 cursor-pointer select-none">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* GRID & PAGINATION AREA */}
          <div className="flex-1 w-full">
            {isLoading && currentProducts.length === 0 ? (
              <SkeletonLoader count={8} />
            ) : isError ? (
              <ErrorState description={errorMessage} onRetry={handleRetry} />
            ) : currentProducts.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Case 1: Infinite Scroll (Home mode) */}
                {!isSearchOrCategoryMode ? (
                  <InfiniteScroll
                    loadMore={fetchNextPage}
                    hasMore={!!hasNextPage}
                    isLoading={isFetchingNextPage}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {currentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="transform transition duration-300 hover:-translate-y-2"
                        >
                          <ProductCard
                            product={product}
                            setSelectedProduct={setSelectedProduct}
                          />
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                ) : (
                  /* Case 2: Paginated View (Search / Category Mode) */
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {currentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="transform transition duration-300 hover:-translate-y-2"
                        >
                          <ProductCard
                            product={product}
                            setSelectedProduct={setSelectedProduct}
                          />
                        </div>
                      ))}
                    </div>

                    <Pagination
                      page={page}
                      totalPages={pagedData?.totalPages || 1}
                      onPageChange={setPage}
                      hasNextPage={!!pagedData?.hasNextPage}
                      hasPreviousPage={!!pagedData?.hasPreviousPage}
                    />
                  </>
                )}
              </>
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