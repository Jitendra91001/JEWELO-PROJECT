# Jewelry E-Commerce Backend API

A production-ready Node.js backend for an e-commerce jewelry store with complete API support for user authentication, products, orders, cart, wishlist, reviews, and admin management.

## Features

- ✅ **User Authentication** - JWT-based authentication with email verification
- ✅ **Role-Based Access Control** - User and Admin roles with proper authorization
- ✅ **Product Management** - CRUD operations with filtering, sorting, and pagination
- ✅ **Category Management** - Organize products into categories
- ✅ **Shopping Cart** - Add, update, remove items from cart
- ✅ **Wishlist** - Save favorite products
- ✅ **Orders** - Create orders with automatic calculations (tax, shipping, discounts)
- ✅ **Order Management** - Admin dashboard for order and payment status updates
- ✅ **Coupon System** - Create and manage discount coupons
- ✅ **User Reviews** - Product reviews with ratings and images
- ✅ **User Management** - Admin panel for user management and role assignment
- ✅ **Address Management** - Multiple shipping addresses per user
- ✅ **File Upload** - Multer integration for image uploads
- ✅ **Email Notifications** - Nodemailer for order confirmations and password resets
- ✅ **Advanced Filtering** - Search, filter by price, category, material, rating, etc.
- ✅ **Pagination & Sorting** - Efficient data retrieval with customizable sorting

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: Helmet, CORS

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.ts    # Environment and app config
│   │   └── multer.ts    # File upload configuration
│   ├── database/        # Database setup
│   │   ├── db.ts        # Prisma client setup
│   │   └── seed.ts      # Database seeding
│   ├── middleware/      # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── order.routes.ts
│   │   ├── cart.routes.ts
│   │   ��── wishlist.routes.ts
│   │   ├── review.routes.ts
│   │   ├── address.routes.ts
│   │   └── admin.routes.ts
│   ├── schemas/         # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   └── order.schema.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   ├── wishlist.service.ts
│   │   ├── review.service.ts
│   │   ├── user.service.ts
│   │   ├── coupon.service.ts
│   │   └── email.service.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   └── response.ts
│   └── server.ts        # Main server entry point
├── prisma/
│   └── schema.prisma    # Prisma database schema
├── package.json
├── tsconfig.json
├── .env.example         # Environment variables template
└── README.md
```

## Installation & Setup

### 1. Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or pnpm

### 2. Clone & Install Dependencies

```bash
cd backend
npm install
# or
pnpm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
DATABASE_URL=mongodb://127.0.0.1:27017/jewelryBackend

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@jewelry.com

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Setup Database

Generate Prisma client:
```bash
npm run prisma:generate
```

Run migrations:
```bash
npm run prisma:migrate
```

