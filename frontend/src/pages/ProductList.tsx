import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  Grid,
  List as ListIcon,
  ChevronDown,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { productService } from "@/services/product.service";
import { Product, MetalType, GoldPurity, GemstoneType } from "@/types/product.types";
import { motion, AnimatePresence } from "framer-motion";

const METALS: MetalType[] = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum"];
const PURITIES: GoldPurity[] = ["14K", "18K", "22K", "24K", "950 Platinum"];
const GEMSTONES: GemstoneType[] = ["Diamond", "Emerald", "Ruby", "Sapphire", "Pearl"];
const GENDERS = ["Women", "Men", "Unisex"];

export const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get("category") || "";
  const tagParam = searchParams.get("tag") || "";
  const collectionParam = searchParams.get("collection") || "";
  const searchParam = searchParams.get("search") || "";

  // Filter States
  const [selectedMetals, setSelectedMetals] = useState<MetalType[]>([]);
  const [selectedPurities, setSelectedPurities] = useState<GoldPurity[]>([]);
  const [selectedGemstones, setSelectedGemstones] = useState<GemstoneType[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mobile Drawers
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data & Loading
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await productService.getProducts({
        category: categoryParam || undefined,
        search: searchParam || undefined,
        metal: selectedMetals.length > 0 ? selectedMetals : undefined,
        purity: selectedPurities.length > 0 ? selectedPurities : undefined,
        gemstone: selectedGemstones.length > 0 ? selectedGemstones : undefined,
        gender: selectedGenders.length > 0 ? selectedGenders : undefined,
        maxPrice: priceRange,
        availability: inStockOnly || undefined,
        sort: sortBy as any,
      });

      let list = res.products;
      if (minRating > 0) {
        list = list.filter((p) => p.rating >= minRating);
      }
      if (tagParam === "new-arrivals") {
        list = list.filter((p) => p.isNewArrival);
      }
      if (collectionParam) {
        list = list.filter((p) => p.collection?.toLowerCase().includes(collectionParam.toLowerCase()));
      }

      setProducts(list);
      setLoading(false);
      setCurrentPage(1);
    };

    fetchProducts();
  }, [
    categoryParam,
    tagParam,
    collectionParam,
    searchParam,
    selectedMetals,
    selectedPurities,
    selectedGemstones,
    selectedGenders,
    priceRange,
    inStockOnly,
    minRating,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSelectedMetals([]);
    setSelectedPurities([]);
    setSelectedGemstones([]);
    setSelectedGenders([]);
    setPriceRange(500000);
    setInStockOnly(false);
    setMinRating(0);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedMetals.length > 0 ||
    selectedPurities.length > 0 ||
    selectedGemstones.length > 0 ||
    selectedGenders.length > 0 ||
    priceRange < 500000 ||
    inStockOnly ||
    minRating > 0 ||
    Boolean(categoryParam || tagParam || collectionParam || searchParam);

  // Pagination Slice
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageTitle = categoryParam
    ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Collection`
    : tagParam === "new-arrivals"
    ? "New In: Royal Spring Launches"
    : collectionParam
    ? "Curated Editorial Collections"
    : searchParam
    ? `Search Results for "${searchParam}"`
    : "Fine Jewellery Catalogue";

  const FilterSidebarContent = (
    <div className="space-y-6 text-xs font-body text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-display font-bold text-sm tracking-wide">
          <SlidersHorizontal size={15} className="text-[#C5A880]" />
          <span>Filter Selection</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-[11px] font-semibold text-[#997D4D] hover:underline flex items-center gap-1"
          >
            <RotateCcw size={11} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Price Range */}
      <div className="space-y-2">
        <div className="flex justify-between font-semibold">
          <span>Max Price</span>
          <span className="text-[#997D4D] font-bold">₹{priceRange.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={25000}
          max={500000}
          step={10000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#C5A880] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>₹25,000</span>
          <span>₹5,00,000+</span>
        </div>
      </div>

      {/* 2. Metal Type */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block">
          Precious Metal
        </span>
        <div className="space-y-1.5">
          {METALS.map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer hover:text-[#997D4D]">
              <input
                type="checkbox"
                checked={selectedMetals.includes(m)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedMetals([...selectedMetals, m]);
                  else setSelectedMetals(selectedMetals.filter((x) => x !== m));
                }}
                className="rounded border-border accent-[#C5A880]"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Gold Purity */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block">
          Purity & Karats
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {PURITIES.map((p) => (
            <button
              key={p}
              onClick={() => {
                if (selectedPurities.includes(p)) {
                  setSelectedPurities(selectedPurities.filter((x) => x !== p));
                } else {
                  setSelectedPurities([...selectedPurities, p]);
                }
              }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border text-center transition-all ${
                selectedPurities.includes(p)
                  ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D]"
                  : "border-border text-foreground hover:border-[#C5A880]/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Gemstone */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block">
          Gemstones & Pearls
        </span>
        <div className="space-y-1.5">
          {GEMSTONES.map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-[#997D4D]">
              <input
                type="checkbox"
                checked={selectedGemstones.includes(g)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedGemstones([...selectedGemstones, g]);
                  else setSelectedGemstones(selectedGemstones.filter((x) => x !== g));
                }}
                className="rounded border-border accent-[#C5A880]"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Gender */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block">
          Gender
        </span>
        <div className="flex gap-2">
          {GENDERS.map((gen) => (
            <button
              key={gen}
              onClick={() => {
                if (selectedGenders.includes(gen)) {
                  setSelectedGenders(selectedGenders.filter((x) => x !== gen));
                } else {
                  setSelectedGenders([...selectedGenders, gen]);
                }
              }}
              className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
                selectedGenders.includes(gen)
                  ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D]"
                  : "border-border text-foreground"
              }`}
            >
              {gen}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Availability */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-border accent-[#C5A880] w-4 h-4"
          />
        </label>
      </div>

      {/* 7. Rating */}
      <div className="pt-2 border-t border-border space-y-2">
        <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block">
          Minimum Rating
        </span>
        <div className="flex gap-2">
          {[4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
                minRating === r
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-600"
                  : "border-border text-foreground"
              }`}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-background min-h-screen py-6 lg:py-10">
      <SEOHead title={pageTitle} description={`Browse ${products.length} luxury jewellery pieces at Jewelo.`} />

      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-body">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            Catalogue
          </Link>
          {categoryParam && (
            <>
              <span>/</span>
              <span className="text-foreground capitalize">{categoryParam}</span>
            </>
          )}
        </nav>

        {/* Page Title & Summary Header */}
        <div className="mb-8 space-y-1">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-body">
            Showing <strong className="text-foreground">{products.length}</strong> certified handcrafted jewellery masterpieces
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="p-3.5 mb-6 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-3 shadow-sm">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg bg-secondary text-xs font-semibold text-foreground border border-border"
          >
            <Filter size={14} className="text-[#C5A880]" />
            <span>Filters ({selectedMetals.length + selectedPurities.length + (inStockOnly ? 1 : 0)})</span>
          </button>

          {/* Active Tags Summary */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            {selectedMetals.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A880]/15 text-[#997D4D] text-[11px] font-semibold border border-[#C5A880]/30"
              >
                {m}
                <X
                  size={12}
                  className="cursor-pointer hover:text-destructive"
                  onClick={() => setSelectedMetals(selectedMetals.filter((x) => x !== m))}
                />
              </span>
            ))}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 text-[11px] font-semibold">
                In Stock
                <X size={12} className="cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary/70 text-foreground text-xs rounded-lg px-2.5 py-1.5 border border-border focus:border-[#C5A880] outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Best Sellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-[#C5A880] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list" ? "bg-[#C5A880] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                title="List view"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Catalog Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 p-5 rounded-2xl bg-card border border-border shadow-sm sticky top-28">
            {FilterSidebarContent}
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9 space-y-8">
            {loading ? (
              // Loading Skeleton
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3 space-y-3 animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              // Empty State
              <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center text-[#C5A880]">
                  <Sparkles size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  No matching jewellery found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto font-body">
                  We could not find items matching your current filter criteria. Try expanding your price range or resetting applied tags.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow transition-all hover:bg-[#B39366]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              // Products Grid
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Page <strong className="text-foreground">{currentPage}</strong> of{" "}
                  <strong className="text-foreground">{totalPages}</strong>
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded border border-border disabled:opacity-40 text-foreground hover:bg-secondary font-semibold"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                        currentPage === idx + 1
                          ? "bg-[#C5A880] text-white shadow"
                          : "border border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded border border-border disabled:opacity-40 text-foreground hover:bg-secondary font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-xs sm:max-w-sm bg-background border-l border-border flex flex-col shadow-2xl p-5 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <h3 className="font-display font-bold text-base text-foreground">
                    Filter Catalogue
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                {FilterSidebarContent}

                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg"
                  >
                    Apply Filters ({products.length} Results)
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;