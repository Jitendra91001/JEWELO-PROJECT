import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Category } from "@/types/product.types";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-secondary/30 border border-border"
    >
      <Link to={`/products?category=${category.slug}`} className="block aspect-[4/5] relative overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/90 transition-colors duration-300" />

        {/* Card Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white flex flex-col justify-end">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-1">
            {category.productCount || 40}+ Designs
          </span>

          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-[#F3E5AB] transition-colors">
            {category.name}
          </h3>

          <p className="text-xs text-white/70 line-clamp-2 mt-1 font-body text-balance hidden sm:block">
            {category.description}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors">
            <span>Explore Range</span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
