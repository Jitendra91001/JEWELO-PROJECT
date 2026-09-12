import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  RotateCcw,
  Package,
  Star,
  Quote,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_REVIEWS } from "@/services/mockData";

export const Home: React.FC = () => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");

  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival);
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.isBestSeller);
  const trendingPieces = MOCK_PRODUCTS.filter((p) => p.isTrending || p.rating >= 4.9);

  const filteredNewArrivals =
    activeCategoryTab === "all"
      ? newArrivals
      : newArrivals.filter((p) => p.category.toLowerCase() === activeCategoryTab.toLowerCase());

  return (
    <div className="w-full bg-background overflow-hidden font-body text-foreground">
      <SEOHead
        title="Haute Joaillerie & Certified Gold Jewellery"
        description="Discover master-crafted 22K hallmarked gold, certified solitaire diamond rings, imperial chokers, and heirlooms at JEWELO."
      />

      {/* 1. HERO BANNER */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#141210]">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90"
            alt="Jewelo Haute Joaillerie Hero"
            className="w-full h-full object-cover object-center brightness-[0.68] scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
          <div className="max-w-2xl text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#F5E6C8] text-xs font-semibold uppercase tracking-[0.25em]"
            >
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span>Spring Symphony 2026 Collection</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#FAF7F2] leading-[1.12]"
            >
              Where Eternal <span className="gold-text italic font-serif">Heritage</span> Meets Modern Brilliance.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-sm sm:text-base text-[#D4C8B5] font-light leading-relaxed max-w-lg"
            >
              Handcrafted in 22K hallmarked pure gold and conflict-free certified natural diamonds. Wear a legacy sculpted by master royal artisans.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="pt-2 flex flex-wrap gap-4"
            >
              <Link
                to="/products?tag=new-arrivals"
                className="px-8 py-4 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Shop New In</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/products?collection=bridal"
                className="px-8 py-4 border border-[#C5A880]/70 hover:border-white text-white hover:bg-white/10 text-xs font-bold uppercase tracking-[0.2em] rounded-md backdrop-blur-sm transition-all duration-300"
              >
                Explore Bridal Edit
              </Link>
            </motion.div>

            {/* Quick Hero Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-6 flex flex-wrap gap-6 text-[11px] font-medium text-[#B8AF9E] border-t border-white/15"
            >
              <span>✓ 100% BIS Hallmarked 916 Gold</span>
              <span>✓ IGI & GIA Certified Diamonds</span>
              <span>✓ Free Insured Pan-India Transit</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="py-16 lg:py-24 bg-card/40 border-b border-border/80">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
              Exquisite Curations
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every silhouette designed to elevate your everyday presence and celebratory grandeur.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {MOCK_CATEGORIES.map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
                Fresh Off The Vault
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                New Arrivals
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", val: "all" },
                { label: "Rings", val: "rings" },
                { label: "Necklaces", val: "necklaces" },
                { label: "Earrings", val: "earrings" },
                { label: "Bracelets", val: "bracelets" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setActiveCategoryTab(tab.val)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    activeCategoryTab === tab.val
                      ? "bg-[#C5A880] text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredNewArrivals.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products?tag=new-arrivals"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-[#C5A880] text-foreground hover:text-[#997D4D] text-xs font-bold uppercase tracking-widest rounded transition-colors"
            >
              <span>View All New Arrivals</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="py-16 lg:py-24 bg-secondary/30 border-y border-border/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
                Patron Favorites
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Time-honored designs treasured by over 50,000+ patrons worldwide.
              </p>
            </div>

            <Link
              to="/products?sort=popular"
              className="text-xs font-bold uppercase tracking-widest text-[#997D4D] hover:underline flex items-center gap-1.5"
            >
              <span>Explore Best Sellers</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestSellers.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED COLLECTION EDITORIAL */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#181614] text-[#EFEBE4] rounded-3xl overflow-hidden border border-[#2F2922] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Editorial Left Content */}
              <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={13} />
                  <span>Featured Collection Spotlight</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  The Royal Nizam Bridal Heritage
                </h2>

                <p className="text-xs sm:text-sm text-[#B8AF9E] font-body leading-relaxed">
                  Sculpted in pure 22K gold with uncut polki diamonds and Colombian emerald drops. Each piece mirrors the grandeur of royal Indian dynasties, designed to be handed down across generations.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2 border-y border-white/10 py-4 text-center">
                  <div>
                    <span className="font-display text-xl font-bold text-[#D4AF37] block">22K</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8F8575]">Hallmarked Gold</span>
                  </div>
                  <div>
                    <span className="font-display text-xl font-bold text-[#D4AF37] block">100%</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8F8575]">Natural Polki</span>
                  </div>
                  <div>
                    <span className="font-display text-xl font-bold text-[#D4AF37] block">Heirloom</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8F8575]">Buyback Guarantee</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/products?collection=nizam"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-lg transition-all"
                  >
                    <span>Explore Nizam Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Editorial Right Image Area */}
              <div className="lg:col-span-6 relative aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85"
                  alt="The Royal Nizam Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMOTIONAL BANNER */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#201D19] via-[#332C23] to-[#201D19] p-8 sm:p-12 border border-[#C5A880]/40 text-center space-y-4 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] block">
              Limited Festive Privé Privilege
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#F8F4EC] tracking-tight">
              Enjoy 0% Making Charges on Select Solitaire Creations
            </h3>
            <p className="text-xs sm:text-sm text-[#C4B9A7] max-w-xl mx-auto font-body">
              Complimentary certified solitaire pendant included on orders above ₹1,00,000. Use promotion code{" "}
              <strong className="text-[#D4AF37] font-mono bg-black/40 px-2 py-0.5 rounded border border-[#C5A880]/30">
                JEWELO25
              </strong>
            </p>
            <div className="pt-2">
              <Link
                to="/products?offer=special-offers"
                className="inline-block px-7 py-3 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded shadow transition-all"
              >
                Claim Privé Offer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRENDING JEWELLERY */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
                Runway & Red Carpet
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Trending Jewellery
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Modern statement pieces commanding the spotlight this season.
              </p>
            </div>

            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-widest text-[#997D4D] hover:underline flex items-center gap-1.5"
            >
              <span>View All Trending</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trendingPieces.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. JEWELLERY STORYTELLING SECTION */}
      <section className="py-16 lg:py-24 bg-card/60 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
                  alt="Jewelo Goldsmithing Craftsmanship"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border border-[#C5A880]/50 p-5 rounded-xl shadow-2xl hidden sm:block max-w-xs">
                <span className="font-display text-3xl font-bold gold-text block">35+ Years</span>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  Of royal Indian goldsmithing heritage and precision diamond setting.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 lg:pl-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
                Our Legacy & Artistry
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Sculpting Stories into Timeless Gold
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                Founded in 1990 in Mumbai, JEWELO began with a singular devotion: to preserve the sublime artistry of royal Indian karigars while delivering the precision of modern diamond engineering.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#C5A880] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Master Karigar Guild
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Each piece spends up to 120 man-hours in meticulous stone selection, setting, and hand-polishing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#C5A880] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Ethical Kimberly Process Diamonds
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      100% natural, conflict-free stones individually graded by international gemologists.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#997D4D] hover:underline"
                >
                  <span>Read The Full Heritage Chronicle</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY CHOOSE US */}
      <section className="py-16 lg:py-20 border-t border-border bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
              Uncompromising Standards
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              The Jewelo Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A880]/15 text-[#D4AF37] flex items-center justify-center">
                <Award size={26} />
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                100% Certified Purity
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                BIS 916 Government hallmarked gold and certified natural diamonds by IGI & GIA laboratories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A880]/15 text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck size={26} />
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                256-Bit Secure Checkout
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bank-grade encrypted payments via UPI, Cards, NetBanking, and convenient No-Cost EMI options.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A880]/15 text-[#D4AF37] flex items-center justify-center">
                <RotateCcw size={26} />
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                30-Day Easy Returns
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enjoy 30 days hassle-free doorstep return, plus a lifetime buyback and exchange guarantee.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A880]/15 text-[#D4AF37] flex items-center justify-center">
                <Package size={26} />
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                Tamper-Proof Packaging
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Velvet-lined luxury wooden presentation boxes with armored transit insurance to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CUSTOMER TESTIMONIALS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#997D4D]">
              Patron Chronicles
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Loved by Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <Quote size={24} className="text-[#C5A880]/50" />
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rev.rating ? "fill-current" : "text-muted-foreground/30"}
                      />
                    ))}
                  </div>
                  <h4 className="font-display font-semibold text-sm text-foreground">
                    &quot;{rev.title}&quot;
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-body">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground block">{rev.customerName}</span>
                    <span className="text-[10px] text-muted-foreground">{rev.productName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] uppercase">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. INSTAGRAM / SOCIAL GALLERY */}
      <section className="py-12 border-t border-border bg-[#141210] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 space-y-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:underline"
            >
              <Instagram size={15} />
              <span>@Jewelo_Official on Instagram</span>
            </a>
            <h3 className="font-display text-2xl font-bold tracking-tight text-[#FAF7F2]">
              The Haute Joaillerie Gallery
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1611591475829-063991207604?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1622398925373-3f9171e275f5?auto=format&fit=crop&w=400&q=80",
            ].map((img, idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 block"
              >
                <img
                  src={img}
                  alt={`Jewelo Instagram moment ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={24} className="text-[#D4AF37]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
