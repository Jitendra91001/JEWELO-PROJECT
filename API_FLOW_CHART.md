# API Flow Chart and Step-by-Step Guide

## 1. Authentication Flow

```text
User -> Frontend Register/Login Form
  -> POST /api/v1/auth/register or /api/v1/auth/login
  -> Backend validates payload
  -> Service creates/validates user
  -> JWT token issued
  -> Frontend stores token in local storage
  -> Protected routes can now be accessed
```

### Step-by-step
1. User enters email/password/name.
2. Frontend sends request to auth endpoint.
3. Backend validates input.
4. Backend creates user or validates credentials.
5. Backend returns JWT token.
6. Frontend stores token.
7. Subsequent requests include Authorization header.

---

## 2. Product Creation Flow with Cloudinary

```text
Admin -> Frontend Product Form
  -> Fill form fields
  -> Select thumbnail image
  -> POST /api/v1/products
  -> multer reads multipart/form-data
  -> uploadBufferToCloudinary(buffer, 'jewellery/products')
  -> Cloudinary returns secure_url
  -> Backend stores URL in DB
  -> Response returns product with thumbnail URL
  -> Frontend shows product card with image
```

### Step-by-step
1. Admin opens add product form.
2. Admin enters product details.
3. Admin selects thumbnail image.
4. Frontend sends FormData to /api/v1/products.
5. Backend saves image to Cloudinary.
6. Backend stores returned secure URL.
7. Frontend receives product object and renders image.

---

## 3. Category Creation Flow with Cloudinary

```text
Admin -> Frontend Category Form
  -> Enter category details
  -> Select category image
  -> POST /api/v1/categories
  -> Backend uploads image to Cloudinary
  -> Cloudinary returns image URL
  -> URL stored in category.image
  -> Category appears on homepage/admin panel
```

### Step-by-step
1. Admin enters category name/slug/description.
2. Admin uploads image.
3. Frontend POSTs form data to /api/v1/categories.
4. Backend uploads image to Cloudinary.
5. Stored URL is saved in DB.
6. UI renders image using that URL.

---

## 4. Profile Avatar Upload Flow

```text
User -> Profile Page
  -> Click camera icon
  -> Select image file
  -> PUT /api/v1/auth/profile
  -> Backend receives avatar file
  -> uploadBufferToCloudinary(buffer, 'jewellery/avatars')
  -> Cloudinary returns secure_url
  -> User profile updated with new avatar URL
```

### Step-by-step
1. User clicks avatar upload button.
2. File picker opens.
3. Frontend sends avatar file as FormData.
4. Backend uploads it to Cloudinary.
5. Backend updates user avatar field in DB.
6. Profile page shows new avatar.

---

## 5. Review Upload Flow

```text
User -> Review Form
  -> Enter rating/comment
  -> Upload one to three images
  -> POST /api/v1/reviews
  -> Backend uploads each image to Cloudinary
  -> URLs collected in array
  -> Review saved with images array
  -> Product page displays review images
```

### Step-by-step
1. User submits a review.
2. Frontend includes images in multipart form.
3. Backend uploads each image.
4. Cloudinary returns public URLs.
5. URLs are stored in review.images.
6. Review is created and displayed.

---

## 6. Order Flow

```text
User -> Cart
  -> Checkout form
  -> POST /api/v1/orders
  -> Order created in DB
  -> Payment/Invoice flow continues
  -> Invoice PDF generated and uploaded to Cloudinary
```

### Step-by-step
1. User adds product to cart.
2. User proceeds to checkout.
3. Frontend submits order payload.
4. Backend creates order.
5. Invoice PDF is generated.
6. PDF is uploaded to Cloudinary.
7. Invoice link is available for retrieval.

---

## 7. Full End-to-End Request Lifecycle

```text
Frontend Request
  -> Axios/Fetch
  -> Backend Route Handler
  -> Validation Middleware
  -> Service Layer
  -> Prisma DB Operation
  -> Cloudinary Upload (if file present)
  -> Response to Frontend
```

### Step-by-step
1. Frontend sends request.
2. Route handles request.
3. Validation middleware checks input.
4. Service layer performs business logic.
5. Database is updated.
6. File upload goes to Cloudinary if the request includes media.
7. Frontend receives response data.

---

## 8. Common Frontend Pattern

```ts
const formData = new FormData();
formData.append("name", values.name);
formData.append("thumbnail", file);

await axios.post("/api/v1/products", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

---

## 9. Important Backend Implementation Notes

- multer uses memory storage, so files are handled in memory first.
- uploadBufferToCloudinary() uploads the buffer to Cloudinary.
- The returned secure_url is stored in DB.
- This makes image access fast and reliable.
- Frontend should always use the response URL directly.
