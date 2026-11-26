import { AwsClient } from 'aws4fetch';

export function getTigrisConfig() {
  const accessKeyId =
    process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
  const secretAccessKey =
    process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
  const bucket =
    process.env.TIGRIS_STORAGE_BUCKET || process.env.AWS_BUCKET_NAME || '';
  const endpoint = (
    process.env.TIGRIS_STORAGE_ENDPOINT ||
    process.env.AWS_ENDPOINT_URL_S3 ||
    'https://t3.storage.dev'
  ).replace(/\/$/, '');

  return { accessKeyId, secretAccessKey, bucket, endpoint };
}

export function isTigrisConfigured(): boolean {
  const { accessKeyId, secretAccessKey, bucket } = getTigrisConfig();
  return Boolean(accessKeyId && secretAccessKey && bucket);
}

export function getTigrisObjectUrl(key: string): string {
  const { bucket, endpoint } = getTigrisConfig();
  const cleanKey = key.replace(/^\//, '');
  return `${endpoint}/${bucket}/${cleanKey}`;
}

export function getTigrisAwsClient(): AwsClient {
  const { accessKeyId, secretAccessKey } = getTigrisConfig();
  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: 's3',
    region: 'auto',
  });
}

/**
 * Extracts the storage object key (e.g. "products/photo-123.jpg" or "categories/icon-456.png")
 * from an API proxy URL or direct S3/Tigris URL. Returns null for static repository assets.
 */
export function extractTigrisKey(urlOrPath: string): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;

  // Never delete static repository assets (e.g. /images/...)
  if (urlOrPath.startsWith('/images/')) {
    return null;
  }

  // Pattern 1: Proxied API URL (/api/images/products/... or /api/images/categories/...)
  const apiMatch = urlOrPath.match(/\/api\/images\/((?:products|categories)\/[^?#]+)/);
  if (apiMatch) return apiMatch[1];

  // Pattern 2: S3 / Tigris direct URL endpoint/bucket/(products|categories)/filename.ext
  const s3Match = urlOrPath.match(/(?:products|categories)\/[^?#/]+\.(?:jpe?g|png|webp|heic|heif)/i);
  if (s3Match) return s3Match[0];

  return null;
}

/**
 * Deletes an uploaded image from storage (Tigris Object Storage, Vercel Blob, or local uploads).
 * Static repository assets located in /images/ are safeguarded and never deleted.
 */
export async function deleteStoredImage(url?: string | null): Promise<boolean> {
  if (!url || typeof url !== 'string') return false;

  // 1. Safeguard repository assets (e.g. /images/herobanner.png, /images/logo.jpg)
  if (url.startsWith('/images/')) {
    return false;
  }

  // 2. Tigris Object Storage
  const tigrisKey = extractTigrisKey(url);
  if (tigrisKey && isTigrisConfigured()) {
    try {
      const aws = getTigrisAwsClient();
      const res = await aws.fetch(getTigrisObjectUrl(tigrisKey), { method: 'DELETE' });
      return res.ok || res.status === 204 || res.status === 404;
    } catch (err) {
      console.warn(`[Tigris] Failed to delete object "${tigrisKey}":`, err);
      return false;
    }
  }

  // 3. Local uploads folder (/uploads/...) when running in Node.js runtime
  if (url.startsWith('/uploads/') && typeof process !== 'undefined' && process.release?.name === 'node') {
    try {
      const { unlink } = await import('fs/promises');
      const path = await import('path');
      const localPath = path.join(process.cwd(), 'public', url);
      await unlink(localPath).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

