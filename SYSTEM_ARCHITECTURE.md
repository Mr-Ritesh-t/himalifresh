# System Architecture Document
## Himali Fresh E-Commerce Platform

---

## 1. High-Level Architecture Overview

Himali Fresh follows a modern, full-stack, decoupled architecture built on **Next.js 15 App Router** and **React 19**, powered by a robust server-side data layer with **Prisma ORM**.

```
[ Client Browsers (Mobile & Desktop) ]
                │
                ▼
  ┌─────────────────────────────────────────────────────┐
  │              Next.js 15 App Router                  │
  │  ┌────────────────────────┐┌─────────────────────┐  │
  │  │   Edge Middleware      ││  Server Components  │  │
  │  │ (Auth Guard & Routing) ││(SSR Public Catalog) │  │
  │  └───────────┬────────────┘└──────────┬──────────┘  │
  │              │                        │             │
  │              ▼                        ▼             │
  │  ┌───────────────────────────────────────────────┐  │
  │  │          API Route Handlers (REST)            │  │
  │  │  - Zod Request Validation                     │  │
  │  │  - Server-Side Price & Stock Verification     │  │
  │  │  - JWT Cookie Session Management              │  │
  │  │  - File Upload Handler (public/uploads)       │  │
  │  └───────────────────────┬───────────────────────┘  │
  └──────────────────────────┼──────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────┐
  │               Prisma Data Layer                     │
  │  - Transactions (Orders & Order Items)              │
  │  - Decimal/Float Precision Accounting               │
  │  - Model Relationships & Cascades                   │
  └──────────────────────────┬──────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────┐
  │        Database (SQLite Dev / PostgreSQL Prod)       │
  └─────────────────────────────────────────────────────┘
```

---

## 2. Component Separation & Layering

### 2.1 Presentation Layer (`src/components/`, `src/app/`)
- **Server Components:** Default execution mode for public pages (`/`, `/shop`, `/about`, `/product/[slug]`). Ensures rapid HTML delivery, optimized SEO meta tags, and reduced client JavaScript payload.
- **Client Components (`'use client'`):** Restricted to components requiring user interaction:
  - `Header.tsx`: Search inputs, mobile drawer toggles, live cart count.
  - `CartContext.tsx`: Local storage persistence and client cart operations.
  - `ProductDetailsClient.tsx`: Quantity controls and direct WhatsApp link triggers.
  - `ProductCard.tsx`: Hover transitions and cart addition buttons.
  - Admin management views: Interactive CRUD tables, modal dialogs, and uploaders.

### 2.2 Security & Middleware Layer (`src/middleware.ts`, `src/lib/auth.ts`)
- Edge middleware intercepts all incoming requests matching `/admin/:path*` and `/api/admin/:path*`.
- Unauthenticated requests to admin UI routes are redirected to `/admin/login`.
- Unauthenticated requests to admin APIs receive an immediate `401 Unauthorized` JSON response.
- Sessions are maintained using signed JWT tokens stored in `httpOnly`, `sameSite: lax` cookies.

### 2.3 Business Logic & Data Layer (`src/lib/`, `src/app/api/`)
- **Price Integrity:** Order submission recalculates product unit prices directly from the database; client-supplied prices are strictly ignored.
- **Transactions:** Order creation and order items insertion are executed inside atomic Prisma database transactions (`prisma.$transaction`).
- **File Uploads:** Validates file size (≤ 5MB) and MIME types (`image/jpeg`, `image/png`, `image/webp`), sanitizes filenames, and stores files in `public/uploads/`.
