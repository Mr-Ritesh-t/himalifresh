import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and SVG are supported.' },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds limit of 5MB.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const ext = path.extname(file.name) || '.jpg';
    const cleanBaseName = path.basename(file.name, ext).replace(/[^\w-]/g, '');
    const filename = `${cleanBaseName || 'upload'}-${Date.now()}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Vercel Blob is configured (Production on Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, buffer, {
        access: 'public',
        contentType: file.type,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename,
      });
    }

    // If running in production (e.g. Vercel) without BLOB_READ_WRITE_TOKEN
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error:
            'Blob Storage token not found. Please Redeploy on Vercel to activate your himalifresh-blob store.',
        },
        { status: 500 }
      );
    }

    // Fallback: Local filesystem (Local development only)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
