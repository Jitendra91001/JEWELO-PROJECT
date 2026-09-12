import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { productService } from "@/services/product.service";
import { Product, ProductReview } from "@/types/product.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartThunk";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistThunk";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<"image" | "video" | "360">("image");
  const [rotationAngle, setRotationAngle] = useState(0);

  // Selection state
  const [selectedMetal, setSelectedMetal] = useState<string>("");
  const [selectedPurity, setSelectedPurity] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("14");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"specs" | "shipping" | "reviews" | "faq" | "care">("specs");

  // Size Guide Modal
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const found = await productService.getProductById(id || "");
      if (found) {
        setProduct(found);
        setSelectedMetal(found.metal);
        setSelectedPurity(found.purity);
        if (found.sizes?.length) setSelectedSize(found.sizes[0]);

        const revs = await productService.getProductReviews(found.id);
        setReviews(revs);

        const allProds = await productService.getProducts({ category: found.category });
        setRelatedProducts(allProds.products.filter((p) => p.id !== found.id).slice(0, 4));
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-body text-muted-foreground">Loading masterpiece specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested fine jewellery piece could not be located.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest rounded shadow"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
  const emiMonthly = Math.round(product.price / 24);

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
        })
      ).unwrap();
      toast.success(`${product.name} added to your shopping bag!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success("Saved to your wishlist");
      }
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-6 lg:py-12 font-body text-foreground">
      <SEOHead title={`${product.name} | Certified Jewellery`} description={product.description} />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-body">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Catalogue</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Section: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          {/* LEFT: GALLERY & 360 / VIDEO VIEWER */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-secondary/30 border border-border/80 shadow-md">
              {mediaMode === "image" ? (
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : mediaMode === "video" ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#181614] text-white p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#D4AF37] ring-8 ring-[#C5A880]/10">
                    <Play size={28} className="ml-1" />
                  </div>
                  <h4 className="font-display text-lg font-bold">4K Master Karigar Video</h4>
                  <p className="text-xs text-white/70 max-w-sm">
                    Watch our master artisans hand-set this 1.50 ct diamond in our Mumbai haute joaillerie atelier.
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#181614] text-white p-6 select-none cursor-ew-resize">
                  <div
                    className="relative w-72 h-72 rounded-full overflow-hidden transition-transform duration-100"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  >
                    <img
                      src={product.images[0]}
                      alt="360 rotation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-[#D4AF37]">
                    <RotateCw size={15} />
                    <span>Drag or click buttons below to rotate 360°</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setRotationAngle((a) => a - 45)}
                      className="px-3 py-1 rounded bg-[#2A251F] text-xs font-mono hover:bg-[#3D352B]"
                    >
                      ↺ Rotate Left
                    </button>
                    <button
                      onClick={() => setRotationAngle((a) => a + 45)}
                      className="px-3 py-1 rounded bg-[#2A251F] text-xs font-mono hover:bg-[#3D352B]"
                    >
                      ↻ Rotate Right
                    </button>
                  </div>
                </div>
              )}

              {/* Prev / Next Image Navigation on Image */}
              {mediaMode === "image" && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow text-foreground transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow text-foreground transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.discountPercentage && (
                  <span className="px-3 py-1 rounded bg-destructive text-white text-xs font-bold uppercase tracking-wider shadow">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
                <span className="px-3 py-1 rounded bg-background/90 text-foreground text-xs font-semibold backdrop-blur-sm border border-border">
                  {product.purity} Gold
                </span>
              </div>
            </div>

            {/* Media Selector Strip (Images, Video, 360) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setMediaMode("image");
                  }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    mediaMode === "image" && activeImageIndex === idx
                      ? "border-[#C5A880] shadow-md scale-105"
                      : "border-border/70 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Video Button Placeholder */}
              <button
                onClick={() => setMediaMode("video")}
                className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all flex-shrink-0 ${
                  mediaMode === "video"
                    ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D]"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Play size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Video</span>
              </button>

              {/* 360 View Button Placeholder */}
              <button
                onClick={() => setMediaMode("360")}
                className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all flex-shrink-0 ${
                  mediaMode === "360"
                    ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D]"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <RotateCw size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">360° View</span>
              </button>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header / SKU / Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono font-semibold tracking-wider">{product.sku}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                  {product.stock > 0 ? "100% Certified & In Stock" : "Made to Order"}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews summary */}
              <div className="flex items-center gap-3 text-xs pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-[#997D4D] hover:underline font-semibold"
                >
                  {product.reviewsCount} Patron Reviews
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-[#997D4D]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.comparePrice && (
                  <span className="text-base text-muted-foreground line-through">
                    ₹{product.comparePrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-bold">
                  (Inclusive of all luxury taxes & GST)
                </span>
              </div>

              {/* EMI Callout */}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 border-t border-border/60">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-[#B8860B] font-bold text-[10px]">
                  No-Cost EMI
                </span>
                <span>
                  Or pay <strong>₹{emiMonthly.toLocaleString("en-IN")}/mo</strong> for 24 months with credit cards.
                </span>
              </div>
            </div>

            {/* Metal & Purity Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">
                  Metal & Purity Selection:
                </span>
                <span className="font-semibold text-foreground">{selectedMetal} ({selectedPurity})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { metal: "Yellow Gold", purity: "22K", label: "22K Yellow Gold" },
                  { metal: "Rose Gold", purity: "18K", label: "18K Rose Gold" },
                  { metal: "Platinum", purity: "950 Platinum", label: "950 Platinum" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedMetal(item.metal);
                      setSelectedPurity(item.purity);
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      selectedMetal === item.metal
                        ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D] shadow-sm font-bold"
                        : "border-border text-foreground hover:border-[#C5A880]/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Modal Guide */}
            {product.sizes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">
                    Select Size:
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[#997D4D] hover:underline font-semibold flex items-center gap-1"
                  >
                    <HelpCircle size={13} />
                    <span>Ring Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-11 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === sz
                          ? "border-[#C5A880] bg-[#C5A880] text-white shadow"
                          : "border-border text-foreground hover:border-[#C5A880]/50"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 text-xs">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-secondary font-bold text-muted-foreground"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-foreground text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 hover:bg-secondary font-bold text-muted-foreground"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons (Add to Bag, Buy Now, Wishlist, Share) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="py-3.5 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="py-3.5 bg-[#1F1B16] hover:bg-[#2D2821] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all border border-[#C5A880]/40"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isWishlisted
                      ? "border-destructive text-destructive bg-destructive/5"
                      : "border-border hover:border-[#C5A880] text-foreground"
                  }`}
                >
                  <Heart size={15} className={isWishlisted ? "fill-current" : ""} />
                  <span>{isWishlisted ? "In Your Wishlist" : "Add to Wishlist"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-lg border border-border hover:border-[#C5A880] text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck size={16} className="text-[#C5A880] flex-shrink-0" />
                <span>100% Certified Hallmarked Gold & Natural Diamonds</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Truck size={16} className="text-[#C5A880] flex-shrink-0" />
                <span>Complimentary Armored & Insured Transit to your doorstep</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <RotateCcw size={16} className="text-[#C5A880] flex-shrink-0" />
                <span>30-Day Money Back & Lifetime Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TABS: SPECIFICATIONS, CERTIFICATION, REVIEWS, CARE */}
        <div className="mb-16">
          <div className="border-b border-border flex gap-4 sm:gap-8 overflow-x-auto text-sm font-display font-semibold">
            {[
              { key: "specs", label: "Specifications & Details" },
              { key: "shipping", label: "Shipping & Return Policy" },
              { key: "reviews", label: `Patron Reviews (${reviews.length})` },
              { key: "care", label: "Jewellery Care Guide" },
              { key: "faq", label: "Questions & Answers" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`py-3.5 whitespace-nowrap border-b-2 transition-all ${
                  activeTab === t.key
                    ? "border-[#C5A880] text-[#997D4D]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-body">
                <div className="space-y-4">
                  <h4 className="font-display text-base font-bold text-foreground">Product Heritage & Design</h4>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Sculpted by master goldsmiths in our Mumbai atelier. Individually hallmarked under the Bureau of Indian Standards (BIS) Act.
                  </p>
                </div>

                <div className="space-y-3 p-5 rounded-xl bg-card border border-border">
                  <h4 className="font-display text-sm font-bold text-foreground pb-2 border-b border-border">
                    Gemological Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2.5">
                    <span className="text-muted-foreground">Product SKU:</span>
                    <span className="font-semibold text-foreground font-mono">{product.sku}</span>

                    <span className="text-muted-foreground">Precious Metal:</span>
                    <span className="font-semibold text-foreground">{product.metal} ({product.purity})</span>

                    <span className="text-muted-foreground">Approx Gross Weight:</span>
                    <span className="font-semibold text-foreground">{product.weight} grams</span>

                    <span className="text-muted-foreground">Primary Gemstone:</span>
                    <span className="font-semibold text-foreground">{product.gemstone}</span>

                    {product.stoneWeight && (
                      <>
                        <span className="text-muted-foreground">Diamond Total Weight:</span>
                        <span className="font-semibold text-foreground">{product.stoneWeight} Carats</span>
                      </>
                    )}

                    {product.diamondClarity && (
                      <>
                        <span className="text-muted-foreground">Clarity & Color:</span>
                        <span className="font-semibold text-foreground">{product.diamondClarity} / {product.diamondColor}</span>
                      </>
                    )}

                    <span className="text-muted-foreground">Hallmarking Authority:</span>
                    <span className="font-semibold text-[#997D4D]">{product.certification}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-3xl text-xs font-body text-muted-foreground leading-relaxed">
                <h4 className="font-display text-base font-bold text-foreground">Delivery & Armored Transit</h4>
                <p>
                  Every Jewelo masterpiece is securely packaged in an armored velvet presentation box and transported through dedicated insured couriers (BlueDart Apex & Sequel Logistics). The delivery agent requires OTP confirmation and government identity verification upon handover.
                </p>
                <h4 className="font-display text-base font-bold text-foreground pt-2">30-Day Doorstep Returns</h4>
                <p>
                  If your purchase does not fulfill your vision of perfection, you may initiate a 100% money-back return within 30 days of delivery with complimentary door pickup.
                </p>
                <h4 className="font-display text-base font-bold text-foreground pt-2">Lifetime Buyback & Exchange</h4>
                <p>
                  We guarantee 100% prevailing gold value and 90% prevailing diamond value on lifetime trade-in against any new Jewelo creation.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-foreground">Verified Connoisseur Reviews</h4>
                    <p className="text-xs text-muted-foreground">Rating score {product.rating} out of 5 based on verified buyers.</p>
                  </div>
                  <button
                    onClick={() => toast.info("Review submission modal opened")}
                    className="px-4 py-2 rounded-lg bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider shadow"
                  >
                    Write a Review
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-foreground">{rev.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{rev.createdAt}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < rev.rating ? "fill-current" : "text-muted-foreground/30"} />
                        ))}
                      </div>
                      <h5 className="font-semibold text-xs text-foreground">&quot;{rev.title}&quot;</h5>
                      <p className="text-xs text-muted-foreground">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <h5 className="font-bold text-foreground text-sm">Storage</h5>
                  <p className="text-muted-foreground">Store your jewellery in the provided individual fabric-lined boxes to prevent surface scratches.</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <h5 className="font-bold text-foreground text-sm">Chemical Avoidance</h5>
                  <p className="text-muted-foreground">Apply perfumes, lotions, and cosmetics before wearing your pieces. Avoid contact with chlorine.</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <h5 className="font-bold text-foreground text-sm">Complimentary Spa</h5>
                  <p className="text-muted-foreground">Bring your Jewelo pieces to any flagship boutique for complimentary ultrasonic cleaning and claw inspection.</p>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-3 max-w-2xl text-xs">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h5 className="font-semibold text-foreground">How do I verify the BIS Hallmark on my jewellery?</h5>
                  <p className="text-muted-foreground mt-1">Every creation features a laser-inscribed BIS logo, karat purity symbol (e.g. 22K916), and a 6-digit HUID code verifiable via the BIS Care mobile app.</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h5 className="font-semibold text-foreground">Can I request a customized size or metal color?</h5>
                  <p className="text-muted-foreground mt-1">Yes, our bespoke concierge can alter the ring size or cast in white/yellow/rose gold upon request. Connect with concierge via WhatsApp or phone.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-foreground">
                You May Also Admire
              </h3>
              <Link to="/products" className="text-xs font-semibold text-[#997D4D] hover:underline">
                Explore Full Range →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE PERSISTENT STICKY PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Price</span>
          <span className="font-display font-bold text-lg text-[#997D4D]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="px-4 py-2.5 bg-[#1F1B16] text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-[#C5A880]/50"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* RING SIZE GUIDE MODAL */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSizeGuideOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-2xl p-6 max-w-lg w-full z-50 shadow-2xl space-y-4"
            >
              <h3 className="font-display font-bold text-xl text-foreground">
                Indian Standard Ring Size Guide
              </h3>
              <p className="text-xs text-muted-foreground">
                Measure the inner diameter of an existing ring or wrap a string snugly around your knuckle.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-border">
                  <thead className="bg-secondary/60">
                    <tr>
                      <th className="p-2 border">Indian Size</th>
                      <th className="p-2 border">Inner Diameter (mm)</th>
                      <th className="p-2 border">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border font-bold">10</td><td className="p-2 border">15.9 mm</td><td className="p-2 border">50.0 mm</td></tr>
                    <tr><td className="p-2 border font-bold">12</td><td className="p-2 border">16.5 mm</td><td className="p-2 border">51.9 mm</td></tr>
                    <tr><td className="p-2 border font-bold">14</td><td className="p-2 border">17.2 mm</td><td className="p-2 border">54.0 mm</td></tr>
                    <tr><td className="p-2 border font-bold">16</td><td className="p-2 border">17.8 mm</td><td className="p-2 border">56.0 mm</td></tr>
                    <tr><td className="p-2 border font-bold">18</td><td className="p-2 border">18.5 mm</td><td className="p-2 border">58.1 mm</td></tr>
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="w-full py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase rounded-lg"
              >
                Close Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
