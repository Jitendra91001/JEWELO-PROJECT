import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X, Sparkles, SlidersHorizontal } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product.types";

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("search") || "";
  const [inputQuery, setInputQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setInputQuery(query);
    const doSearch = async () => {
      setLoading(true);
      const res = await productService.getProducts({
        search: query,
        sort: sortBy as any,
      });
      setProducts(res.products);
      setLoading(false);
    };
    doSearch();
  }, [query, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title={`Search Results for "${query}"`} description={`Search results for ${query} at Jewelo.`} />

      <div className="container mx-auto px-4">
        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search necklaces, solitaire rings, bangles, 22K gold..."
              className="w-full py-3.5 pl-12 pr-10 rounded-full border border-border bg-card shadow-sm text-sm outline-none focus:border-[#C5A880] transition-colors"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A880]" />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {query ? `Search Results for "${query}"` : "All Jewellery Creations"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Found <strong className="text-foreground">{products.length}</strong> matching certified pieces
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary/70 text-foreground text-xs rounded-lg px-3 py-1.5 border border-border outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Launches</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-[#C5A880]">
              <Search size={28} />
            </div>
            <h3 className="font-display text-xl font-bold">No results found for &quot;{query}&quot;</h3>
            <p className="text-xs text-muted-foreground">
              Check your spelling or try searching for broader terms like &quot;rings&quot;, &quot;solitaire&quot;, &quot;emerald&quot;, or &quot;gold&quot;.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="px-6 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase rounded-lg shadow"
              >
                Browse All Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
