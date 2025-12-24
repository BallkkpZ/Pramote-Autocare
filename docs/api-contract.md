# AutoCare Parts Store - API Contract

This document defines the REST API contract that the frontend expects from the backend.

## Base URL

All endpoints are relative to: `{VITE_API_BASE_URL}`

Example: `https://api.autocare.com`

## Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Common Response Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `204 No Content`: Success with no response body
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### POST /auth/login

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### GET /auth/me

Get current user profile (requires auth).

**Response (200):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

## Product Endpoints

### GET /products

Get product list with optional filters.

**Query Parameters:**
- `search` (string): Search in name, description, SKU
- `category` (string): Comma-separated categories
- `brand` (string): Comma-separated brands
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `inStock` (boolean): Only in-stock items
- `carBrand` (string): Filter by car brand
- `carModel` (string): Filter by car model
- `year` (number): Filter by year
- `sort` (string): Sort by `featured`, `price_asc`, `price_desc`, `newest`

**Response (200):**
```json
[
  {
    "id": "prod-uuid",
    "slug": "engine-oil-5w30-4l",
    "sku": "OIL-530-4L",
    "name": "น้ำมันเครื่องสังเคราะห์ 5W-30 (4L)",
    "description": "น้ำมันเครื่องสังเคราะห์แท้ 100%...",
    "price": 1290,
    "compareAtPrice": 1500,
    "stock": 25,
    "category": "Oil",
    "brand": "AutoCare",
    "images": [
      {
        "id": "img-uuid",
        "url": "https://cdn.autocare.com/products/oil.jpg",
        "alt": "Engine Oil",
        "isPrimary": true
      }
    ],
    "compatibility": [
      {
        "carBrand": "Toyota",
        "carModel": "Altis",
        "yearFrom": 2014,
        "yearTo": 2018
      }
    ],
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-15T12:00:00Z"
  }
]
```

### GET /products/:slug

Get single product by slug.

**Response (200):**
```json
{
  "id": "prod-uuid",
  "slug": "engine-oil-5w30-4l",
  "sku": "OIL-530-4L",
  "name": "น้ำมันเครื่องสังเคราะห์ 5W-30 (4L)",
  "description": "น้ำมันเครื่องสังเคราะห์แท้ 100%...",
  "price": 1290,
  "stock": 25,
  "category": "Oil",
  "brand": "AutoCare",
  "images": [...],
  "compatibility": [...],
  "createdAt": "2025-01-10T08:00:00Z",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

---

## Cart Endpoints

### GET /cart

Get current user's cart (requires auth).

**Response (200):**
```json
{
  "items": [
    {
      "productId": "prod-uuid",
      "slug": "engine-oil-5w30-4l",
      "name": "น้ำมันเครื่อง 5W-30",
      "price": 1290,
      "image": "https://cdn.autocare.com/products/oil.jpg",
      "quantity": 2,
      "stockQty": 25
    }
  ],
  "subtotal": 2580,
  "shippingFee": 0,
  "total": 2580
}
```

### POST /cart/items

Add item to cart (requires auth).

**Request:**
```json
{
  "productId": "prod-uuid",
  "slug": "engine-oil-5w30-4l",
  "name": "น้ำมันเครื่อง 5W-30",
  "price": 1290,
  "image": "https://cdn.autocare.com/products/oil.jpg",
  "quantity": 1,
  "stockQty": 25
}
```

**Response (200):** Same as GET /cart

### PATCH /cart/items/:productId

Update item quantity (requires auth).

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):** Same as GET /cart

### DELETE /cart/items/:productId

Remove item from cart (requires auth).

**Response (200):** Same as GET /cart

### POST /cart/merge

Merge guest cart into user cart on login (requires auth).

**Request:**
```json
{
  "items": [
    {
      "productId": "prod-uuid",
      "slug": "engine-oil-5w30-4l",
      "name": "น้ำมันเครื่อง 5W-30",
      "price": 1290,
      "image": "https://cdn.autocare.com/products/oil.jpg",
      "quantity": 1,
      "stockQty": 25
    }
  ]
}
```

**Response (200):** Same as GET /cart

---

## Checkout & Order Endpoints

### POST /checkout

Create an order (requires auth).

**Request:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "0812345678",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "district": "Bang Rak",
    "province": "Bangkok",
    "postalCode": "10500"
  },
  "paymentMethod": "qr"
}
```

