"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { MATERIALS, GENDERS, OCCASIONS } from "@/utils/constants";
import { fetchProducts } from "@/store/productSlice";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  // 🔥 FETCH PRODUCTS
  const fetchproduct = async () => {
    try {
      setLoading(true);

      let sortField = "createdAt";
      let sortOrder: "asc" | "desc" = "desc";
      if (sortBy === "price-asc") {
        sortField = "price";
        sortOrder = "asc";
      } else if (sortBy === "price-desc") {
        sortField = "price";
        sortOrder = "desc";
      } else if (sortBy === "rating") {
        sortField = "rating";
        sortOrder = "desc";
      }


      const filter = {
          search,
          material: selectedMaterial,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          categoryId: category || undefined,
          sortBy: sortField,
          sortOrder,
          page: 1,
          limit: 20,
        }
      const response: any = await dispatch(fetchProducts(filter)).unwrap();
      if (response?.success === true) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchproduct();
  }, [search, selectedMaterial, selectedGender, selectedOccasion, priceRange, sortBy, category]);

  // 🧹 CLEAR FILTER
  const clearFilters = () => {
    setSelectedMaterial("");
    setSelectedGender("");
    setSelectedOccasion("");
    setPriceRange([0, 100000]);
    setSortBy("newest");
  };

  const activeFilters =
    [selectedMaterial, selectedGender, selectedOccasion].filter(Boolean).length +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  const FilterSection = ({ title, options, value, onChange }: any) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1 text-xs border rounded ${
              value === opt ? "bg-black text-white" : ""
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
      <SEOHead title="Products" description="Jewellery collection" />

      <div className="container mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {search ? `Search: ${search}` : "All Products"}
          </h1>

          <div className="flex gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-60">
            <FilterSection title="Material" options={MATERIALS} value={selectedMaterial} onChange={setSelectedMaterial} />
            <FilterSection title="Gender" options={GENDERS} value={selectedGender} onChange={setSelectedGender} />
            <FilterSection title="Occasion" options={OCCASIONS} value={selectedOccasion} onChange={setSelectedOccasion} />

            <div>
              {/* <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              /> */}
            </div>

            {activeFilters > 0 && (
              <button onClick={clearFilters}>Clear Filters</button>
            )}
          </aside>

          {/* PRODUCTS */}
          <div className="flex-1">
            {/* <p>{products?.length} products found</p> */}

            {loading ? (
              <p>Loading...</p>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products?.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.cost}
                    image={product.thumbnail}
                    rating={product.rating}
                    material={product.material}
                  />
                ))}
              </div>
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>

        {/* MOBILE FILTER */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50"
                onClick={() => setFilterOpen(false)}
              />
              <motion.div className="fixed left-0 top-0 w-80 bg-white p-4">
                <button onClick={() => setFilterOpen(false)}>
                  <X />
                </button>

                <FilterSection title="Material" options={MATERIALS} value={selectedMaterial} onChange={setSelectedMaterial} />
                <FilterSection title="Gender" options={GENDERS} value={selectedGender} onChange={setSelectedGender} />
                <FilterSection title="Occasion" options={OCCASIONS} value={selectedOccasion} onChange={setSelectedOccasion} />

                <button onClick={clearFilters}>Clear</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default ProductList;