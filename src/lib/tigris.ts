import { S3Client } from '@aws-sdk/client-s3';

export function getTigrisConfig() {
  const accessKeyId =
    process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
  const secretAccessKey =
    process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
  const bucket =
    process.env.TIGRIS_STORAGE_BUCKET || process.env.AWS_BUCKET_NAME || '';
  const endpoint =
    process.env.TIGRIS_STORAGE_ENDPOINT ||
    process.env.AWS_ENDPOINT_URL_S3 ||
    'https://t3.storage.dev';

  return { accessKeyId, secretAccessKey, bucket, endpoint };
}

export function isTigrisConfigured(): boolean {
  const { accessKeyId, secretAccessKey, bucket } = getTigrisConfig();
  return Boolean(accessKeyId && secretAccessKey && bucket);
}

export function getTigrisClient(): S3Client {
  const { accessKeyId, secretAccessKey, endpoint } = getTigrisConfig();
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}