**Response (201):**
```json
{
  "id": "order-uuid",
  "orderNumber": "ORD-1736934000123",
  "userId": "user-uuid",
  "items": [
    {
      "productId": "prod-uuid",
      "slug": "engine-oil-5w30-4l",
      "name": "น้ำมันเครื่อง 5W-30",
      "price": 1290,
      "quantity": 2,
      "image": "https://cdn.autocare.com/products/oil.jpg"
    }
  ],
  "subtotal": 2580,
  "shippingFee": 0,
  "total": 2580,
  "shippingAddress": { ... },
  "paymentMethod": "qr",
  "status": "pending",
  "createdAt": "2025-01-15T14:30:00Z",
  "updatedAt": "2025-01-15T14:30:00Z"
}
```

### GET /orders

Get user's order history (requires auth).

**Response (200):**
```json
[
  {
    "id": "order-uuid",
    "orderNumber": "ORD-1736934000123",
    "userId": "user-uuid",
    "items": [...],
    "subtotal": 2580,
    "shippingFee": 0,
    "total": 2580,
    "shippingAddress": { ... },
    "paymentMethod": "qr",
    "status": "shipped",
    "createdAt": "2025-01-15T14:30:00Z",
    "updatedAt": "2025-01-16T10:00:00Z"
  }
]
```

### GET /orders/:id

Get single order details (requires auth, own orders only).

**Response (200):** Same structure as order object above.

### POST /track-order

Track order by order number + email (public).

**Request:**
```json
{
  "orderNumber": "ORD-1736934000123",
  "email": "user@example.com"
}
```

**Response (200):** Same structure as order object above.

---

## Admin Endpoints

All admin endpoints require authentication with `role: "ADMIN"`.

### GET /admin/products

Get all products (admin only).

**Response (200):** Same as GET /products

### POST /admin/products

Create a new product (admin only).

**Request:**
```json
{
  "slug": "new-product",
  "sku": "NEW-001",
  "name": "New Product",
  "description": "Description here",
  "price": 999,
  "stock": 50,
  "category": "Oil",
  "brand": "AutoCare",
  "images": [
    {
      "url": "https://cdn.autocare.com/products/new.jpg",
      "alt": "New Product",
      "isPrimary": true
    }
  ],
  "compatibility": []
}
```

**Response (201):** Created product object.

### PATCH /admin/products/:id

Update a product (admin only).

**Request:**
```json
{
  "price": 1099,
  "stock": 45
}
```

**Response (200):** Updated product object.

### DELETE /admin/products/:id

Delete a product (admin only).

**Response (204):** No content.

### GET /admin/orders

Get all orders (admin only).

**Response (200):** Same as GET /orders but includes all users.

### PATCH /admin/orders/:id

Update order status (admin only).

**Request:**
```json
{
  "status": "shipped"
}
```

**Possible status values:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Response (200):** Updated order object.

---

## Inquiry Endpoints

### POST /inquiries

Submit a contact form inquiry (public).

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about product",
  "message": "I have a question..."
}
```

**Response (201):**
```json
{
  "id": "inquiry-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about product",
  "message": "I have a question...",
  "status": "new",
  "createdAt": "2025-01-15T16:00:00Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

**Example 400 Bad Request:**
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": {
      "email": "Invalid email format",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

**Example 401 Unauthorized:**
```json
{
  "message": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

**Example 404 Not Found:**
```json
{
  "message": "Product not found",
  "code": "NOT_FOUND"
}
```

---

## Notes for Backend Implementation

1. **Authentication**: Use JWT tokens with reasonable expiry (e.g., 7 days)
2. **Cart Merge**: Deduplicate by `productId`, sum quantities, cap at `stockQty`
3. **Stock Management**: Decrement stock on order creation
4. **Order Numbers**: Generate unique, sequential order numbers (e.g., `ORD-{timestamp}`)
5. **Validation**: Validate all inputs server-side (don't trust frontend)
6. **Images**: Host on CDN, return full URLs
7. **Pagination**: Consider adding pagination for large result sets (optional)
8. **Rate Limiting**: Implement rate limiting on all endpoints
9. **CORS**: Configure CORS to allow frontend domain

## Testing

Use the frontend in mock mode (`VITE_USE_MOCK=true`) to understand expected behavior before implementing the backend.
