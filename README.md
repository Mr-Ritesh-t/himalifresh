# Himali Fresh — The Spirit of Himalayas

> A production-grade, full-stack e-commerce web application for **Himali Fresh**, authentic purveyors of Himalayan regional foods, pickles, mountain spices, teas, and indigenous farm produce located in Dagapur, Siliguri, West Bengal, India.

---

## 🏔️ Brand & Platform Overview

- **Brand:** Himali Fresh
- **Tagline:** The Spirit of Himalayas
- **Headquarters:** Dagapur, Siliguri, West Bengal, India
- **Contact:** +91 98320 78728 | info@himalifresh.com
- **Ordering Model:** Direct WhatsApp-confirmed order enquiry system. The platform allows customers to browse authentic categories, filter products, manage a persistent shopping cart, and submit verified order enquiries that seamlessly format a prefilled WhatsApp dialogue with the business owner.
- **Admin Management:** Secure portal for full product catalogue management, real-time stock toggles, category organization, order enquiry tracking with status audit history, and live editable business settings.

---

## 🚀 Key Highlights & Architectural Features

- **Next.js 15 App Router & React 19:** Server Components by default with client components for interactive cart, filters, and admin forms.
- **Official Brand Design System:** Incorporates the official circular golden crest logo, Himalayan panoramic banner, and custom colour palette (`#064B32` Forest Green, `#0B6B43` Secondary Green, `#E9BE54` Himalayan Gold, `#FAF8F0` Warm Cream).
- **Zero-Trust Pricing Architecture:** Client cart prices are never trusted. All totals, item availability, and prices are recalculated strictly on the server against the database.
- **Database & Prisma ORM:** Clean database models supporting SQLite (zero-config local dev & tests) and PostgreSQL (for production).
- **Secure Admin Authentication:** Cryptographically signed JWT tokens stored in `httpOnly`, `sameSite: lax`, `secure` cookies with bcrypt password hashing.
- **Responsive Mobile-First UX:** Tailored for 360px up to 1440px displays, including a dedicated mobile bottom navigation bar and sticky header.
- **Built-in Test Suite:** Vitest unit test suite covering utilities, WhatsApp payload formatting, input validation, anti-tampering guards, and JWT auth.

---

## 📂 Project Structure

```
himalifresh1/
├── prisma/
│   ├── schema.prisma          # Database schema (Models: AdminUser, Category, Product, Order, OrderItem, BusinessSettings, etc.)
│   └── seed.js                # Database seed script for initial admin, settings, categories & products
├── public/
│   ├── images/                # Official logo, hero banner, category & product photography
│   └── uploads/               # Dynamic admin upload directory
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes: /, /shop, /shop/[category], /product/[slug], /cart, /checkout, /order-success, /about, /contact, etc.
│   │   ├── admin/             # Protected admin routes: /admin, /admin/products, /admin/categories, /admin/orders, /admin/settings, /admin/profile
│   │   ├── api/               # Next.js Route Handlers (Public & Admin REST endpoints)
│   │   ├── globals.css        # Tailwind directives and custom scrollbars
│   │   └── layout.tsx         # Root layout with CartProvider, Sonner Toaster, and Google fonts
│   ├── components/
│   │   ├── layout/            # Header, Footer, MobileNav
│   │   ├── ui/                # ProductCard, CategoryCard, TrustBadges
│   │   ├── product/           # Interactive ProductDetailsClient
│   │   └── admin/             # AdminSidebar
│   ├── context/
│   │   └── CartContext.tsx    # Persistent client cart with localStorage sync
│   ├── lib/
│   │   ├── prisma.ts          # Global PrismaClient singleton
│   │   ├── auth.ts            # Password hashing, JWT signing & session validation
│   │   ├── utils.ts           # formatPrice, slugify, generateOrderNumber
│   │   ├── validations.ts     # Zod schemas for order, product, category, settings
│   │   └── whatsapp.ts        # Formatted WhatsApp message generator
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces and domain types
│   └── middleware.ts          # Edge authentication guard for /admin and /api/admin
├── tests/
│   └── business-logic.test.ts # Vitest test suite
├── vitest.config.ts           # Vitest configuration
├── tailwind.config.ts         # Himali Fresh design tokens
└── next.config.ts             # Next.js configuration
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Push schema to database & seed initial catalogue
npx prisma db push
node prisma/seed.js

# 3. Run test suite
npm test

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the owner admin console.

**Default Admin Credentials:**
- Email: `admin@himalifresh.com`
- Password: `HimaliFresh@2026!`
