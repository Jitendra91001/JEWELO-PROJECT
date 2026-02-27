import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { MATERIALS, GENDERS, OCCASIONS, PURITY_OPTIONS } from "@/utils/constants";

import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklaces from "@/assets/category-necklaces.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryBangles from "@/assets/category-bangles.jpg";

const allProducts = [
  { id: "1", name: "Royal Diamond Solitaire Ring", price: 45999, originalPrice: 52999, images: [categoryRings], rating: 4.8, material: "18K Gold", gender: "Women", occasion: "Wedding" },
  { id: "2", name: "Celestial Pearl Necklace", price: 32500, images: [categoryNecklaces], rating: 4.9, material: "22K Gold", gender: "Women", occasion: "Party" },
  { id: "3", name: "Teardrop Crystal Earrings", price: 18999, originalPrice: 22999, images: [categoryEarrings], rating: 4.7, material: "Rose Gold", gender: "Women", occasion: "Daily Wear" },
  { id: "4", name: "Heritage Gold Bangle Set", price: 65000, images: [categoryBangles], rating: 4.6, material: "22K Gold", gender: "Women", occasion: "Festival" },
  { id: "5", name: "Infinity Diamond Band", price: 28999, originalPrice: 34999, images: [categoryRings], rating: 4.9, material: "Platinum", gender: "Unisex", occasion: "Engagement" },
  { id: "6", name: "Lotus Pendant Necklace", price: 15999, images: [categoryNecklaces], rating: 4.5, material: "18K Gold", gender: "Women", occasion: "Daily Wear" },
  { id: "7", name: "Classic Hoop Earrings", price: 12500, originalPrice: 14999, images: [categoryEarrings], rating: 4.8, material: "14K Gold", gender: "Women", occasion: "Party" },
  { id: "8", name: "Twisted Rope Bangle", price: 38000, images: [categoryBangles], rating: 4.7, material: "22K Gold", gender: "Women", occasion: "Wedding" },
  { id: "9", name: "Men's Classic Gold Ring", price: 22000, images: [categoryRings], rating: 4.6, material: "22K Gold", gender: "Men", occasion: "Daily Wear" },
  { id: "10", name: "Diamond Cluster Necklace", price: 89000, originalPrice: 99999, images: [categoryNecklaces], rating: 5.0, material: "Diamond", gender: "Women", occasion: "Anniversary" },
  { id: "11", name: "Ruby Drop Earrings", price: 35000, images: [categoryEarrings], rating: 4.4, material: "18K Gold", gender: "Women", occasion: "Festival" },
  { id: "12", name: "Sleek Platinum Bangle", price: 55000, images: [categoryBangles], rating: 4.8, material: "Platinum", gender: "Women", occasion: "Party" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedMaterial) result = result.filter((p) => p.material === selectedMaterial);
    if (selectedGender) result = result.filter((p) => p.gender === selectedGender);
    if (selectedOccasion) result = result.filter((p) => p.occasion === selectedOccasion);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return result;
  }, [search, selectedMaterial, selectedGender, selectedOccasion, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedMaterial("");
    setSelectedGender("");
    setSelectedOccasion("");
    setPriceRange([0, 100000]);
    setSortBy("newest");
  };

  const activeFilters = [selectedMaterial, selectedGender, selectedOccasion].filter(Boolean).length + (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  const FilterSection = ({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="mb-6">
      <h4 className="font-body text-sm font-semibold text-foreground mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1.5 text-xs font-body rounded-sm border transition-colors ${
              value === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground/70 hover:border-primary/50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <SEOHead
        title={category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : search ? `Search: ${search}` : "All Jewellery"}
        description={`Browse our ${category || "complete"} jewellery collection. Gold, diamond, silver pieces at best prices.`}
      />

      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">{category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Jewellery"}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            {search ? `Results for "${search}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Jewellery"}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 text-sm font-body text-foreground border border-border rounded-sm px-3 py-2"
            >
              <SlidersHorizontal size={14} /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-body border border-border rounded-sm px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
                {activeFilters > 0 && (
                  <button onClick={clearFilters} className="text-xs font-body text-primary hover:underline">Clear All</button>
                )}
              </div>
              <FilterSection title="Material" options={MATERIALS} value={selectedMaterial} onChange={setSelectedMaterial} />
              <FilterSection title="Gender" options={GENDERS} value={selectedGender} onChange={setSelectedGender} />
              <FilterSection title="Occasion" options={OCCASIONS} value={selectedOccasion} onChange={setSelectedOccasion} />

              <div className="mb-6">
                <h4 className="font-body text-sm font-semibold text-foreground mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-full border border-border rounded-sm px-2 py-1.5 text-xs font-body bg-background text-foreground"
                    placeholder="Min" />
                  <span className="text-muted-foreground">-</span>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full border border-border rounded-sm px-2 py-1.5 text-xs font-body bg-background text-foreground"
                    placeholder="Max" />
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {filterOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setFilterOpen(false)} />
                <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 p-6 overflow-y-auto lg:hidden">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold">Filters</h3>
                    <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
                  </div>
                  <FilterSection title="Material" options={MATERIALS} value={selectedMaterial} onChange={setSelectedMaterial} />
                  <FilterSection title="Gender" options={GENDERS} value={selectedGender} onChange={setSelectedGender} />
                  <FilterSection title="Occasion" options={OCCASIONS} value={selectedOccasion} onChange={setSelectedOccasion} />
                  {activeFilters > 0 && (
                    <button onClick={clearFilters} className="w-full border border-primary text-primary py-2 rounded-sm text-sm font-body mt-4">
                      Clear All Filters
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-body mb-4">{filtered.length} products found</p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.images[0]}
                    rating={product.rating}
                    material={product.material}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-display text-xl text-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground font-body">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
