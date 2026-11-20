# Requirements Specification Document
## Himali Fresh E-Commerce Application

---

## 1. Executive Summary

Himali Fresh is an authentic regional food brand situated in Dagapur, Siliguri, West Bengal, India. The brand specializes in high-quality mountain culinary staples, hand-crafted pickles, wild-harvested spices, organic flours, fermented goods, and artisan local products sourced directly from Darjeeling, Kalimpong, Sikkim, and the Himalayan foothills.

This document specifies the functional, non-functional, security, and interface requirements for the Himali Fresh web platform.

---

## 2. Business Objectives & Ordering Model

1. **Brand Visibility:** Showcase genuine Himalayan food culture, ethical sourcing, and traditional methods.
2. **Interactive Catalogue:** Enable customers across India to discover rare hill foods (e.g., Dalle Khursani pickles, Tama bamboo shoots, wild Timur, Chhurpi yak cheese, and organic red rice).
3. **Frictionless WhatsApp Ordering:** Eliminate complex payment gateways for the initial release in favor of direct WhatsApp order enquiries. The customer receives a clear summary, while the owner confirms batch availability, pin-code delivery charges, and personal payment instructions.
4. **Autonomous Store Management:** Provide the owner with a secure administrative dashboard to edit prices, manage inventory availability, create products/categories, upload photographs, review incoming enquiries, and update business contact details.

---

## 3. Functional Requirements

### 3.1 Public Customer Journey
- **FR-01 (Homepage):** Display official logo, top announcement bar with phone/email, panoramic hero banner, trust badges, category grid, featured products, brand story, why choose us, and WhatsApp CTA.
- **FR-02 (Catalogue Browsing):** List all active products at `/shop` with category sidebar filtering, price range filter, availability filter, debounced search, and sorting (price low-to-high, high-to-low, name A-Z, newest).
- **FR-03 (Category Filter Pages):** Dynamic `/shop/[category]` routes with category descriptions, counts, and product cards.
- **FR-04 (Product Details):** Product page at `/product/[slug]` with image gallery, description, weight specifications, availability badge, quantity adjustment, add-to-cart with toast confirmation, and direct WhatsApp enquiry.
- **FR-05 (Shopping Cart):** Client-persisted shopping cart (`/cart`) with quantity adjustment, item removal, cart clearing, subtotal computation, and continue-shopping links.
- **FR-06 (Checkout & Server Validation):** Customer delivery form (`/checkout`) collecting name, phone, address, city, pincode, landmark, and instructions.
- **FR-07 (Server Price Calculation):** Backend recalculation of all prices and availability from the database upon checkout, preventing client-side price manipulation.
- **FR-08 (Order Number Generation):** Creation of unique order identifiers in format `HF-YYYYMMDD-XXXX`.
- **FR-09 (WhatsApp Generation):** Automated formatting and URL encoding of the order enquiry payload to prefill the business WhatsApp conversation.
- **FR-10 (Order Success):** Confirmation page (`/order-success`) with order reference, copy-to-clipboard button, instructions, and fallback WhatsApp click button.
- **FR-11 (Contact & About):** Information routes (`/about`, `/contact`, `/privacy-policy`, `/terms`) with Google Map embed and server-validated contact enquiry form.

### 3.2 Owner / Administrative Panel
- **FR-12 (Secure Login):** Protected login at `/admin/login` using hashed credentials and secure HTTP-only JWT cookies.
- **FR-13 (Admin Dashboard):** Real-time database metrics at `/admin` (total products, active products, out-of-stock count, category count, new order count, confirmed order count, recent order table).
- **FR-14 (Product Management):** Table at `/admin/products` with search, category filtering, availability toggle, featured toggle, edit link, and safe archive/delete.
- **FR-15 (Product Creation/Editing):** Multi-field forms (`/admin/products/new`, `/admin/products/[id]/edit`) with automated slugification, image uploads, category assignment, and price validation.
- **FR-16 (Category Management):** CRUD interface at `/admin/categories` with image upload and protection against deleting categories containing active products.
- **FR-17 (Order Enquiry Management):** List at `/admin/orders` with status filters (NEW, CONTACTED, CONFIRMED, COMPLETED, CANCELLED).
- **FR-18 (Order Detail & Audit):** Detail screen at `/admin/orders/[id]` displaying customer data, ordered item snapshots with historic unit prices, status changer, and audit history logs.
- **FR-19 (Business Settings):** Editable configuration at `/admin/settings` updating business name, phone, WhatsApp number, email, address, announcement bar, and hero content.
- **FR-20 (Admin Profile):** Screen at `/admin/profile` displaying account details and enabling secure password updates with current password verification.

---

## 4. Non-Functional Requirements

- **Performance:** Sub-1-second first contentful paint on standard 4G networks; responsive Next.js Server-Side Rendering.
- **Security:** Password hashing with bcrypt (cost factor 10), cryptographically signed JWT cookies, edge route protection, Zod request validation, and MIME-type/size upload checks (max 5MB).
- **Data Integrity:** Historical price and item snapshots preserved in `OrderItem` records; database transactions for order creation and status history.
- **Responsive Compatibility:** Seamless layout across mobile (360px), tablet (768px), and desktop (1024px-1440px) without horizontal scrolling.
