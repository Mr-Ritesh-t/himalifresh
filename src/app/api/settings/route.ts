import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let settings = await prisma.businessSettings.findUnique({
      where: { id: 'default-settings' },
    });

    if (!settings) {
      settings = await prisma.businessSettings.create({
        data: {
          id: 'default-settings',
          businessName: 'Himali Fresh',
          tagline: 'The Spirit of Himalayas',
          phone: '+91 74777 68499',
          whatsappNumber: '917477768499',
          email: 'himalifresh@gmail.com',
          address: 'Dagapur, Siliguri, West Bengal, India',
          mapUrl: 'https://maps.app.goo.gl/ecdT4JyhbpveKzhJ9',
          logoUrl: '/images/logo.jpg',
          heroImageUrl: '/images/hero-banner.jpg',
          announcement: 'Delivering Authentic Himalayan Products Across India',
          homepageHeading: 'Pure & Authentic Himalayan Products',
          homepageDescription: 'Traditional flavours, organic goodness and handcrafted products from the Himalayas.',
          socialLinks: '{"facebook":"https://www.facebook.com/himalifresh","instagram":"https://www.instagram.com/himalifresh/"}',
          aboutStory: 'Founded in Siliguri, at the gateway to the Eastern Himalayas...',
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}
