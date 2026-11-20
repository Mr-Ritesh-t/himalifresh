# Security Architecture & Best Practices Notes
## Himali Fresh E-Commerce Platform

---

## 1. Security Architecture Summary

Himali Fresh is engineered with defense-in-depth principles across client, edge, and database layers:

```
┌────────────────────────────────────────────────────────┐
│                   Edge Middleware                      │
│ - Pattern Matching: /admin/:path*, /api/admin/:path*   │
│ - Cryptographic JWT Verification (jose)                │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               Server API Validation Layer              │
│ - Strict Zod Schemas (input sanitization & regex)      │
│ - Zero-Trust Client Pricing (database recalculation)   │
│ - File Upload Constraints (MIME type & 5MB size limit) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Data Storage Layer                  │
│ - Bcrypt Password Hashing (Salt rounds: 10)            │
│ - Parameterized SQL Execution via Prisma ORM           │
│ - Transactions for Orders & Status Audit Trails        │
└────────────────────────────────────────────────────────┘
```

---

## 2. Key Security Mechanisms

### 2.1 Zero-Trust Price & Inventory Architecture
- Prices submitted in the client cart are **never trusted**.
- During checkout (`POST /api/orders`), product IDs are looked up directly from the database.
- Current active prices and inventory availability are verified before calculating the final total.
- Submissions requesting out-of-stock items or tampered zero/negative quantities are immediately rejected with a 400 Bad Request.

### 2.2 Secure Admin Authentication & Sessions
- **Password Protection:** Plain-text passwords are never stored. Bcrypt (cost factor 10) is used for hashing.
- **JWT Cookies:** Session tokens are signed using HMAC SHA-256 with the server's private `JWT_SECRET`.
- **Cookie Security Flags:**
  - `httpOnly: true`: Prevents client-side JavaScript (XSS attacks) from reading the authentication token.
  - `sameSite: "lax"`: Protects against Cross-Site Request Forgery (CSRF).
  - `secure: true`: Enforced in production environments so cookies are transmitted only over encrypted HTTPS connections.
  - `path: "/"`: Scoped cleanly across the admin domain.

### 2.3 Upload Security & Anti-Malware Protection
- Upload endpoint (`/api/admin/uploads`) is restricted to authenticated administrators.
- Whitelist validation for MIME types: `image/jpeg`, `image/png`, `image/webp`, and `image/svg+xml`. Executable extensions (`.exe`, `.php`, `.js`, `.sh`) are strictly blocked.
- Size enforcement: Maximum upload size is strictly capped at 5 MB.
- Filenames are sanitized, stripping non-alphanumeric characters, and assigned a collision-resistant timestamp.

### 2.4 SQL Injection & XSS Defenses
- All database interactions use Prisma ORM's strongly typed, parameterized query engine, preventing SQL injection vulnerabilities.
- React's JSX architecture automatically escapes HTML entities, neutralizing Cross-Site Scripting (XSS).
