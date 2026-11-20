# Production Deployment Guide
## Himali Fresh E-Commerce Platform

---

## 1. Recommended Hosting Environments

To deploy Himali Fresh for commercial production use, select an infrastructure stack that supports:
- Next.js 15 Server-Side Rendering (Node.js runtime)
- Managed PostgreSQL database with connection pooling
- Persistent file storage or S3/Cloudinary/R2 object storage for uploads
- Automated HTTPS (SSL/TLS) certificate provisioning

### Recommended Production Providers:
1. **Frontend & App Server:** Vercel, Render, Railway, AWS ECS, or DigitalOcean App Platform.
2. **Database:** Supabase, Neon.tech, AWS RDS PostgreSQL, or Railway PostgreSQL.
3. **Storage:** Cloudflare R2, AWS S3, or Supabase Storage for high-volume image assets.

---

## 2. Preparing PostgreSQL Database for Production

In `prisma/schema.prisma`, update the datasource provider for PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

In your production hosting environment, set `DATABASE_URL`:
```
DATABASE_URL="postgresql://himali_user:STRONG_PASSWORD@db-host.com:5432/himali_prod?sslmode=require"
```

Run database migration on production:
```bash
npx prisma db push
node prisma/seed.js
```

---

## 3. Environment Variables Configuration

Set the following environment variables in your production environment settings:
| Variable | Production Value / Description |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 64-character random string (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL` | `https://www.himalifresh.com` |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+91 98320 78728` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919832078728` |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | `info@himalifresh.com` |

---

## 4. Production Build & Smoke Test Verification

Execute the production build:
```bash
npm run build
npm run start
```

### Verification Checklist:
- [x] Homepage loads with official logo and panoramic Himalayan hero banner.
- [x] Product categories link correctly to `/shop/[category]`.
- [x] Search bar filters products by title and description.
- [x] Add to cart persists across browser reloads.
- [x] Checkout calculates exact price totals on the server and generates a valid WhatsApp link.
- [x] `/admin/login` rejects unauthorized attempts and issues secure session cookies for valid credentials.
- [x] Password changes require valid current passwords.
