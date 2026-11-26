import { NextRequest, NextResponse } from 'next/server';
import { getTigrisAwsClient, getTigrisObjectUrl, isTigrisConfigured } from '@/lib/tigris';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  if (!isTigrisConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  try {
    const { key: segments } = await context.params;
    const objectKey = segments.join('/');

    // Security: block path traversal and restrict to safe media prefixes
    if (
      !objectKey ||
      objectKey.includes('..') ||
      objectKey.includes('\0') ||
      !/^(products|categories)\/[a-zA-Z0-9._-]+$/.test(objectKey)
    ) {
      return NextResponse.json({ error: 'Invalid image key' }, { status: 400 });
    }

    const aws = getTigrisAwsClient();
    const res = await aws.fetch(getTigrisObjectUrl(objectKey), { method: 'GET' });

    if (res.status === 404) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    if (!res.ok) {
      console.error('Tigris GET failed:', res.status, await res.text());
      return NextResponse.json({ error: 'Failed to load image' }, { status: 502 });
    }

    const bytes = await res.arrayBuffer();

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: any) {
    console.error('Error serving Tigris image:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