Seed database with sample data:
```bash
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register
**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

### Verify Email
**GET** `/auth/verify-email?token=<token>`

### Forgot Password
**POST** `/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`
```json
{
  "token": "reset_token",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

### Get Profile
**GET** `/auth/profile` (Requires Auth)

### Update Profile
**PUT** `/auth/profile` (Requires Auth)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products?page=1&limit=10&search=&categoryId=&minPrice=&maxPrice=&sortBy=createdAt&sortOrder=desc`

### Get Product by Slug
**GET** `/products/:slug`

### Get Featured Products
**GET** `/products/featured/list?limit=8`

### Create Product (Admin Only)
**POST** `/products` (Requires Auth + Admin)
```json
{
  "name": "Diamond Ring",
  "slug": "diamond-ring",
  "description": "Beautiful diamond ring",
  "price": 599.99,
  "discountPrice": 499.99,
  "categoryId": "cat_id",
  "sku": "RING-001",
  "material": "Gold",
  "weight": 5.5
}
```

### Update Product (Admin Only)
**PUT** `/products/:id` (Requires Auth + Admin)

### Delete Product (Admin Only)
**DELETE** `/products/:id` (Requires Auth + Admin)

---

## Category Endpoints

### Get All Categories
**GET** `/categories?active=true`

### Get Category by Slug
**GET** `/categories/:slug`

### Create Category (Admin Only)
**POST** `/categories` (Requires Auth + Admin)
```json
{
  "name": "Rings",
  "slug": "rings",
  "description": "Beautiful rings collection"
}
```

### Update Category (Admin Only)
**PUT** `/categories/:id` (Requires Auth + Admin)

### Delete Category (Admin Only)
**DELETE** `/categories/:id` (Requires Auth + Admin)

---

## Cart Endpoints

### Add to Cart
**POST** `/cart` (Requires Auth)
```json
{
  "productId": "prod_id",
  "quantity": 2
}
```

### Get Cart
**GET** `/cart` (Requires Auth)

### Update Cart Item Quantity
**PATCH** `/cart/:productId` (Requires Auth)
```json
{
  "quantity": 3
}
```

### Remove from Cart
**DELETE** `/cart/:productId` (Requires Auth)

### Clear Cart
**DELETE** `/cart` (Requires Auth)

---

## Wishlist Endpoints

### Add to Wishlist
**POST** `/wishlist` (Requires Auth)
```json
{
  "productId": "prod_id"
}
```

### Get Wishlist
**GET** `/wishlist` (Requires Auth)

### Check if in Wishlist
**GET** `/wishlist/:productId/check` (Requires Auth)

### Remove from Wishlist
**DELETE** `/wishlist/:productId` (Requires Auth)

---

## Order Endpoints

### Create Order
**POST** `/orders` (Requires Auth)
```json
{
  "items": [
    { "productId": "prod_id", "quantity": 2 }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "couponCode": "WELCOME10",
  "paymentMethod": "card",
  "notes": "Optional notes"
}
```

### Get My Orders
**GET** `/orders/user/my-orders?page=1&limit=10&status=&sortBy=createdAt&sortOrder=desc` (Requires Auth)

### Get Order Details
**GET** `/orders/:id` (Requires Auth)

### Get All Orders (Admin Only)
**GET** `/orders?page=1&limit=10&status=&minAmount=&maxAmount=` (Requires Auth + Admin)

### Update Order Status (Admin Only)
**PATCH** `/orders/:id/status` (Requires Auth + Admin)
```json
{
  "status": "SHIPPED"
}
```

### Update Payment Status (Admin Only)
**PATCH** `/orders/:id/payment-status` (Requires Auth + Admin)
```json
{
  "paymentStatus": "COMPLETED",
  "transactionId": "txn_123"
}
```

---

## Review Endpoints

### Create Review
**POST** `/reviews` (Requires Auth)
```json
{
  "productId": "prod_id",
  "rating": 5,
  "title": "Great product!",
  "comment": "Amazing quality"
}
```

### Get Product Reviews
**GET** `/reviews/product/:productId?page=1&limit=10`

### Get My Reviews
**GET** `/reviews/user/my-reviews?page=1&limit=10` (Requires Auth)

### Update Review
**PUT** `/reviews/:id` (Requires Auth)
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

### Delete Review
**DELETE** `/reviews/:id` (Requires Auth)

---

## Address Endpoints

### Get All Addresses
**GET** `/addresses` (Requires Auth)

### Get Address by ID
**GET** `/addresses/:id` (Requires Auth)

### Get Default Address
**GET** `/addresses/default` (Requires Auth)

### Create Address
**POST** `/addresses` (Requires Auth)
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

### Update Address
**PUT** `/addresses/:id` (Requires Auth)

### Delete Address
**DELETE** `/addresses/:id` (Requires Auth)

---

## Admin Endpoints (Requires Auth + Admin Role)

### User Management

**GET** `/admin/users?page=1&limit=10&search=&role=` - List all users
**GET** `/admin/users/:id` - Get user details
**PATCH** `/admin/users/:id/role` - Update user role
**PATCH** `/admin/users/:id/status` - Toggle user status
**DELETE** `/admin/users/:id` - Delete user
**GET** `/admin/stats/users` - Get user statistics

### Coupon Management

**GET** `/admin/coupons?active=true` - List coupons
**POST** `/admin/coupons` - Create coupon
**PUT** `/admin/coupons/:id` - Update coupon
**DELETE** `/admin/coupons/:id` - Delete coupon

---

## Default Test Credentials

After seeding, use these credentials to test:

**Admin Account:**
- Email: `admin@jewelry.com`
- Password: `Admin@123`

**Regular User:**
- Email: `user@jewelry.com`
- Password: `User@123`

---

## Error Handling

All errors return a standard error response:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "field": "validation error message"
  }
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## File Upload

Maximum file size: 5MB

Allowed file types:
- JPEG
- PNG
- GIF
- WebP
- PDF

Files are saved in `/uploads` directory and accessible via:
```
http://localhost:5000/uploads/filename
```

---

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env` file as `SMTP_PASS`

For other email providers, update `SMTP_HOST` and `SMTP_PORT` accordingly.

---

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Role-based access control
- ✅ Email verification
- ✅ Password reset with token expiry

---

## Database Schema

The Prisma schema includes the following models:
- User (with roles: USER, ADMIN)
- Product (with categories and reviews)
- Category
- Cart & CartItem
- Wishlist & WishlistItem
- Order & OrderItem
- Review
- Coupon
- Address
- Report (for analytics)
- Setting

---

## Scripts

```bash
# Development
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Run tests
npm run test
```

---

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (min 32 characters)
- Configure production MongoDB URL
- Set appropriate `CORS_ORIGIN`
- Setup production email credentials

### Database Backup
Regularly backup your MongoDB database using:
```bash
mongodump --uri="your_database_url" --out=./backup
```

---

## Support & Troubleshooting

**Port already in use:**
```bash
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process
```

**Database connection error:**
- Check MongoDB service is running
- Verify `DATABASE_URL` in `.env`
- Check firewall settings

**Email not sending:**
- Verify SMTP credentials
- Check email limits (Gmail: 500 per day)
- Check spam folder

**CORS errors:**
- Verify `CORS_ORIGIN` matches your frontend URL
- Include credentials in frontend requests

---

## License

MIT

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Version**: 1.0.0  
**Last Updated**: 2024
