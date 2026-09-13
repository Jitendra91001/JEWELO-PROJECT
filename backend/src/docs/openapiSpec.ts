export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Jewelo Luxury Jewellery Maison REST API",
    version: "1.0.0",
    description: `
## Jewelo Haute Horlogerie & High Jewellery REST API
A production-grade, enterprise-scale backend architecture designed for luxury jewellery e-commerce.

### Key Capabilities:
- **Role-Based & Access Control Lists (RBAC/ACL)**: 5 Roles (\`SUPER_ADMIN\`, \`ADMIN\`, \`MANAGER\`, \`STAFF\`, \`CUSTOMER\`) with 42 granular permissions.
- **Diamond & Fine Gemstone Attributes**: Complete 4Cs specification (Carat, Clarity, Color, Cut), metal metallurgy (Gold 10K-24K, Platinum 950, Silver 925), and certification records (GIA, IGI, AGS, HRD).
- **Atomic Stock Management**: Zero negative inventory enforcement, race-condition protected stock reservations, and dedicated vault inventory tracking.
- **Transactional Commerce**: Multi-currency calculation, server-side cart pricing verification, customer coupon usage enforcement, address snapshotting, and \`JWL-YYYY-XXXXXX\` luxury order nomenclature.
- **Automated Vector PDF Generation**: Dynamic Tax Invoices and Gemological Certificates of Authenticity generated via \`pdfkit\`.
- **Media Asset Management**: Cloudinary integration with categorized storage, MIME-type enforcement, and secure memory buffering.
- **Reporting & Business Intelligence**: 8 aggregated analytical domains for executive management.
- **Security Hardened**: Helmet CSP, strict CORS, ReDoS regex escaping, rate limiting, and comprehensive audit trails.
    `,
    contact: {
      name: "Jewelo Engineering Team",
      email: "engineering@jewelo-luxury.com",
    },
    license: {
      name: "Proprietary",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1 Base Endpoint",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Standard JWT bearer authorization header. Format: \`Bearer <token>\`",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "HttpOnly cookie containing the signed session JWT token",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation executed successfully" },
          data: { type: "object", nullable: true },
          pagination: { $ref: "#/components/schemas/PaginationMeta" },
        },
        required: ["success", "message"],
      },
      ApiErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Unauthorized access: Missing required permission" },
          error: { type: "string", nullable: true },
        },
        required: ["success", "message"],
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 20 },
          total: { type: "integer", example: 142 },
          totalPages: { type: "integer", example: 8 },
          hasNextPage: { type: "boolean", example: true },
          hasPreviousPage: { type: "boolean", example: false },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "65a123f8b09d9c0012e4f01a" },
          name: { type: "string", example: "Eleanor Vance" },
          email: { type: "string", format: "email", example: "eleanor.vance@jewelo.com" },
          role: {
            type: "string",
            enum: ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "CUSTOMER"],
            example: "CUSTOMER",
          },
          phoneNumber: { type: "string", example: "+1 (555) 234-5678" },
          isActive: { type: "boolean", example: true },
          isBlocked: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", example: "65a123f8b09d9c0012e4f02b" },
          name: { type: "string", example: "Solitaire Royal Brilliant Diamond Ring" },
          slug: { type: "string", example: "solitaire-royal-brilliant-diamond-ring" },
          sku: { type: "string", example: "JWL-RNG-001" },
          description: { type: "string", example: "Masterfully hand-crafted 18K Yellow Gold ring mounted with a flawless 1.5ct Solitaire diamond." },
          price: { type: "number", example: 8500.0 },
          compareAtPrice: { type: "number", example: 9800.0 },
          costPrice: { type: "number", example: 4200.0 },
          stock: { type: "integer", example: 5 },
          categoryId: { type: "string", example: "65a123f8b09d9c0012e4f03c" },
          metal: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["GOLD", "PLATINUM", "SILVER", "ROSE_GOLD", "WHITE_GOLD"], example: "GOLD" },
              purity: { type: "string", enum: ["10K", "14K", "18K", "22K", "24K", "PT950", "925"], example: "18K" },
              color: { type: "string", example: "Yellow" },
              weightInGrams: { type: "number", example: 4.85 },
            },
          },
          diamondDetails: {
            type: "object",
            properties: {
              shape: { type: "string", example: "Round Brilliant" },
              carat: { type: "number", example: 1.5 },
              color: { type: "string", example: "D" },
              clarity: { type: "string", example: "VVS1" },
              cut: { type: "string", example: "Excellent" },
              certificationNumber: { type: "string", example: "GIA-2194819034" },
              certificateLab: { type: "string", example: "GIA" },
            },
          },
          images: {
            type: "array",
            items: { type: "string" },
            example: ["https://res.cloudinary.com/jewelo/image/upload/v1/products/ring-front.jpg"],
          },
          ringSize: { type: "number", example: 6.5 },
          tags: { type: "array", items: { type: "string" }, example: ["Engagement", "Solitaire", "Diamond"] },
          isFeatured: { type: "boolean", example: true },
          isBestseller: { type: "boolean", example: true },
          isNewArrival: { type: "boolean", example: false },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "ARCHIVED", "DRAFT"], example: "ACTIVE" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", example: "65a123f8b09d9c0012e4f03c" },
          name: { type: "string", example: "Rings" },
          slug: { type: "string", example: "rings" },
          description: { type: "string", example: "Fine artisan rings crafted from high-grade metals and gemstones." },
          parentId: { type: "string", nullable: true, example: null },
          level: { type: "integer", example: 0 },
          image: { type: "string", example: "https://res.cloudinary.com/jewelo/image/upload/v1/categories/rings.jpg" },
          isActive: { type: "boolean", example: true },
          children: {
            type: "array",
            items: { $ref: "#/components/schemas/Category" },
          },
        },
      },
      Collection: {
        type: "object",
        properties: {
          id: { type: "string", example: "65a123f8b09d9c0012e4f04d" },
          title: { type: "string", example: "Heritage Imperial Solitaire 2026" },
          slug: { type: "string", example: "heritage-imperial-solitaire-2026" },
          description: { type: "string", example: "Exquisite bridal masterpieces inspired by European royalty." },
          image: { type: "string" },
          bannerImage: { type: "string" },
          products: { type: "array", items: { type: "string" } },
          isFeatured: { type: "boolean", example: true },
          isActive: { type: "boolean", example: true },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },
      InventoryItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          productId: { type: "string" },
          sku: { type: "string", example: "JWL-RNG-001" },
          vaultLocation: { type: "string", example: "Vault 3 - Tier A - Safe 12" },
          currentStock: { type: "integer", example: 5 },
          reservedStock: { type: "integer", example: 2 },
          soldQuantity: { type: "integer", example: 18 },
          safetyStock: { type: "integer", example: 2 },
          reorderLevel: { type: "integer", example: 3 },
          availableStock: { type: "integer", example: 3 },
        },
      },
      Cart: {
        type: "object",
        properties: {
          userId: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { $ref: "#/components/schemas/Product" },
                quantity: { type: "integer", example: 1 },
                unitPrice: { type: "number", example: 8500.0 },
                totalPrice: { type: "number", example: 8500.0 },
                metalSnapshot: { type: "object" },
                ringSize: { type: "number", example: 6.5 },
              },
            },
          },
          subtotal: { type: "number", example: 8500.0 },
          discountAmount: { type: "number", example: 850.0 },
          couponCode: { type: "string", example: "ROYALTY10" },
          taxAmount: { type: "number", example: 612.0 },
          total: { type: "number", example: 8262.0 },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderNumber: { type: "string", example: "JWL-2026-000142" },
          userId: { type: "string" },
          items: { type: "array", items: { type: "object" } },
          shippingAddress: { type: "object" },
          billingAddress: { type: "object" },
          paymentMethod: { type: "string", enum: ["CREDIT_CARD", "BANK_WIRE", "STRIPE", "RAZORPAY", "PAYPAL", "CASH_ON_DELIVERY"] },
          paymentStatus: { type: "string", enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"] },
          orderStatus: { type: "string", enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] },
          pricing: {
            type: "object",
            properties: {
              subtotal: { type: "number", example: 8500.0 },
              discount: { type: "number", example: 850.0 },
              shippingFee: { type: "number", example: 0.0 },
              tax: { type: "number", example: 612.0 },
              total: { type: "number", example: 8262.0 },
            },
          },
          statusHistory: {
            type: "array",
            items: {
              type: "object",
              properties: {
                status: { type: "string" },
                changedAt: { type: "string", format: "date-time" },
                changedBy: { type: "string" },
                note: { type: "string" },
              },
            },
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Coupon: {
        type: "object",
        properties: {
          id: { type: "string" },
          code: { type: "string", example: "NOBLE10" },
          description: { type: "string", example: "10% off prestigious diamond selections" },
          discountType: { type: "string", enum: ["PERCENTAGE", "FIXED"] },
          discountValue: { type: "number", example: 10 },
          minOrderAmount: { type: "number", example: 5000 },
          maxDiscountAmount: { type: "number", example: 1500 },
          perCustomerLimit: { type: "integer", example: 1 },
          totalUsageLimit: { type: "integer", example: 200 },
          usageCount: { type: "integer", example: 42 },
          expiresAt: { type: "string", format: "date-time" },
          isActive: { type: "boolean", example: true },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          productId: { type: "string" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          title: { type: "string", example: "Exquisite craftsmanship and unmatched brilliance" },
          comment: { type: "string", example: "The GIA certified diamond exceeded all our bridal expectations." },
          isVerifiedPurchase: { type: "boolean", example: true },
          status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"], example: "APPROVED" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ReturnRequest: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderId: { type: "string" },
          customerId: { type: "string" },
          items: { type: "array", items: { type: "object" } },
          reason: { type: "string", enum: ["DEFECTIVE", "WRONG_ITEM", "NOT_AS_DESCRIBED", "SIZE_EXCHANGE", "BUYERS_REMORSE"] },
          customerNote: { type: "string" },
          adminNote: { type: "string" },
          status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "RECEIVED", "REFUNDED"] },
          refundAmount: { type: "number", example: 8262.0 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register customer account",
        description: "Creates a new customer profile and returns an issued JWT authentication token and session cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Charlotte Dupont" },
                  email: { type: "string", format: "email", example: "charlotte@jewelo.com" },
                  password: { type: "string", format: "password", example: "Password@123" },
                  phoneNumber: { type: "string", example: "+15551234567" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Account successfully registered",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
          },
          409: { description: "Email already registered in system" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Sign in to account",
        description: "Authenticates credentials and sets secure session cookie + authorization bearer token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@jewelo.com" },
                  password: { type: "string", format: "password", example: "SuperAdmin@2026" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
          },
          401: { description: "Invalid credentials or blocked account" },
        },
      },
    },
    "/auth/profile": {
      get: {
        tags: ["Authentication"],
        summary: "Get authenticated profile",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: "Current user profile retrieved",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
          },
          401: { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Authentication"],
        summary: "Update current profile",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Lady Eleanor" },
                  phoneNumber: { type: "string", example: "+1 555 999 1234" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile updated successfully" },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List catalog products",
        description: "Retrieves paginated products with multi-faceted diamond, metal, price, and category filters.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "category", in: "query", schema: { type: "string" }, description: "Category slug or ID" },
          { name: "metalType", in: "query", schema: { type: "string", enum: ["GOLD", "PLATINUM", "SILVER", "ROSE_GOLD", "WHITE_GOLD"] } },
          { name: "diamondShape", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "inStock", in: "query", schema: { type: "boolean" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["newest", "price_asc", "price_desc", "rating", "bestselling"] } },
        ],
        responses: {
          200: {
            description: "Filtered catalog listing with pagination",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        description: "Requires product.create permission. Supports multi-file multipart image upload to Cloudinary.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "price", "categoryId", "metalType"],
                properties: {
                  name: { type: "string", example: "Imperial Pavé Diamond Solitaire Ring" },
                  sku: { type: "string", example: "JWL-RNG-104" },
                  description: { type: "string" },
                  price: { type: "number", example: 12500.0 },
                  categoryId: { type: "string" },
                  metalType: { type: "string", example: "PLATINUM" },
                  metalPurity: { type: "string", example: "PT950" },
                  metalWeight: { type: "number", example: 5.2 },
                  diamondCarat: { type: "number", example: 2.1 },
                  diamondColor: { type: "string", example: "E" },
                  diamondClarity: { type: "string", example: "VVS2" },
                  diamondCut: { type: "string", example: "Ideal" },
                  certificateLab: { type: "string", example: "GIA" },
                  certificationNumber: { type: "string", example: "GIA-5501839120" },
                  stock: { type: "integer", example: 3 },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Product created successfully" },
          403: { description: "Forbidden: product.create required" },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Product found and returned" },
          404: { description: "Product not found" },
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Update product attributes",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Product updated successfully" },
          403: { description: "Forbidden: product.update required" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Product deleted successfully" },
          403: { description: "Forbidden: product.delete required" },
        },
      },
    },
    "/products/{id}/certificate": {
      get: {
        tags: ["Products"],
        summary: "Download Gemological Authenticity Certificate PDF",
        description: "Streams a high-resolution vector PDF certificate including diamond 4Cs, metal hallmarks, and laboratory seal.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "PDF file stream",
            content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
          },
          404: { description: "Product or certificate details not found" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get hierarchical category tree",
        description: "Returns nested tree of active categories with subcategory nodes.",
        responses: {
          200: { description: "Category tree structure" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        description: "Requires category.create permission. Prevents circular parent-child hierarchies.",
        responses: {
          201: { description: "Category created" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/collections": {
      get: {
        tags: ["Collections"],
        summary: "List curated collections",
        responses: { 200: { description: "Collections returned" } },
      },
      post: {
        tags: ["Collections"],
        summary: "Create curated collection",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 201: { description: "Collection created" } },
      },
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get customer cart",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 200: { description: "Active cart with verified calculations" } },
      },
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer", default: 1 },
                  ringSize: { type: "number", example: 7 },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Item added to cart" } },
      },
    },
    "/cart/coupon": {
      post: {
        tags: ["Cart"],
        summary: "Apply promotional coupon to cart",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code"],
                properties: { code: { type: "string", example: "ROYALTY10" } },
              },
            },
          },
        },
        responses: { 200: { description: "Coupon applied" }, 400: { description: "Coupon invalid or limit reached" } },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove coupon from cart",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 200: { description: "Coupon removed" } },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders",
        description: "Returns customer orders or all orders if administrative permissions are present.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "status", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "List of orders" } },
      },
      post: {
        tags: ["Orders"],
        summary: "Place new order",
        description: "Converts cart or direct items into order, atomically reserves vault stock, and locks addresses.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shippingAddressId", "paymentMethod"],
                properties: {
                  shippingAddressId: { type: "string" },
                  billingAddressId: { type: "string" },
                  paymentMethod: { type: "string", enum: ["CREDIT_CARD", "STRIPE", "RAZORPAY", "BANK_WIRE", "CASH_ON_DELIVERY"] },
                  couponCode: { type: "string" },
                  orderNotes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Order placed successfully" },
          400: { description: "Stock unavailable or invalid cart" },
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order details" } },
      },
    },
    "/orders/{id}/cancel": {
      patch: {
        tags: ["Orders"],
        summary: "Cancel order",
        description: "Cancels eligible order and atomically releases reserved stock back to vault inventory.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order cancelled and stock released" } },
      },
    },
    "/orders/{id}/invoice": {
      get: {
        tags: ["Orders"],
        summary: "Download official Tax Invoice PDF",
        description: "Streams official branded vector PDF invoice containing serial numbers, VAT/GST breakdown, and delivery details.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "PDF invoice stream",
            content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/payments/initiate": {
      post: {
        tags: ["Payments"],
        summary: "Initiate gateway payment transaction",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: { orderId: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Gateway intent / order token generated" } },
      },
    },
    "/payments/verify": {
      post: {
        tags: ["Payments"],
        summary: "Verify gateway signature server-side",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "paymentId"],
                properties: {
                  orderId: { type: "string" },
                  paymentId: { type: "string" },
                  signature: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Payment verified and order marked PAID" } },
      },
    },
    "/inventory": {
      get: {
        tags: ["Vault Inventory"],
        summary: "List vault stock levels",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 200: { description: "Inventory listing" }, 403: { description: "Forbidden: inventory.view required" } },
      },
    },
    "/inventory/{productId}/adjust": {
      patch: {
        tags: ["Vault Inventory"],
        summary: "Adjust stock with audit justification",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity", "reason"],
                properties: {
                  quantity: { type: "integer", example: 10 },
                  reason: { type: "string", example: "Vault replenishment from Antwerp diamond cutters" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Stock adjusted and audit log recorded" } },
      },
    },
    "/admin/dashboard": {
      get: {
        tags: ["Admin & Analytics"],
        summary: "Executive business metrics",
        description: "Aggregates gross revenue, total orders, low-stock warnings, customer growth, and pending returns.",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 200: { description: "Dashboard aggregation payload" } },
      },
    },
    "/reports/sales": {
      get: {
        tags: ["Reporting Suite"],
        summary: "Sales report aggregation",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: { 200: { description: "Sales analytics dataset" } },
      },
    },
    "/search": {
      get: {
        tags: ["Global Search"],
        summary: "ReDoS-protected global catalog search",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string", maxLength: 100 } },
          { name: "category", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Unified matching products and categories" } },
      },
    },
  },
};
