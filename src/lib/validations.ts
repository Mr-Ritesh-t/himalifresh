import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional().nullable().or(z.literal('')),
  phone: z.string().regex(/^[0-9+() -]{10,15}$/, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit PIN code'),
  landmark: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Your cart is empty'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  price: z.number().positive('Price must be greater than zero'),
  weight: z.string().min(1, 'Weight / Unit is required'),
  mainImageUrl: z.string().min(1, 'Image URL is required'),
  galleryImages: z.array(z.string()).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
});

export const businessSettingsSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  tagline: z.string().min(2, 'Tagline is required'),
  phone: z.string().min(5, 'Phone number is required'),
  whatsappNumber: z.string().min(8, 'WhatsApp number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  mapUrl: z.string().url('Must be a valid URL'),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  heroImageUrl: z.string().min(1, 'Hero image URL is required'),
  announcement: z.string().min(2, 'Announcement is required'),
  homepageHeading: z.string().min(2, 'Heading is required'),
  homepageDescription: z.string().min(2, 'Description is required'),
  socialLinks: z.string().default('{}'),
  aboutStory: z.string().min(10, 'About story is required'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
