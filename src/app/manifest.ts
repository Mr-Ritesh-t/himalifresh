import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Himali Fresh | The Spirit of Himalayas',
    short_name: 'Himali Fresh',
    description:
      'Pure and authentic Himalayan food products, pickles, mountain teas, and organic foods sourced from Siliguri and Eastern Himalayas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F0',
    theme_color: '#064B32',
    icons: [
      {
        src: '/images/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
