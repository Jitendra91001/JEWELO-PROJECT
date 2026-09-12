import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/cartThunk';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistThunk';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const [selectedSize, setSelectedSize] = useState<string>('14');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
        })
      ).unwrap();
      toast.success(`${product.name} added to bag!`);
      onClose();
    } catch {
      toast.error('Failed to add to bag');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Wishlist action failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-3xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 my-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Gallery Left */}
              <div className="p-6 bg-secondary/30 flex flex-col items-center justify-center border-r border-border/70">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 border border-border bg-white shadow-sm">
                  <img
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discountPercentage && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-destructive text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx ? 'border-[#C5A880] shadow' : 'border-border/80 opacity-70'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Right */}
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{product.sku}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                      {product.stock > 0 ? 'In Stock • Ready to Ship' : 'Out of Stock'}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < Math.floor(product.rating) ? 'fill-current' : 'text-muted-foreground/40'}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-[#997D4D]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Metal specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-secondary/50 border border-border/60">
                    <div>
                      <span className="text-muted-foreground">Metal & Purity:</span>
                      <p className="font-semibold text-foreground">{product.metal} ({product.purity})</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hallmark:</span>
                      <p className="font-semibold text-foreground truncate">{product.certification}</p>
                    </div>
                  </div>

                  {/* Size Selector */}
                  {product.sizes && (
                    <div className="pt-1">
                      <span className="text-xs font-semibold text-foreground block mb-1.5">
                        Select Ring Size:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
                              selectedSize === s
                                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D]'
                                : 'border-border text-foreground hover:border-[#C5A880]/50'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="py-3 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <ShoppingBag size={15} />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      onClick={handleToggleWishlist}
                      className={`py-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isWishlisted
                          ? 'border-destructive text-destructive bg-destructive/5'
                          : 'border-border hover:border-[#C5A880] text-foreground'
                      }`}
                    >
                      <Heart size={15} className={isWishlisted ? 'fill-current' : ''} />
                      <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                    </button>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="w-full py-2.5 text-center text-xs font-semibold text-[#997D4D] hover:underline flex items-center justify-center gap-1"
                  >
                    <span>View Complete Details & Certificate</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
