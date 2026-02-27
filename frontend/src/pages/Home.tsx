import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RotateCcw, Award } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import ProductCard from "@/components/product/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklaces from "@/assets/category-necklaces.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryBangles from "@/assets/category-bangles.jpg";
import offerBanner from "@/assets/offer-banner.jpg";

const categories = [
  { name: "Rings", image: categoryRings, path: "/products?category=rings" },
  { name: "Necklaces", image: categoryNecklaces, path: "/products?category=necklaces" },
  { name: "Earrings", image: categoryEarrings, path: "/products?category=earrings" },
  { name: "Bangles", image: categoryBangles, path: "/products?category=bangles" },
];

const mockFeatured = [
  { id: "1", name: "Royal Diamond Solitaire Ring", price: 45999, originalPrice: 52999, images: [categoryRings], rating: 4.8, material: "18K Gold" },
  { id: "2", name: "Celestial Pearl Necklace", price: 32500, images: [categoryNecklaces], rating: 4.9, material: "22K Gold" },
  { id: "3", name: "Teardrop Crystal Earrings", price: 18999, originalPrice: 22999, images: [categoryEarrings], rating: 4.7, material: "Rose Gold" },
  { id: "4", name: "Heritage Gold Bangle Set", price: 65000, images: [categoryBangles], rating: 4.6, material: "22K Gold" },
  { id: "5", name: "Infinity Diamond Band", price: 28999, originalPrice: 34999, images: [categoryRings], rating: 4.9, material: "Platinum" },
  { id: "6", name: "Lotus Pendant Necklace", price: 15999, images: [categoryNecklaces], rating: 4.5, material: "18K Gold" },
  { id: "7", name: "Classic Hoop Earrings", price: 12500, originalPrice: 14999, images: [categoryEarrings], rating: 4.8, material: "14K Gold" },
  { id: "8", name: "Twisted Rope Bangle", price: 38000, images: [categoryBangles], rating: 4.7, material: "22K Gold" },
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹5,000" },
  { icon: Shield, title: "Certified Jewellery", desc: "BIS Hallmarked" },
  { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
  { icon: Award, title: "Lifetime Exchange", desc: "Guaranteed value" },
];

const Home = () => {
  return (
    <>
      <SEOHead
        title="Home"
        description="Shop exquisite gold, diamond & silver jewellery. Rings, necklaces, earrings & bangles. Free shipping on orders above ₹5,000."
        keywords="jewellery, gold, diamond, rings, necklaces, earrings, bangles, online jewellery shopping India"
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Luxury jewellery collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <p className="text-primary-foreground/80 text-sm font-body tracking-[0.3em] uppercase mb-4">New Collection 2026</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Timeless Elegance, <br />
              <span className="gold-text">Crafted for You</span>
            </h1>
            <p className="text-primary-foreground/70 font-body text-base lg:text-lg mb-8 leading-relaxed">
              Discover our handcrafted collection of fine jewellery. Each piece is a masterwork of tradition and contemporary design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="gold-gradient text-primary-foreground px-8 py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase inline-flex items-center gap-2 hover:opacity-90 transition-opacity shimmer"
              >
                Shop Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?category=new-arrivals"
                className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase hover:bg-primary-foreground/10 transition-colors"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <f.icon size={24} className="text-primary flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-4 py-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">Shop by Category</h2>
          <p className="text-muted-foreground font-body">Find the perfect piece for every occasion</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={cat.path} className="group block relative aspect-[3/4] overflow-hidden rounded-sm">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-1">{cat.name}</h3>
                  <span className="font-body text-xs text-primary-foreground/70 uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 py-14 lg:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">Featured Collection</h2>
              <p className="text-muted-foreground font-body">Handpicked pieces our customers love</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-sm font-body font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {mockFeatured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images[0]}
                rating={product.rating}
                material={product.material}
                isNew={Number(product.id) <= 2}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body font-semibold text-primary uppercase tracking-wide">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img src={offerBanner} alt="Special offers on jewellery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center px-4"
          >
            <p className="text-primary-foreground/80 text-sm font-body tracking-[0.3em] uppercase mb-3">Limited Time Offer</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Up to <span className="gold-text">40% Off</span>
            </h2>
            <p className="text-primary-foreground/70 font-body mb-6">On select diamond & gold collections</p>
            <Link
              to="/products?offer=true"
              className="gold-gradient text-primary-foreground px-8 py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase inline-flex items-center gap-2 hover:opacity-90 transition-opacity shimmer"
            >
              Shop Offers <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-14 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Priya Sharma", text: "Absolutely stunning ring! The craftsmanship is impeccable. JEWELO never disappoints.", rating: 5 },
            { name: "Ananya Patel", text: "Ordered a necklace for my wedding and it was even more beautiful in person. Fast delivery too!", rating: 5 },
            { name: "Meera Gupta", text: "Best jewellery shopping experience online. The gold quality is genuine and prices are fair.", rating: 4 },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-sm p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={`text-sm ${j < t.rating ? "text-primary" : "text-muted"}`}>★</span>
                ))}
              </div>
              <p className="font-body text-sm text-foreground/80 mb-4 leading-relaxed italic">"{t.text}"</p>
              <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
