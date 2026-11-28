import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Store Support | Himali Fresh',
  description:
    'Contact Himali Fresh in Siliguri for customer care, order enquiries, or bulk Himalayan product orders. Call / WhatsApp +91 74777 68499 or email himalifresh@gmail.com.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Himali Fresh Customer Support',
    description:
      'Reach out to Himali Fresh for product enquiries, order assistance, or wholesale distribution.',
    url: 'https://himalifresh.com/contact',
    siteName: 'Himali Fresh',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
