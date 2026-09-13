import mongoose from "mongoose";
import { env } from "../config/env.config";
import { connectDB, disconnectDB } from "../config/db.config";
import {
  User,
  Role,
  Permission,
  Category,
  Collection,
  Product,
  ProductVariant,
  Coupon,
  Banner,
} from "../models";
import { USER_ROLES, METAL_TYPES, METAL_PURITIES, CERTIFICATION_AGENCIES } from "../constants";
import { ALL_PERMISSIONS_LIST, PERMISSIONS } from "../constants/permissions";

const seedDatabase = async () => {
  try {
    console.log("💎 Connecting to MongoDB for idempotent seeding...");
    await connectDB();

    // 1. Seed All 42 Permissions
    console.log(`🔒 Seeding ${ALL_PERMISSIONS_LIST.length} granular permissions...`);
    const permissionDocsMap = new Map<string, mongoose.Types.ObjectId>();

    for (const perm of ALL_PERMISSIONS_LIST) {
      const doc = await Permission.findOneAndUpdate(
        { code: perm.code },
        {
          $set: {
            name: perm.name,
            code: perm.code,
            module: perm.module,
            description: perm.description,
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );
      permissionDocsMap.set(perm.code, doc._id as mongoose.Types.ObjectId);
    }

    const allPermissionIds = Array.from(permissionDocsMap.values());

    // 2. Seed the 5 Roles with Granular ACL mapping
    console.log("👑 Seeding RBAC Roles matrix...");

    // SUPER_ADMIN: Global permissions
    const superAdminRole = await Role.findOneAndUpdate(
      { code: USER_ROLES.SUPER_ADMIN },
      {
        $set: {
          code: USER_ROLES.SUPER_ADMIN,
          name: "Super Administrator",
          description: "Global god-mode privileges across the entire Maison infrastructure",
          permissions: allPermissionIds,
          isSystem: true,
        },
      },
      { upsert: true, new: true }
    );

    // ADMIN: Complete store operations
    const adminPermissionCodes = [
      PERMISSIONS.PRODUCT_VIEW, PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_UPDATE, PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.CATEGORY_VIEW, PERMISSIONS.CATEGORY_CREATE, PERMISSIONS.CATEGORY_UPDATE, PERMISSIONS.CATEGORY_DELETE,
      PERMISSIONS.COLLECTION_VIEW, PERMISSIONS.COLLECTION_CREATE, PERMISSIONS.COLLECTION_UPDATE, PERMISSIONS.COLLECTION_DELETE,
      PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_CREATE, PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_DELETE,
      PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_CREATE, PERMISSIONS.ORDER_UPDATE, PERMISSIONS.ORDER_CANCEL, PERMISSIONS.ORDER_REFUND,
      PERMISSIONS.CUSTOMER_VIEW, PERMISSIONS.CUSTOMER_UPDATE, PERMISSIONS.CUSTOMER_BLOCK,
      PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE,
      PERMISSIONS.COUPON_VIEW, PERMISSIONS.COUPON_CREATE, PERMISSIONS.COUPON_UPDATE, PERMISSIONS.COUPON_DELETE,
      PERMISSIONS.BANNER_VIEW, PERMISSIONS.BANNER_CREATE, PERMISSIONS.BANNER_UPDATE, PERMISSIONS.BANNER_DELETE,
      PERMISSIONS.REVIEW_VIEW, PERMISSIONS.REVIEW_APPROVE, PERMISSIONS.REVIEW_REJECT, PERMISSIONS.REVIEW_DELETE,
      PERMISSIONS.REPORT_VIEW,
      PERMISSIONS.NOTIFICATION_VIEW, PERMISSIONS.NOTIFICATION_MANAGE,
      PERMISSIONS.RETURN_VIEW, PERMISSIONS.RETURN_APPROVE, PERMISSIONS.RETURN_REJECT,
    ];
    const adminPermissionIds = adminPermissionCodes
      .map((code) => permissionDocsMap.get(code))
      .filter(Boolean) as mongoose.Types.ObjectId[];

    const adminRole = await Role.findOneAndUpdate(
      { code: USER_ROLES.ADMIN },
      {
        $set: {
          code: USER_ROLES.ADMIN,
          name: "Maison Administrator",
          description: "Full store operational and catalogue management authority",
          permissions: adminPermissionIds,
          isSystem: true,
        },
      },
      { upsert: true, new: true }
    );

    // MANAGER: Inventory, orders, catalogue management
    const managerPermissionCodes = [
      PERMISSIONS.PRODUCT_VIEW, PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.COLLECTION_VIEW,
      PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_UPDATE,
      PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_UPDATE, PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.CUSTOMER_VIEW,
      PERMISSIONS.COUPON_VIEW,
      PERMISSIONS.REVIEW_VIEW, PERMISSIONS.REVIEW_APPROVE,
      PERMISSIONS.REPORT_VIEW,
      PERMISSIONS.RETURN_VIEW, PERMISSIONS.RETURN_APPROVE,
    ];
    const managerPermissionIds = managerPermissionCodes
      .map((code) => permissionDocsMap.get(code))
      .filter(Boolean) as mongoose.Types.ObjectId[];

    await Role.findOneAndUpdate(
      { code: USER_ROLES.MANAGER },
      {
        $set: {
          code: USER_ROLES.MANAGER,
          name: "Maison Floor Manager",
          description: "Inventory supervision and order fulfillment management",
          permissions: managerPermissionIds,
          isSystem: true,
        },
      },
      { upsert: true, new: true }
    );

    // STAFF: Customer assistance & order viewing
    const staffPermissionCodes = [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.COLLECTION_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.CUSTOMER_VIEW,
    ];
    const staffPermissionIds = staffPermissionCodes
      .map((code) => permissionDocsMap.get(code))
      .filter(Boolean) as mongoose.Types.ObjectId[];

    await Role.findOneAndUpdate(
      { code: USER_ROLES.STAFF },
      {
        $set: {
          code: USER_ROLES.STAFF,
          name: "Sales Consultant / Staff",
          description: "Showroom concierge and customer order assistance",
          permissions: staffPermissionIds,
          isSystem: true,
        },
      },
      { upsert: true, new: true }
    );

    // CUSTOMER: Standard client privileges
    const customerPermissionCodes = [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.COLLECTION_VIEW,
      PERMISSIONS.ORDER_CREATE,
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.NOTIFICATION_VIEW,
    ];
    const customerPermissionIds = customerPermissionCodes
      .map((code) => permissionDocsMap.get(code))
      .filter(Boolean) as mongoose.Types.ObjectId[];

    await Role.findOneAndUpdate(
      { code: USER_ROLES.CUSTOMER },
      {
        $set: {
          code: USER_ROLES.CUSTOMER,
          name: "Valued Customer",
          description: "Authenticated client with purchasing and wishlist privileges",
          permissions: customerPermissionIds,
          isSystem: true,
        },
      },
      { upsert: true, new: true }
    );

    // 3. Seed Development SUPER_ADMIN User
    console.log("👤 Seeding development SUPER_ADMIN user...");
    const adminEmail = (process.env.ADMIN_EMAIL || "superadmin@jewelo.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "JeweloAdmin@2026";

    let superAdminUser = await User.findOne({ email: adminEmail });
    if (!superAdminUser) {
      superAdminUser = await User.create({
        name: "JEWELO Chief Executive",
        email: adminEmail,
        password: adminPassword,
        phone: "+91 98765 00001",
        role: superAdminRole._id,
        isActive: true,
        isEmailVerified: true,
      });
      console.log(`   Created SUPER_ADMIN: ${adminEmail}`);
    } else {
      superAdminUser.role = superAdminRole._id as any;
      superAdminUser.isActive = true;
      await superAdminUser.save();
      console.log(`   Verified existing SUPER_ADMIN: ${adminEmail}`);
    }

    // 4. Seed Hierarchical Luxury Categories
    console.log("📁 Seeding luxury category hierarchy...");
    const rootCategory = await Category.findOneAndUpdate(
      { slug: "jewellery" },
      {
        $set: {
          name: "High Jewellery",
          slug: "jewellery",
          description: "Maison signature haute joaillerie collections",
          level: 1,
          sortOrder: 1,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    const ringsCategory = await Category.findOneAndUpdate(
      { slug: "rings" },
      {
        $set: {
          name: "Rings",
          slug: "rings",
          description: "Solitaires, eternity bands, and bespoke statement rings",
          parentCategory: rootCategory._id,
          level: 2,
          sortOrder: 1,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    const diamondRingsCategory = await Category.findOneAndUpdate(
      { slug: "diamond-rings" },
      {
        $set: {
          name: "Diamond Solitaire Rings",
          slug: "diamond-rings",
          description: "GIA certified natural and conflict-free diamond solitaires",
          parentCategory: ringsCategory._id,
          level: 3,
          sortOrder: 1,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    const necklacesCategory = await Category.findOneAndUpdate(
      { slug: "necklaces" },
      {
        $set: {
          name: "Necklaces & Pendants",
          slug: "necklaces",
          description: "Chokers, collar necklaces, and solitaire diamond pendants",
          parentCategory: rootCategory._id,
          level: 2,
          sortOrder: 2,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    const earringsCategory = await Category.findOneAndUpdate(
      { slug: "earrings" },
      {
        $set: {
          name: "Earrings",
          slug: "earrings",
          description: "Diamond studs, drops, chandeliers, and hoops",
          parentCategory: rootCategory._id,
          level: 2,
          sortOrder: 3,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    const braceletsCategory = await Category.findOneAndUpdate(
      { slug: "bracelets" },
      {
        $set: {
          name: "Bracelets & Bangles",
          slug: "bracelets",
          description: "Tennis bracelets, royal kadas, and gemstone cuffs",
          parentCategory: rootCategory._id,
          level: 2,
          sortOrder: 4,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    // 5. Seed Curated Collections
    console.log("✨ Seeding curated seasonal collections...");
    const royalCollection = await Collection.findOneAndUpdate(
      { slug: "royal-solitaire-2026" },
      {
        $set: {
          name: "The Royal Solitaire Collection 2026",
          slug: "royal-solitaire-2026",
          description: "Majestic solitaires set in platinum PT950 and 18K yellow gold",
          bannerImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
          thumbnailImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
          isFeatured: true,
          status: "ACTIVE",
          sortOrder: 1,
        },
      },
      { upsert: true, new: true }
    );

    const bridalCollection = await Collection.findOneAndUpdate(
      { slug: "bridal-heritage" },
      {
        $set: {
          name: "Imperial Bridal Heritage",
          slug: "bridal-heritage",
          description: "Centuries of royal Indian craftsmanship woven into 22K gold bridal sets",
          bannerImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
          thumbnailImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
          isFeatured: true,
          status: "ACTIVE",
          sortOrder: 2,
        },
      },
      { upsert: true, new: true }
    );

    // 6. Seed Sample Luxury Products & Variants
    console.log("💍 Seeding sample jewellery products...");
    const product1 = await Product.findOneAndUpdate(
      { sku: "JWL-RNG-001" },
      {
        $set: {
          sku: "JWL-RNG-001",
          name: "The Grand Empress Diamond Solitaire",
          slug: "grand-empress-diamond-solitaire",
          description: "An extraordinary 2.05-carat round brilliant cut diamond solitaire crowned in a four-prong setting of pure platinum PT950.",
          shortDescription: "2.05ct GIA Certified Solitaire in PT950 Platinum",
          category: diamondRingsCategory._id,
          collectionId: royalCollection._id,
          metalType: METAL_TYPES.PLATINUM,
          metalPurity: METAL_PURITIES.PLATINUM_950,
          metalWeight: 5.8,
          totalDiamondWeightCarat: 2.05,
          diamondDetails: [
            { carat: 2.05, clarity: "VVS1", color: "D", cut: "EXCELLENT", count: 1, shape: "Round Brilliant" },
          ],
          certification: {
            agency: CERTIFICATION_AGENCIES.GIA,
            certificateNumber: "GIA-2195849201",
            isHallmarked: true,
          },
          price: 645000,
          comparePrice: 720000,
          costPrice: 480000,
          stock: 4,
          safetyThreshold: 2,
          inStock: true,
          thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
          ],
          sizes: ["12", "14", "16"],
          gender: "Women",
          status: "PUBLISHED",
          isFeatured: true,
          isBestseller: true,
          isNewArrival: false,
          rating: 4.9,
          reviewsCount: 14,
        },
      },
      { upsert: true, new: true }
    );

    const product2 = await Product.findOneAndUpdate(
      { sku: "JWL-NCK-002" },
      {
        $set: {
          sku: "JWL-NCK-002",
          name: "Aura of Versailles Diamond Choker",
          slug: "aura-of-versailles-diamond-choker",
          description: "Cascading rows of pear-cut and marquise diamonds totaling 8.50 carats, hand-set in 18K White Gold.",
          shortDescription: "8.50ct Diamond Statement Choker in 18K White Gold",
          category: necklacesCategory._id,
          collectionId: bridalCollection._id,
          metalType: METAL_TYPES.WHITE_GOLD,
          metalPurity: METAL_PURITIES.GOLD_18K,
          metalWeight: 38.5,
          totalDiamondWeightCarat: 8.5,
          diamondDetails: [
            { carat: 8.5, clarity: "VS1", color: "F", cut: "EXCELLENT", count: 86, shape: "Marquise & Pear" },
          ],
          certification: {
            agency: CERTIFICATION_AGENCIES.IGI,
            certificateNumber: "IGI-99843211",
            isHallmarked: true,
          },
          price: 1250000,
          comparePrice: 1380000,
          costPrice: 920000,
          stock: 2,
          safetyThreshold: 1,
          inStock: true,
          thumbnail: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
          images: [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
          ],
          gender: "Women",
          status: "PUBLISHED",
          isFeatured: true,
          isBestseller: false,
          isNewArrival: true,
          rating: 5.0,
          reviewsCount: 6,
        },
      },
      { upsert: true, new: true }
    );

    // Link products to Collections
    await Collection.findByIdAndUpdate(royalCollection._id, { $addToSet: { products: product1._id } });
    await Collection.findByIdAndUpdate(bridalCollection._id, { $addToSet: { products: product2._id } });

    // 7. Seed Sample Coupons
    console.log("🏷️  Seeding coupons...");
    await Coupon.findOneAndUpdate(
      { code: "MAISON10" },
      {
        $set: {
          code: "MAISON10",
          description: "10% privilege savings on high jewellery up to ₹25,000",
          discountType: "PERCENTAGE",
          discountValue: 10,
          minOrderValue: 50000,
          maxDiscountAmount: 25000,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          usageLimit: 1000,
          userUsageLimit: 1,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    await Coupon.findOneAndUpdate(
      { code: "WELCOME5000" },
      {
        $set: {
          code: "WELCOME5000",
          description: "Flat ₹5,000 complimentary concierge gift on first order",
          discountType: "FLAT",
          discountValue: 5000,
          minOrderValue: 40000,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          userUsageLimit: 1,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    // 8. Seed Homepage Hero Banners
    console.log("🖼️  Seeding homepage promotional banners...");
    await Banner.findOneAndUpdate(
      { title: "The Royal Solitaire Collection" },
      {
        $set: {
          title: "The Royal Solitaire Collection",
          subtitle: "Uncompromising brilliance crafted in GIA-certified diamonds and PT950 platinum.",
          desktopImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
          mobileImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
          linkUrl: "/collections/royal-solitaire-2026",
          ctaUrl: "/collections/royal-solitaire-2026",
          buttonText: "Explore Solitaires",
          ctaText: "Explore Solitaires",
          placement: "HERO_CAROUSEL",
          priorityOrder: 1,
          status: "PUBLISHED",
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Seed completed successfully with zero duplicates!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// Execute if called directly from CLI
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
