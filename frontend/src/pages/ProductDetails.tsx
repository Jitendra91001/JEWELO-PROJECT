import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartThunk";
import { addToWishlist } from "@/store/wishlistThunk";
import { CURRENCY } from "@/utils/constants";
import { toast } from "sonner";

import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklaces from "@/assets/category-necklaces.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryBangles from "@/assets/category-bangles.jpg";
import { fetchProductById, fetchProducts } from "@/store/productSlice";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading: cartLoading } = useAppSelector((s) => s.cart);
  const { loading: wishlistLoading } = useAppSelector((s) => s.wishlist);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProductDetails] = useState<any>({});
  const [allProducts, setAllProduct] = useState<any>([]);

  const fetchproductDetails = async () => {
    const response = await dispatch(fetchProductById(id)).unwrap();
    if (response?.success === true) {
      setProductDetails(response?.data);
    }
  };

  const fetchproduct = async () => {
    const response = await dispatch(fetchProducts()).unwrap();
    if (response?.success === true) {
      setAllProduct(response?.data);
    }
  };

  useEffect(() => {
    fetchproductDetails();
    fetchproduct();
  }, [id]);

  // const product = mockProducts[id || "1"] || mockProducts["1"];
  const discount = product.cost
    ? Math.round(((product.cost - product.price) / product.cost) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      quantity,
    }));
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist({
      productId: product.id,
    }));
    toast.success("Added to wishlist!");
  };


  return (
    <>
      <SEOHead
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.material}, ${product.category}, jewellery, buy online`}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square overflow-hidden rounded-sm bg-secondary mb-4"
            >
              <img
                src={baseUrl + product?.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-3">
              {product?.images?.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden rounded-sm border-2 transition-colors ${
                    i === selectedImage
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={baseUrl+img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-2">
              {product.material}
            </p>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-body text-muted-foreground">
                {product?.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-foreground">
                {CURRENCY}
                {product?.price?.toLocaleString()}
              </span>
              {product.cost && (
                <>
                  <span className="text-lg text-muted-foreground line-through font-body">
                    {CURRENCY}
                    {product?.cost?.toLocaleString()}
                  </span>
                  <span className="text-sm font-body font-semibold text-green-600">
                    ({discount}% off)
                  </span>
                </>
              )}
            </div>

            <p className="text-sm font-body text-foreground/80 leading-relaxed mb-6">
              {product.description}
            </p>
            {/* Details */}
            {/* <div className="grid grid-cols-1 gap-4 mb-6 p-4 bg-secondary/50 rounded-sm">
              <div className="text-center">
                <p className="text-xs font-body text-muted-foreground mb-1">
                  Material
                </p>
                <p className="text-sm font-body font-semibold text-foreground">
                  {product.material}
                </p>
              </div>
            </div> */}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-body font-medium text-foreground">
                Quantity:
              </span>
              <div className="flex items-center border border-border rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-foreground hover:text-primary"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-body font-semibold text-foreground min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-foreground hover:text-primary"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 gold-gradient text-primary-foreground py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shimmer disabled:opacity-50"
              >
                {cartLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />} Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
                className="p-3.5 border border-border rounded-sm text-foreground hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
                aria-label="Add to wishlist"
              >
                {wishlistLoading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
              </button>
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹5,000" },
                { icon: Shield, text: "BIS Hallmarked & Certified" },
                { icon: RotateCcw, text: "15-day easy returns" },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm font-body text-muted-foreground"
                >
                  <Icon size={16} className="text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {allProducts?.map((p) => (
              <ProductCard
                key={p.id}
                id={p.slug}
                name={p.name}
                price={p.price}
                originalPrice={p.cost}
                image={p.thumbnail}
                rating={p.rating}
                material={p.material}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductDetails;
