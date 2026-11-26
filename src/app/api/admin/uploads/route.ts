import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getTigrisAwsClient, getTigrisObjectUrl, isTigrisConfigured } from '@/lib/tigris';

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

    // Prevent SVG uploads for security (SVGs can embed executable JavaScript / XSS)
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      return NextResponse.json(
        { success: false, error: 'SVG images are not permitted for security. Please upload JPG, PNG, or WEBP.' },
        { status: 400 }
      );
    }

    // Validate safe raster image formats (JPEG, PNG, WEBP, and HEIC)
    const isImage = file.type && file.type.startsWith('image/');
    const hasSafeExtension = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);

    if (!isImage || !hasSafeExtension) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and HEIC images are allowed.' },
        { status: 400 }
      );
    }

    // Strict size limit: 5MB maximum to ensure fast page loads and prevent storage bloat
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB limit (selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload an image under 5MB.`,
        },
        { status: 400 }
      );
    }

    // Create unique filename with reliable extension for camera captures
    let ext = path.extname(file.name);
    if (!ext || ext === '.') {
      if (file.type?.includes('png')) ext = '.png';
      else if (file.type?.includes('webp')) ext = '.webp';
      else ext = '.jpg';
    }
    const folder = (formData.get('folder') as string) === 'categories' ? 'categories' : 'products';
    const cleanBaseName = path.basename(file.name, ext).replace(/[^\w-]/g, '') || 'photo';
    const filename = `${cleanBaseName}-${Date.now()}${ext.toLowerCase()}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const contentType = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';

    // 1. Tigris Object Storage (Private bucket + cached /api/images/ proxy)
    if (isTigrisConfigured()) {
      const aws = getTigrisAwsClient();
      const key = `${folder}/${filename}`;

      const uploadRes = await aws.fetch(getTigrisObjectUrl(key), {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: bytes,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Tigris upload failed (${uploadRes.status}): ${errText}`);
      }

      return NextResponse.json({
        success: true,
        url: `/api/images/${key}`,
        filename,
      });
    }

    // In production, Tigris must be configured
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tigris Object Storage is not configured. Please check TIGRIS_STORAGE_* variables.',
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
        error: 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
