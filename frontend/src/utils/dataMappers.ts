/**
 * Jewelo UI <-> API Data Normalization & Mapping Layer
 * Converts backend MongoDB document shapes into frontend display interfaces
 */

export const mapBackendProduct = (p: any): any => {
  if (!p) return null;

  const id = p._id || p.id || String(Math.random());
  const images = Array.isArray(p.images) && p.images.length > 0
    ? p.images.map((img: any) => (typeof img === "string" ? img : img.url))
    : p.thumbnail
    ? [p.thumbnail]
    : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"];

  const categoryName =
    typeof p.category === "object" && p.category !== null
      ? p.category.name
      : typeof p.categoryId === "object" && p.categoryId !== null
      ? p.categoryId.name
      : p.category || "High Jewellery";

  const price = Number(p.price || 0);
  const originalPrice = Number(p.compareAtPrice || p.comparePrice || price);
  const stock = Number(p.stock !== undefined ? p.stock : 5);

  return {
    id,
    _id: id,
    name: p.name || "Masterpiece Jewellery",
    slug: p.slug || id,
    sku: p.sku || `JWL-${id.slice(-6).toUpperCase()}`,
    description: p.description || "Crafted with peerless precision and certified precious gemstones.",
    price,
    originalPrice: originalPrice > price ? originalPrice : undefined,
    comparePrice: originalPrice,
    cost: Number(p.costPrice || 0),
    stock,
    quantity: stock,
    inStock: stock > 0,
    isActive: p.status ? p.status === "active" || p.status === "ACTIVE" : true,
    isFeatured: Boolean(p.isFeatured),
    isBestseller: Boolean(p.isBestseller),
    isNewArrival: Boolean(p.isNewArrival),
    images,
    thumbnail: images[0],
    category: categoryName,
    categoryId: typeof p.category === "object" ? p.category?._id : p.category,
    metal: p.metal?.type || p.metalType || "Gold",
    purity: p.metal?.purity || p.metalPurity || "18K",
    material: p.metal?.type || p.metalType || "Gold",
    weight: p.metal?.weightInGrams ? `${p.metal.weightInGrams}g` : p.weight || "4.5g",
    diamondDetails: p.diamondDetails || null,
    rating: Number(p.averageRating || p.rating || 4.9),
    reviews: Number(p.numReviews || p.reviewsCount || 18),
    reviewsCount: Number(p.numReviews || p.reviewsCount || 18),
    tags: Array.isArray(p.tags) ? p.tags : ["Fine Jewellery", "Handcrafted"],
    createdAt: p.createdAt || new Date().toISOString(),
  };
};

export const mapBackendCategory = (c: any): any => {
  if (!c) return null;
  const id = c._id || c.id || String(Math.random());
  return {
    id,
    _id: id,
    name: c.name || "Category",
    slug: c.slug || id,
    description: c.description || "",
    image: c.image || c.thumbnail || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
    productCount: Number(c.productCount || c.productsCount || 0),
    isActive: c.isActive !== false,
    level: Number(c.level || 0),
    children: Array.isArray(c.children) ? c.children.map(mapBackendCategory) : [],
  };
};

export const mapBackendCartItem = (item: any): any => {
  if (!item) return null;
  const productObj = typeof item.product === "object" && item.product !== null ? item.product : {};
  const mappedProduct = mapBackendProduct(productObj);

  const id = item._id || item.id || String(Math.random());
  const productId = mappedProduct?.id || (typeof item.product === "string" ? item.product : item.productId);

  const price = Number(item.price || mappedProduct?.price || 0);
  const name = mappedProduct?.name || item.name || "Jewellery Item";
  const image = mappedProduct?.thumbnail || item.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800";

  return {
    id,
    _id: id,
    productId,
    name,
    image,
    price,
    quantity: Number(item.quantity || 1),
    weight: mappedProduct?.weight || item.weight || "4.5g",
    purity: mappedProduct?.purity || item.metalPurity || item.purity || "18K",
    ringSize: item.selectedSize || item.ringSize,
    metalSnapshot: item.metalSnapshot || null,
    product: mappedProduct,
  };
};

export const mapBackendOrder = (o: any): any => {
  if (!o) return null;
  const id = o._id || o.id;
  const items = Array.isArray(o.items) ? o.items.map(mapBackendCartItem) : [];

  return {
    id,
    _id: id,
    orderNumber: o.orderNumber || `JWL-${id.slice(-6).toUpperCase()}`,
    items,
    totalAmount: Number(o.totalAmount || o.pricing?.total || 0),
    subtotal: Number(o.subtotal || o.pricing?.subtotal || 0),
    discountAmount: Number(o.discountAmount || o.pricing?.discount || 0),
    taxAmount: Number(o.taxAmount || o.pricing?.tax || 0),
    shippingFee: Number(o.shippingFee || o.pricing?.shippingFee || 0),
    orderStatus: o.orderStatus || "PENDING",
    paymentStatus: o.paymentStatus || "PENDING",
    paymentMethod: o.paymentMethod || "CREDIT_CARD",
    shippingAddress: o.shippingAddress || null,
    createdAt: o.createdAt || new Date().toISOString(),
    statusHistory: o.statusHistory || [],
  };
};
