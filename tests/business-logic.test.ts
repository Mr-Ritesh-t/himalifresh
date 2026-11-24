import { describe, it, expect } from 'vitest';
import { formatPrice, slugify, generateOrderNumber } from '@/lib/utils';
import { buildWhatsAppOrderMessage, generateWhatsAppUrl } from '@/lib/whatsapp';
import { checkoutSchema, productSchema, categorySchema, loginSchema } from '@/lib/validations';
import { hashPassword, verifyPassword, createAdminToken, verifyAdminToken } from '@/lib/auth';

describe('1. Utility Functions & Price Formatting', () => {
  it('formats INR prices correctly', () => {
    const formatted = formatPrice(320);
    expect(formatted).toContain('320');
  });

  it('slugifies titles with special characters accurately', () => {
    expect(slugify('Bamboo Shoot Pickle (Tama)')).toBe('bamboo-shoot-pickle-tama');
    expect(slugify('Himalayan Timur (100% Organic)')).toBe('himalayan-timur-100-organic');
    expect(slugify('  Spices & Seasonings   ')).toBe('spices-seasonings');
  });

  it('generates unique order numbers with HF- prefix', () => {
    const num1 = generateOrderNumber();
    const num2 = generateOrderNumber();
    expect(num1).toMatch(/^HF-\d{8}-\d{4}$/);
    expect(num2).toMatch(/^HF-\d{8}-\d{4}$/);
    expect(num1).not.toBe(num2);
  });
});

describe('2. WhatsApp Message & Order Formatting', () => {
  it('builds a detailed WhatsApp order enquiry message', () => {
    const message = buildWhatsAppOrderMessage({
      orderNumber: 'HF-20261120-1001',
      customerName: 'Pema Bhutia',
      phone: '9832078728',
      address: 'Near Dagapur Bridge, Hill Cart Road',
      city: 'Siliguri',
      pincode: '734003',
      landmark: 'Next to Tea Stall',
      instructions: 'Deliver after 4 PM',
      totalAmount: 700,
      items: [
        {
          name: 'Bamboo Shoot Pickle',
          weight: '400 g',
          quantity: 1,
          price: 320,
          subtotal: 320,
        },
        {
          name: 'King Chilli Pickle',
          weight: '200 g',
          quantity: 1,
          price: 380,
          subtotal: 380,
        },
      ],
    });

    expect(message).toContain('HIMALI FRESH - NEW ORDER ENQUIRY');
    expect(message).toContain('#HF-20261120-1001');
    expect(message).toContain('Pema Bhutia');
    expect(message).toContain('*Bamboo Shoot Pickle* (400 g) x 1 = ₹320');
    expect(message).toContain('*King Chilli Pickle* (200 g) x 1 = ₹380');
    expect(message).toContain('₹700');
    expect(message).toContain('Next to Tea Stall');
    expect(message).toContain('Deliver after 4 PM');
  });

  it('generates a valid, properly URL-encoded WhatsApp click-to-chat URL', () => {
    const message = 'Hello Himali Fresh';
    const url = generateWhatsAppUrl('+91 98320 78728', message);
    expect(url).toBe('https://wa.me/919832078728?text=Hello%20Himali%20Fresh');
  });
});

describe('3. Validation Schemas (Input Security & Anti-Tampering)', () => {
  it('validates correct customer checkout input', () => {
    const valid = {
      customerName: 'Sunita Pradhan',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '734001',
      landmark: null,
      instructions: null,
      items: [{ productId: 'prod-123', quantity: 2 }],
    };
    const result = checkoutSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid PIN code format', () => {
    const invalid = {
      customerName: 'Sunita Pradhan',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '7340', // only 4 digits, must be 6
      items: [{ productId: 'prod-123', quantity: 1 }],
    };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative quantities', () => {
    const invalid = {
      customerName: 'Sunita Pradhan',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '734001',
      items: [{ productId: 'prod-123', quantity: 0 }],
    };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects empty items cart', () => {
    const invalid = {
      customerName: 'Sunita Pradhan',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '734001',
      items: [],
    };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates product schema correctly', () => {
    const valid = {
      name: 'Darjeeling Tea',
      slug: 'darjeeling-tea',
      description: 'First flush organic tea',
      price: 450,
      weight: '100 g',
      mainImageUrl: '/images/tea.jpg',
      categoryId: 'cat-1',
    };
    const result = productSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects negative or zero prices', () => {
    const invalid = {
      name: 'Free Item',
      slug: 'free-item',
      description: 'Zero cost product',
      price: -50,
      weight: '100 g',
      mainImageUrl: '/images/item.jpg',
      categoryId: 'cat-1',
    };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('4. Authentication & Security Layer', () => {
  it('hashes passwords securely and verifies them', async () => {
    const raw = 'HimaliFresh@2026!';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const matches = await verifyPassword(raw, hash);
    expect(matches).toBe(true);

    const badMatches = await verifyPassword('WrongPassword', hash);
    expect(badMatches).toBe(false);
  });

  it('creates and verifies cryptographically signed JWT admin session tokens', async () => {
    const user = {
      id: 'admin-uuid-1',
      email: 'admin@himalifresh.com',
      role: 'SUPER_ADMIN',
      name: 'Store Owner',
    };

    const token = await createAdminToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verified = await verifyAdminToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(user.id);
    expect(verified?.email).toBe(user.email);
    expect(verified?.role).toBe(user.role);
  });

  it('rejects tampered JWT tokens', async () => {
    const tampered = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
    const verified = await verifyAdminToken(tampered);
    expect(verified).toBeNull();
  });
});

describe('5. Brevo Email Integration & Checkout Email Validation', () => {
  it('accepts valid email and optional null/empty email in checkoutSchema', () => {
    const withEmail = {
      customerName: 'Sunita Pradhan',
      email: 'sunita@example.com',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '734001',
      items: [{ productId: 'prod-123', quantity: 2 }],
    };
    expect(checkoutSchema.safeParse(withEmail).success).toBe(true);

    const withEmptyEmail = { ...withEmail, email: '' };
    expect(checkoutSchema.safeParse(withEmptyEmail).success).toBe(true);

    const withoutEmail = { ...withEmail, email: undefined };
    expect(checkoutSchema.safeParse(withoutEmail).success).toBe(true);
  });

  it('rejects invalid email formats in checkoutSchema', () => {
    const invalidEmail = {
      customerName: 'Sunita Pradhan',
      email: 'not-an-email',
      phone: '9832012345',
      address: 'House 45, Pradhan Nagar',
      city: 'Siliguri',
      pincode: '734001',
      items: [{ productId: 'prod-123', quantity: 2 }],
    };
    const res = checkoutSchema.safeParse(invalidEmail);
    expect(res.success).toBe(false);
  });

  it('handles missing BREVO_API_KEY gracefully without throwing errors', async () => {
    const { sendBrevoEmail } = await import('@/lib/brevo');
    const prevKey = process.env.BREVO_API_KEY;
    delete process.env.BREVO_API_KEY;

    const res = await sendBrevoEmail({
      to: [{ email: 'test@example.com' }],
      subject: 'Test Subject',
      htmlContent: '<p>Test</p>',
    });

    expect(res.success).toBe(false);
    expect(res.skipped).toBe(true);

    if (prevKey) {
      process.env.BREVO_API_KEY = prevKey;
    }
  });
});
