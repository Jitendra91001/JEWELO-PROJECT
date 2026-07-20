# Jewellery Full Stack App API Documentation

## 1. Base Information

- Base URL: http://localhost:5000
- API Version: /api/v1
- Auth: Bearer token in Authorization header
- Response format:
  - Success: { success: true, message, data }
  - Error: { success: false, message, error }

---

## 2. Authentication APIs

### 2.1 Register User
- Method: POST
- URL: /api/v1/auth/register
- Headers: Content-Type: application/json
- Payload:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "12345678",
    "phone": "+91XXXXXXXXXX"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "token": "...",
      "user": {
        "id": "...",
        "email": "john@example.com",
        "name": "John Doe",
        "role": "USER"
      }
    }
  }
  ```

### 2.2 Login User
- Method: POST
- URL: /api/v1/auth/login
- Headers: Content-Type: application/json
- Payload:
  ```json
  {
    "email": "john@example.com",
    "password": "12345678"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "...",
      "user": {
        "id": "...",
        "email": "john@example.com",
        "name": "John Doe",
        "role": "USER"
      }
    }
  }
  ```

### 2.3 Verify Email
- Method: GET
- URL: /api/v1/auth/verify-email?token=YOUR_TOKEN

### 2.4 Forgot Password
- Method: POST
- URL: /api/v1/auth/forgot-password
- Payload:
  ```json
  {
    "email": "john@example.com"
  }
  ```

### 2.5 Reset Password
- Method: POST
- URL: /api/v1/auth/reset-password
- Payload:
  ```json
  {
    "token": "...",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```

### 2.6 Get Profile
- Method: GET
- URL: /api/v1/auth/profile
- Auth Required: Yes

### 2.7 Update Profile
- Method: PUT
- URL: /api/v1/auth/profile
- Auth Required: Yes
- Form Data:
  - avatar: file (image)
  - name: string
  - email: string
  - phone: string

---

## 3. Product APIs

### 3.1 Get All Products
- Method: GET
- URL: /api/v1/products
- Query Params:
  - search
  - categoryId
  - minPrice
  - maxPrice
  - material
  - isFeatured
  - page
  - limit
  - sortBy
  - sortOrder

### 3.2 Get Featured Products
- Method: GET
- URL: /api/v1/products/featured/list

### 3.3 Get Product By Slug
- Method: GET
- URL: /api/v1/products/:slug

### 3.4 Create Product
- Method: POST
- URL: /api/v1/products
- Auth Required: Yes, Admin
- Form Data:
  - name: string
  - slug: string
  - description: string
  - price: number
  - discountPrice: number
  - cost: number
  - categoryId: string
  - sku: string
  - quantity: number
  - material: string
  - weight: number
  - isFeatured: boolean
  - isActive: boolean
  - thumbnail: file (image)

### 3.5 Update Product
- Method: PUT
- URL: /api/v1/products/:id
- Auth Required: Yes, Admin
- Form Data: same as create product

### 3.6 Delete Product
- Method: DELETE
- URL: /api/v1/products/:id
- Auth Required: Yes, Admin

---

## 4. Category APIs

### 4.1 Get Categories
- Method: GET
- URL: /api/v1/categories
- Query Params:
  - active=true/false
  - search=term

### 4.2 Get Category By Slug
- Method: GET
- URL: /api/v1/categories/:slug

### 4.3 Create Category
- Method: POST
- URL: /api/v1/categories
- Auth Required: Yes, Admin
- Form Data:
  - name: string
  - slug: string
  - description: string
  - image: file (image)

### 4.4 Update Category
- Method: PUT
- URL: /api/v1/categories/:id
- Auth Required: Yes, Admin
- Form Data: same as create category

### 4.5 Delete Category
- Method: DELETE
- URL: /api/v1/categories/:id
- Auth Required: Yes, Admin

---

## 5. Review APIs

### 5.1 Create Review
- Method: POST
- URL: /api/v1/reviews
- Auth Required: Yes
- Form Data:
  - productId: string
  - rating: number
  - title: string
  - comment: string
  - images: file[] (max 3)

### 5.2 Get Product Reviews
- Method: GET
- URL: /api/v1/reviews/product/:productId

### 5.3 Get My Reviews
- Method: GET
- URL: /api/v1/reviews/user/my-reviews
- Auth Required: Yes

### 5.4 Update Review
- Method: PUT
- URL: /api/v1/reviews/:id
- Auth Required: Yes
- Form Data: same as create review

### 5.5 Delete Review
- Method: DELETE
- URL: /api/v1/reviews/:id
- Auth Required: Yes

---

## 6. Cart APIs

### 6.1 Add to Cart
- Method: POST
- URL: /api/v1/cart
- Auth Required: Yes
- Payload:
  ```json
  {
    "productId": "...",
    "quantity": 1
  }
  ```

### 6.2 Get Cart
- Method: GET
- URL: /api/v1/cart
- Auth Required: Yes

### 6.3 Update Cart Item
- Method: PATCH
- URL: /api/v1/cart/:productId
- Auth Required: Yes
- Payload:
  ```json
  {
    "quantity": 2
  }
  ```

### 6.4 Remove from Cart
- Method: DELETE
- URL: /api/v1/cart/:productId
- Auth Required: Yes

---

## 7. Wishlist APIs

### 7.1 Add to Wishlist
- Method: POST
- URL: /api/v1/wishlist
- Auth Required: Yes
- Payload:
  ```json
  {
    "productId": "..."
  }
  ```

### 7.2 Get Wishlist
- Method: GET
- URL: /api/v1/wishlist
- Auth Required: Yes

### 7.3 Remove from Wishlist
- Method: DELETE
- URL: /api/v1/wishlist/:productId
- Auth Required: Yes

---

## 8. Order APIs

### 8.1 Create Order
- Method: POST
- URL: /api/v1/orders
- Auth Required: Yes
- Payload:
  ```json
  {
    "items": [
      { "productId": "...", "quantity": 1 }
    ],
    "shippingAddress": "...",
    "billingAddress": "...",
    "paymentMethod": "COD"
  }
  ```

### 8.2 Get My Orders
- Method: GET
- URL: /api/v1/orders/user/my-orders
- Auth Required: Yes

### 8.3 Get Order By ID
- Method: GET
- URL: /api/v1/orders/:id
- Auth Required: Yes

### 8.4 Update Order Status
- Method: PATCH
- URL: /api/v1/orders/:id/status
- Auth Required: Yes, Admin
- Payload:
  ```json
  {
    "status": "CONFIRMED"
  }
  ```

---

## 9. Payment APIs

### 9.1 Create Payment
- Method: POST
- URL: /api/v1/payment
- Payload:
  ```json
  {
    "orderId": "...",
    "amount": 1000
  }
  ```

---

## 10. Invoice APIs

### 10.1 Get Invoice By Order ID
- Method: GET
- URL: /api/v1/invoice/order/:orderId

### 10.2 Get Invoice QR
- Method: GET
- URL: /api/v1/invoice/:id/qr
- Auth Required: Yes

---

## 11. Feedback APIs

### 11.1 Get Feedbacks
- Method: GET
- URL: /api/v1/feedback

### 11.2 Create Feedback
- Method: POST
- URL: /api/v1/feedback
- Payload:
  ```json
  {
    "name": "John",
    "email": "john@example.com",
    "message": "Great service"
  }
  ```

---

## 12. Image Upload Flow (Cloudinary)

### 12.1 Flow Overview
1. Frontend selects image file in form.
2. Frontend sends multipart/form-data to backend endpoint.
3. Backend receives file through multer memory storage.
4. Backend uploads buffer to Cloudinary.
5. Cloudinary returns secure URL.
6. Backend stores that URL in database.
7. Frontend displays the URL directly.

### 12.2 Request Flow
```text
Frontend Form
  -> POST /api/v1/auth/profile or /api/v1/products or /api/v1/categories or /api/v1/reviews
  -> multer parses multipart/form-data
  -> uploadBufferToCloudinary(buffer, folder)
  -> Cloudinary returns secure_url
  -> DB stores secure_url
  -> Frontend renders image using that URL
```

### 12.3 Upload Rules
- Supported file types: image/*
- Max size: 5MB
- For reviews, max 3 images
- For avatars, categories, and products: single file

### 12.4 Example: Profile Avatar Upload
- Method: PUT
- URL: /api/v1/auth/profile
- Form Data:
  - avatar: file
  - name: John Doe
  - email: john@example.com
  - phone: +91XXXXXXXXXX

### 12.5 Example: Product Thumbnail Upload
- Method: POST
- URL: /api/v1/products
- Form Data:
  - name: Diamond Ring
  - slug: diamond-ring
  - price: 5000
  - thumbnail: file

---

## 13. Response Structure Examples

### 13.1 Success Example
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "...",
    "name": "Diamond Ring",
    "thumbnail": "https://res.cloudinary.com/..."
  }
}
```

### 13.2 Error Example
```json
{
  "success": false,
  "message": "Only images allowed"
}
```

---

## 14. Important Notes

- All file-based endpoints use multipart/form-data.
- Image URLs stored in DB are Cloudinary public URLs.
- If Cloudinary credentials are missing, the backend falls back to a base64 data URL for local development safety.
- Frontend should use the returned URL directly; no need to prepend localhost paths anymore.
