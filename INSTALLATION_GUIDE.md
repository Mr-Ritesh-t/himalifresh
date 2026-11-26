# Installation & Setup Guide
## Himali Fresh E-Commerce Platform

---

## 1. Prerequisites

Before installing the application, ensure the following runtime environments are installed on your machine:
- **Node.js:** v18.17.0+ or v20.x+ (Recommended: Node.js 20 LTS or v24)
- **Package Manager:** `npm` (v9+), `pnpm`, or `yarn`
- **Git:** Installed and available on your PATH

---

## 2. Step-by-Step Installation

### Step 1: Clone or Navigate to the Project Directory
```bash
cd d:/coding/himalifresh1
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Verify the contents of `.env`:
```env
# Database Connection (SQLite by default for zero-config local development)
DATABASE_URL="file:./dev.db"

# Admin JWT Secret (Replace with a strong random 32-byte secret)
JWT_SECRET="himali_fresh_super_secure_jwt_secret_key_2026_change_in_production"

# Store Configuration Defaults
NEXT_PUBLIC_BUSINESS_PHONE="+91 98320 78728"
NEXT_PUBLIC_WHATSAPP_NUMBER="919832078728"
NEXT_PUBLIC_BUSINESS_EMAIL="info@himalifresh.com"
NEXT_PUBLIC_BUSINESS_NAME="Himali Fresh"
NEXT_PUBLIC_BUSINESS_TAGLINE="The Spirit of Himalayas"
NEXT_PUBLIC_BUSINESS_ADDRESS="Dagapur, Siliguri, West Bengal, India"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Initialize Database & Seed Catalogue
Run Prisma database sync and the database seeder:
```bash
# Push schema to SQLite database (creates dev.db)
npx prisma db push

# Seed initial admin user, store settings, categories, and products
node prisma/seed.js
```

### Step 5: Run Automated Tests
```bash
npm test
```
All unit tests should pass with 100% success rate.

### Step 6: Start Local Development Server
```bash
npm run dev
```

The application is now running at:
- **Public Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

**Administrator Access:**
Access the administrator portal at `/admin/login`. Master administrator credentials are provisioned during database initialization or by an existing Super Administrator. Keep administrator credentials confidential.
