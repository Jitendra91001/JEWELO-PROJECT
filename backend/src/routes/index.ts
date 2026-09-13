import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import collectionRoutes from "./collection.routes";
import inventoryRoutes from "./inventory.routes";
import orderRoutes from "./order.routes";
import cartRoutes from "./cart.routes";
import wishlistRoutes from "./wishlist.routes";
import addressRoutes from "./address.routes";
import adminRoutes from "./admin.routes";
import couponRoutes from "./coupon.routes";
import reviewRoutes from "./review.routes";
import bannerRoutes from "./banner.routes";
import notificationRoutes from "./notification.routes";
import returnRoutes from "./return.routes";
import paymentRoutes from "./payment.routes";
import reportRoutes from "./report.routes";
import searchRoutes from "./search.routes";
import feedbackRoutes from "./feedback.routes";
import invoiceRoutes from "./invoice.routes";
import settingsRoutes from "./settings.routes";
import docsRoutes from "./docs.routes";

const router = Router();

// API Documentation (OpenAPI / Swagger UI)
router.use("/docs", docsRoutes);

// Core Identity & Administration
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

// Catalog & Inventory
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/search", searchRoutes);

// Commerce & Fulfillment
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/addresses", addressRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/payment", paymentRoutes); // Backward compatibility
router.use("/returns", returnRoutes);
router.use("/invoice", invoiceRoutes);

// Engagement & Content
router.use("/reviews", reviewRoutes);
router.use("/banners", bannerRoutes);
router.use("/notifications", notificationRoutes);
router.use("/feedback", feedbackRoutes);

// Analytics & Configurations
router.use("/reports", reportRoutes);
router.use("/settings", settingsRoutes);

export default router;
