import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getTigrisClient, getTigrisConfig, isTigrisConfigured } from '@/lib/tigris';

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

    const { bucket } = getTigrisConfig();
    const s3 = getTigrisClient();

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      })
    );

    if (!response.Body) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const bytes = await response.Body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': response.ContentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: any) {
    if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    console.error('Error serving Tigris image:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
