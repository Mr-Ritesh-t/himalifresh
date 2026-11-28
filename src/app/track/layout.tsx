import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Himali Fresh',
  description:
    'Track your Himali Fresh order in real-time. View current delivery status, dispatch details, and courier tracking information.',
  alternates: {
    canonical: '/track',
  },
  openGraph: {
    title: 'Track Your Order | Himali Fresh',
    description: 'Track your authentic Himalayan product package delivery.',
    url: 'https://himalifresh.com/track',
    siteName: 'Himali Fresh',
    type: 'website',
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
