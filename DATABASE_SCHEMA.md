# Database Schema Documentation
## Himali Fresh E-Commerce Platform

---

## 1. Schema Overview

The database is managed via **Prisma ORM**, supporting SQLite for rapid, zero-dependency local development and testing, and PostgreSQL for commercial cloud production.

---

## 2. Entity-Relationship Data Models

### 2.1 `AdminUser`
Stores authenticated administrative accounts. Public registration is permanently disabled.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique user UUID |
| `name` | String | | Administrator name |
| `email` | String | `@unique` | Admin login email |
| `passwordHash` | String | | Bcrypt password hash (cost 10) |
| `role` | String | `@default("ADMIN")` | Role: `ADMIN` or `SUPER_ADMIN` |
| `createdAt` | DateTime | `@default(now())` | Account creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last update timestamp |

### 2.2 `Category`
Product catalogue groupings.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique category UUID |
| `name` | String | | Category display name |
| `slug` | String | `@unique` | URL slug (e.g. `pickles-traditional-foods`) |
| `description`| String? | | Optional descriptive text |
| `imageUrl` | String? | | Category representative photograph |
| `displayOrder`| Int | `@default(0)` | Sort order in navigation |
| `isActive` | Boolean | `@default(true)` | Active status flag |
| `createdAt` | DateTime | `@default(now())` | Timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp |

### 2.3 `Product`
Master catalogue items.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique product UUID |
| `name` | String | | Product name (e.g. Bamboo Shoot Pickle) |
| `slug` | String | `@unique` | SEO URL slug |
| `description`| String | | Detailed product description |
| `price` | Float | | Unit price in INR (paise precision) |
| `weight` | String | | Weight or volume (e.g. `400 g`, `1 kg`) |
| `mainImageUrl`| String | | Primary photograph URL |
| `categoryId` | String | `@relation` | Foreign key to `Category` |
| `isAvailable` | Boolean | `@default(true)` | In-stock inventory toggle |
| `isFeatured` | Boolean | `@default(false)`| Featured on homepage toggle |
| `isActive` | Boolean | `@default(true)` | Catalogue active flag |
| `createdAt` | DateTime | `@default(now())` | Timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp |

### 2.4 `Order`
Customer order enquiry records.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique order UUID |
| `orderNumber` | String | `@unique` | Human-friendly reference (e.g. `HF-20261120-1001`) |
| `customerName`| String | | Customer full name |
| `phone` | String | | Contact phone number |
| `address` | String | | Street address |
| `city` | String | | City or town |
| `pincode` | String | | 6-digit postal PIN code |
| `landmark` | String? | | Optional landmark |
| `instructions`| String? | | Optional customer delivery instructions |
| `totalAmount` | Float | | Recalculated total amount in INR |
| `status` | String | `@default("NEW")` | `NEW`, `CONTACTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED` |
| `createdAt` | DateTime | `@default(now())` | Timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp |

### 2.5 `OrderItem`
Snapshot of items at the moment of enquiry submission.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique item UUID |
| `orderId` | String | `@relation` | Foreign key to `Order` |
| `productId` | String? | `@relation` | Foreign key to `Product` (onDelete: SetNull) |
| `productNameSnapshot`| String | | Name at time of order |
| `unitPriceSnapshot` | Float | | Unit price at time of order |
| `quantity` | Int | | Quantity requested |
| `subtotal` | Float | | Calculated subtotal |
| `weightSnapshot` | String? | | Weight specification snapshot |
| `createdAt` | DateTime | `@default(now())` | Timestamp |

### 2.6 `BusinessSettings`
Global configuration editable by the business owner.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default("default-settings")` | Singleton record ID |
| `businessName`| String | | "Himali Fresh" |
| `tagline` | String | | "The Spirit of Himalayas" |
| `phone` | String | | "+91 98320 78728" |
| `whatsappNumber` | String | | "919832078728" |
| `email` | String | | "info@himalifresh.com" |
| `address` | String | | "Dagapur, Siliguri, West Bengal, India" |
| `mapUrl` | String | | Google Maps location URL |
| `announcement` | String | | Top banner announcement |
| `homepageHeading` | String | | Main hero heading |
| `homepageDescription` | String | | Main hero subtitle |
| `aboutStory` | String | | Brand heritage story |
| `updatedAt` | DateTime | `@updatedAt` | Last modification timestamp |

### 2.7 `OrderStatusHistory`
Audit tracking of status transitions.
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique audit record UUID |
| `orderId` | String | `@relation` | Foreign key to `Order` |
| `previousStatus`| String | | Previous order status |
| `newStatus` | String | | Updated order status |
| `changedBy` | String | | User or system actor |
| `notes` | String? | | Optional audit remarks |
| `createdAt` | DateTime | `@default(now())` | Audit timestamp |
