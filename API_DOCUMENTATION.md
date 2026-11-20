# REST API Documentation
## Himali Fresh E-Commerce Platform

---

## 1. Public API Endpoints

### `GET /api/products`
Retrieves products from the active catalogue with optional filtering and pagination.
- **Query Parameters:**
  - `q` (string): Search query matching product name or description.
  - `category` (string): Category slug.
  - `minPrice` (number): Minimum price threshold in INR.
  - `maxPrice` (number): Maximum price threshold in INR.
  - `available` (boolean): Filter for in-stock products (`true`).
  - `sort` (string): `newest`, `price-low`, `price-high`, `name-asc`, `name-desc`.
  - `page` (number): Page number (default: `1`).
  - `limit` (number): Items per page (default: `12`).
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalCount": 16,
      "totalPages": 2
    }
  }
  ```

### `GET /api/products/[slug]`
Returns complete product information by its slug, including category details and related category products.
- **Response `200 OK`:** `{ "success": true, "product": {...}, "relatedProducts": [...] }`
- **Response `404 Not Found`:** `{ "success": false, "error": "Product not found" }`

### `GET /api/categories`
Lists all active categories with product counts.
- **Response `200 OK`:** `{ "success": true, "categories": [...] }`

### `GET /api/categories/[slug]`
Retrieves category details and its associated products.
- **Response `200 OK`:** `{ "success": true, "category": {...}, "products": [...] }`

### `GET /api/settings`
Returns live public business settings (phone, WhatsApp number, announcement, etc.).
- **Response `200 OK`:** `{ "success": true, "settings": {...} }`

### `POST /api/orders`
Submits a customer order enquiry. Recalculates all product prices from the database, creates order records in a transaction, and returns the prefilled WhatsApp URL.
- **Request Body:**
  ```json
  {
    "customerName": "Pema Bhutia",
    "phone": "9832078728",
    "address": "Dagapur, Hill Cart Road",
    "city": "Siliguri",
    "pincode": "734003",
    "landmark": "Near Bridge",
    "instructions": "Call before arrival",
    "items": [
      { "productId": "prod-uuid", "quantity": 2 }
    ]
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "order": {
      "id": "uuid",
      "orderNumber": "HF-20261120-1001",
      "totalAmount": 640,
      "customerName": "Pema Bhutia",
      "createdAt": "2026-11-20T18:30:00Z"
    },
    "whatsappUrl": "https://wa.me/919832078728?text=...",
    "whatsappNumber": "919832078728"
  }
  ```

### `POST /api/contact`
Receives customer contact enquiries.
- **Request Body:** `{ "name": "...", "email": "...", "phone": "...", "subject": "...", "message": "..." }`
- **Response `200 OK`:** `{ "success": true, "message": "Your message has been sent successfully." }`

---

## 2. Admin API Endpoints (Protected by JWT Session)

### `POST /api/admin/auth/login`
Authenticates administrator credentials and sets an `httpOnly` cookie.
- **Request Body:** `{ "email": "admin@himalifresh.com", "password": "..." }`
- **Response `200 OK`:** Sets `himali_admin_token` cookie.

### `POST /api/admin/auth/logout`
Clears session cookies.

### `GET /api/admin/dashboard`
Returns live calculated catalogue and order statistics.
- **Response `200 OK`:** `{ "success": true, "stats": { "totalProducts": 16, "newOrders": 2, ... } }`

### `GET, POST /api/admin/products`
Lists products or creates a new product with validated slug, category, price, and image URL.

### `GET, PATCH, DELETE /api/admin/products/[id]`
Inspects, edits, or archives an individual product.

### `GET, POST /api/admin/categories` & `PATCH, DELETE /api/admin/categories/[id]`
Category management endpoints with product dependency protection.

### `GET /api/admin/orders` & `GET, PATCH /api/admin/orders/[id]`
Order enquiry management, status transitions (`NEW` → `CONTACTED` → `CONFIRMED` → `COMPLETED`), and audit history logging.

### `GET, PATCH /api/admin/settings`
Updates live store settings, announcement text, and contact information.

### `POST /api/admin/uploads`
Multipart image file upload endpoint with MIME and size validation (max 5MB).
