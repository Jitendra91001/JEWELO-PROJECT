export interface SubCategory {
  title: string;
  href: string;
}

export interface NavCategory {
  id: string;
  name: string;
  href: string;
  badge?: string;
  isSpecial?: boolean;
  subCategories?: {
    groupTitle: string;
    items: SubCategory[];
  }[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
    ctaText: string;
  };
}

export const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    id: "new-arrivals",
    name: "New Arrivals",
    href: "/products?tag=new-arrivals",
    badge: "New",
    subCategories: [
      {
        groupTitle: "Trending Launches",
        items: [
          { title: "The Royal Nizam Collection", href: "/products?collection=nizam" },
          { title: "Modern Minimalist Gold", href: "/products?collection=minimalist" },
          { title: "Solitaire Dreams 2026", href: "/products?collection=solitaires" },
          { title: "Festive Polki Edit", href: "/products?collection=polki" },
        ],
      },
      {
        groupTitle: "Latest Highlights",
        items: [
          { title: "18K Diamond Tennis Bracelets", href: "/products?category=bracelets&metal=18k" },
          { title: "22K Temple Gold Necklaces", href: "/products?category=necklaces&metal=22k" },
          { title: "Floral Solitaire Studs", href: "/products?category=earrings&style=studs" },
          { title: "Rose Gold Cocktail Rings", href: "/products?category=rings&metal=rose-gold" },
        ],
      },
    ],
    featured: {
      title: "Spring Symphony 2026",
      description: "Discover our newest handcrafted masterpieces in 18K and 22K certified hallmarked gold.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      href: "/products?tag=new-arrivals",
      ctaText: "Explore New In",
    },
  },
  {
    id: "rings",
    name: "Rings",
    href: "/products?category=rings",
    subCategories: [
      {
        groupTitle: "By Style",
        items: [
          { title: "Solitaire Rings", href: "/products?category=rings&style=solitaire" },
          { title: "Engagement Rings", href: "/products?category=rings&style=engagement" },
          { title: "Eternity & Wedding Bands", href: "/products?category=rings&style=bands" },
          { title: "Cocktail & Statement Rings", href: "/products?category=rings&style=cocktail" },
          { title: "Daily Wear Casual Rings", href: "/products?category=rings&style=daily" },
        ],
      },
      {
        groupTitle: "By Metal & Gemstone",
        items: [
          { title: "Yellow Gold Rings (22K)", href: "/products?category=rings&metal=yellow-gold" },
          { title: "White Gold & Platinum", href: "/products?category=rings&metal=platinum" },
          { title: "Rose Gold Diamond Rings", href: "/products?category=rings&metal=rose-gold" },
          { title: "Emerald & Ruby Rings", href: "/products?category=rings&gem=gemstone" },
        ],
      },
    ],
    featured: {
      title: "The Eternal Solitaire",
      description: "Hand-selected, certified conflict-free diamonds set in timeless prong designs.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      href: "/products?category=rings&style=solitaire",
      ctaText: "Discover Rings",
    },
  },
  {
    id: "earrings",
    name: "Earrings",
    href: "/products?category=earrings",
    subCategories: [
      {
        groupTitle: "Popular Styles",
        items: [
          { title: "Diamond & Gold Studs", href: "/products?category=earrings&style=studs" },
          { title: "Classic & Modern Hoops", href: "/products?category=earrings&style=hoops" },
          { title: "Drop & Dangle Earrings", href: "/products?category=earrings&style=drops" },
          { title: "Traditional Jhumkas", href: "/products?category=earrings&style=jhumkas" },
          { title: "Chandbalis & Suidhaga", href: "/products?category=earrings&style=chandbalis" },
        ],
      },
      {
        groupTitle: "By Occasion",
        items: [
          { title: "Office & Daily Wear", href: "/products?category=earrings&occasion=daily" },
          { title: "Bridal & Wedding Glamour", href: "/products?category=earrings&occasion=wedding" },
          { title: "Party & Evening Wear", href: "/products?category=earrings&occasion=party" },
        ],
      },
    ],
    featured: {
      title: "Cascading Radiance",
      description: "From delicate everyday studs to grand royal heirloom jhumkas.",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
      href: "/products?category=earrings",
      ctaText: "Shop Earrings",
    },
  },
  {
    id: "necklaces",
    name: "Necklaces",
    href: "/products?category=necklaces",
    subCategories: [
      {
        groupTitle: "Necklace Styles",
        items: [
          { title: "Royal Chokers", href: "/products?category=necklaces&style=choker" },
          { title: "Solitaire & Diamond Pendants", href: "/products?category=necklaces&style=pendant" },
          { title: "Traditional Mangalsutras", href: "/products?category=necklaces&style=mangalsutra" },
          { title: "Layered & Lariat Chains", href: "/products?category=necklaces&style=chains" },
          { title: "Bridal Raani Haars", href: "/products?category=necklaces&style=haars" },
        ],
      },
      {
        groupTitle: "Craftsmanship",
        items: [
          { title: "Kundan & Meenakari", href: "/products?category=necklaces&craft=kundan" },
          { title: "Temple Antique Jewellery", href: "/products?category=necklaces&craft=temple" },
          { title: "Polki Uncut Diamonds", href: "/products?category=necklaces&craft=polki" },
        ],
      },
    ],
    featured: {
      title: "Imperial Statement Chokers",
      description: "Exquisite craftsmanship woven with natural emeralds and brilliant-cut diamonds.",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80",
      href: "/products?category=necklaces",
      ctaText: "Explore Necklaces",
    },
  },
  {
    id: "bracelets",
    name: "Bracelets",
    href: "/products?category=bracelets",
    subCategories: [
      {
        groupTitle: "Categories",
        items: [
          { title: "Tennis Bracelets", href: "/products?category=bracelets&style=tennis" },
          { title: "Chain & Link Bracelets", href: "/products?category=bracelets&style=chain" },
          { title: "Charm Bracelets", href: "/products?category=bracelets&style=charm" },
          { title: "Adjustable Kada Bracelets", href: "/products?category=bracelets&style=kada" },
        ],
      },
      {
        groupTitle: "Metals",
        items: [
          { title: "18K Yellow Gold", href: "/products?category=bracelets&metal=yellow-gold" },
          { title: "Rose Gold Modern Cuffs", href: "/products?category=bracelets&metal=rose-gold" },
          { title: "Platinum Diamond Lines", href: "/products?category=bracelets&metal=platinum" },
        ],
      },
    ],
    featured: {
      title: "Grace on Your Wrist",
      description: "Effortless elegance designed for seamless stacking and solo allure.",
      image: "https://images.unsplash.com/photo-1611591475829-063991207604?auto=format&fit=crop&w=600&q=80",
      href: "/products?category=bracelets",
      ctaText: "View Bracelets",
    },
  },
  {
    id: "bangles",
    name: "Bangles",
    href: "/products?category=bangles",
    subCategories: [
      {
        groupTitle: "Bangle Designs",
        items: [
          { title: "Traditional Gold Kadas", href: "/products?category=bangles&style=kada" },
          { title: "Daily Wear Gold Bangles", href: "/products?category=bangles&style=daily" },
          { title: "Diamond Eternity Bangles", href: "/products?category=bangles&style=diamond" },
          { title: "Antique Temple Bangles", href: "/products?category=bangles&style=temple" },
        ],
      },
      {
        groupTitle: "Purity & Sets",
        items: [
          { title: "22K Hallmarked Pair Sets", href: "/products?category=bangles&purity=22k" },
          { title: "Single Statement Kadas", href: "/products?category=bangles&type=single" },
          { title: "Bridal Chooda Accents", href: "/products?category=bangles&type=bridal" },
        ],
      },
    ],
    featured: {
      title: "Melodic Golden Curves",
      description: "Timeless 22K hallmarked gold bangles resonant with heritage and opulence.",
      image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
      href: "/products?category=bangles",
      ctaText: "Shop Bangles",
    },
  },
  {
    id: "mens-jewellery",
    name: "Men's Jewellery",
    href: "/products?gender=men",
    subCategories: [
      {
        groupTitle: "Men's Essentials",
        items: [
          { title: "Solid Gold & Platinum Chains", href: "/products?gender=men&category=chains" },
          { title: "Signet & Solitaire Rings", href: "/products?gender=men&category=rings" },
          { title: "Heavy Kadas & Cuffs", href: "/products?gender=men&category=kadas" },
          { title: "Diamond & Onyx Cufflinks", href: "/products?gender=men&category=cufflinks" },
          { title: "Kurta Buttons & Brooches", href: "/products?gender=men&category=accessories" },
        ],
      },
    ],
    featured: {
      title: "Distinguished Elegance",
      description: "Bold, masculine statement pieces cast in pure 18K/22K gold and platinum.",
      image: "https://images.unsplash.com/photo-1622398925373-3f9171e275f5?auto=format&fit=crop&w=600&q=80",
      href: "/products?gender=men",
      ctaText: "Explore Men's",
    },
  },
  {
    id: "womens-jewellery",
    name: "Women's Jewellery",
    href: "/products?gender=women",
    subCategories: [
      {
        groupTitle: "Curated Collections",
        items: [
          { title: "Everyday Light Luxury", href: "/products?gender=women&style=everyday" },
          { title: "Bridal Troussseau Suites", href: "/products?gender=women&style=bridal" },
          { title: "Festive Heirlooms", href: "/products?gender=women&style=festive" },
          { title: "Solitaire Collection", href: "/products?gender=women&style=solitaire" },
          { title: "Contemporary Chic", href: "/products?gender=women&style=contemporary" },
        ],
      },
    ],
    featured: {
      title: "The Feminine Radiance",
      description: "Celebrate every milestone with jewellery crafted to mirror grace and strength.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      href: "/products?gender=women",
      ctaText: "Explore Women's",
    },
  },
  {
    id: "collections",
    name: "Collections",
    href: "/products?collection=all",
    subCategories: [
      {
        groupTitle: "Signature Editions",
        items: [
          { title: "The Maharani Bridal Edit", href: "/products?collection=bridal" },
          { title: "Celeste Celestial Diamonds", href: "/products?collection=celeste" },
          { title: "Vedic Temple Heritage", href: "/products?collection=temple" },
          { title: "Aura Rose Gold & Pearls", href: "/products?collection=aura" },
        ],
      },
    ],
    featured: {
      title: "Curated Masterworks",
      description: "Thematic collections celebrating royal dynasties and celestial poetry.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      href: "/products?collection=all",
      ctaText: "View All Collections",
    },
  },
  {
    id: "offers",
    name: "Offers",
    href: "/products?offer=special-offers",
    badge: "Sale",
    isSpecial: true,
    subCategories: [
      {
        groupTitle: "Limited Period Deals",
        items: [
          { title: "Up to 25% Off Making Charges", href: "/products?offer=making-charges" },
          { title: "Diamond Upgrade Gala", href: "/products?offer=diamond-upgrade" },
          { title: "Festive Gold Coins & Bars", href: "/products?category=coins" },
          { title: "Complimentary Solitaire Pendant", href: "/products?offer=free-gift" },
        ],
      },
    ],
    featured: {
      title: "Privileged Festive Privé",
      description: "Enjoy zero making charges on select solitaire diamond creations this week.",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80",
      href: "/products?offer=special-offers",
      ctaText: "Claim Exclusive Offers",
    },
  },
];
