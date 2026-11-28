# Admin User Guide
## Himali Fresh E-Commerce Platform

---

## 1. Accessing the Admin Portal

- Navigate to [https://himalifresh.com/admin](https://himalifresh.com/admin) or [http://localhost:3000/admin](http://localhost:3000/admin).
- Enter your administrator email and master password.
- Click **Log In Securely**.

---

## 2. Managing Products (`/admin/products`)

### Adding a New Product:
1. Click **Create New Product** in the top right corner.
2. Enter the Product Name (e.g. *Organic Black Cardamom*). The system will automatically generate an SEO-friendly URL slug.
3. Select the appropriate Category from the dropdown.
4. Enter the Unit Price in Indian Rupees (₹) and the net weight (e.g. *250 g* or *1 kg*).
5. Add a detailed product description covering origin, flavor notes, and usage.
6. Upload a high-resolution product photograph.
7. Set the **In Stock** and **Feature on Homepage** toggles as desired.
8. Click **Save & Publish Product**.

### Editing Existing Products:
- Click the green **Edit** icon next to any product in the table.
- Modify the price, weight, availability, or images, and click **Save Updates**.

### Updating Inventory / Out of Stock:
- Click the **In Stock / Out of Stock** pill button in the table. The product status will instantly toggle without needing a full page reload.

---

## 3. Managing Order Enquiries (`/admin/orders`)

When a customer places an order enquiry on the website, it is immediately registered in the database:
1. Navigate to **Order Enquiries**.
2. Filter enquiries by status (`NEW`, `CONTACTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
3. Click the **WhatsApp** icon to directly open a chat with the customer using their phone number.
4. Click **Details →** to view the customer's delivery address, PIN code, and the snapshot of items ordered.
5. In the order details screen, update the order status as you progress:
   - `NEW`: Customer submitted order on site.
   - `CONTACTED`: You have initiated dialogue on WhatsApp.
   - `CONFIRMED`: Customer confirmed delivery charges and batch availability.
   - `COMPLETED`: Order dispatched and payment received.
   - `CANCELLED`: Order cancelled by customer.
6. The system logs every status transition in the **Status Audit History**.

---

## 4. Business Settings & Announcement Bar (`/admin/settings`)

The owner can modify the store's public details at any time:
- **Phone & WhatsApp:** Update the phone and WhatsApp digits to redirect order messages to a new number.
- **Announcement Bar:** Modify the top banner text (e.g. *"Festive Special: Fresh Batch of Dalle Khursani Now Available"*).
- **Homepage Heading & Subtitle:** Personalize the hero banner messaging.
- **Store Address:** Update physical location details in Siliguri.
- Click **Save All Settings** to instantly reflect changes on the live website.

---

## 5. Security & Profile (`/admin/profile`)

- Review your active account email.
- Change your master password by supplying your current password and entering a new password with at least 8 characters.
