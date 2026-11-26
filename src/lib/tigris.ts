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
