import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAVIGATION_CATEGORIES, NavCategory } from "./NavigationData";

export const DesktopNav: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);

  return (
    <nav
      className="hidden lg:block border-t border-border/60 bg-background/90 backdrop-blur"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-between py-0 relative">
          {NAVIGATION_CATEGORIES.map((cat) => {
            const isActive = activeCategory?.id === cat.id;
            const hasSub = Boolean(cat.subCategories?.length || cat.featured);

            return (
              <li
                key={cat.id}
                className="relative py-3.5"
                onMouseEnter={() => (hasSub ? setActiveCategory(cat) : setActiveCategory(null))}
              >
                <Link
                  to={cat.href}
                  className={`group relative text-xs font-semibold uppercase tracking-wider py-1 flex items-center gap-1 transition-colors ${
                    cat.isSpecial
                      ? "text-[#B8860B] hover:text-[#997D4D] font-bold"
                      : isActive
                      ? "text-[#997D4D]"
                      : "text-foreground/80 hover:text-[#997D4D]"
                  }`}
                >
                  <span>{cat.name}</span>

                  {cat.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                        cat.badge === "Sale"
                          ? "bg-destructive/15 text-destructive animate-pulse"
                          : "bg-[#C5A880]/20 text-[#997D4D]"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}

                  {/* Active Indicator Underline */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A880] transform origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeCategory && (activeCategory.subCategories || activeCategory.featured) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute left-0 right-0 w-full bg-background border-b border-border shadow-2xl z-40"
            onMouseEnter={() => setActiveCategory(activeCategory)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-12 gap-8 items-start">
                {/* Subcategory Columns */}
                <div
                  className={`grid gap-8 ${
                    activeCategory.featured ? "col-span-8 grid-cols-2" : "col-span-12 grid-cols-3"
                  }`}
                >
                  {activeCategory.subCategories?.map((group) => (
                    <div key={group.groupTitle} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#997D4D] flex items-center gap-1.5 pb-1 border-b border-border/60">
                        <Sparkles size={12} className="text-[#C5A880]" />
                        <span>{group.groupTitle}</span>
                      </h4>
                      <ul className="space-y-2">
                        {group.items.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              to={sub.href}
                              onClick={() => setActiveCategory(null)}
                              className="text-xs font-body text-foreground/75 hover:text-[#997D4D] hover:translate-x-1 transition-all inline-block"
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured Highlight Card */}
                {activeCategory.featured && (
                  <div className="col-span-4 bg-card border border-[#C5A880]/30 rounded-xl overflow-hidden shadow-lg p-4 group">
                    <div className="relative h-44 rounded-lg overflow-hidden mb-3">
                      <img
                        src={activeCategory.featured.image}
                        alt={activeCategory.featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-background/90 text-[#997D4D] rounded backdrop-blur-sm">
                        Curated Highlight
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-sm text-foreground mb-1 group-hover:text-[#997D4D] transition-colors">
                      {activeCategory.featured.title}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 font-body">
                      {activeCategory.featured.description}
                    </p>

                    <Link
                      to={activeCategory.featured.href}
                      onClick={() => setActiveCategory(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#997D4D] hover:text-[#C5A880] tracking-wide"
                    >
                      <span>{activeCategory.featured.ctaText}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Mega-menu footer strip */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  All jewellery certified 100% BIS Hallmarked & accompanied by IGI/GIA Diamond Certifications.
                </span>
                <Link
                  to={activeCategory.href}
                  onClick={() => setActiveCategory(null)}
                  className="font-semibold text-[#997D4D] hover:underline flex items-center gap-1"
                >
                  View entire {activeCategory.name} catalog
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DesktopNav;
