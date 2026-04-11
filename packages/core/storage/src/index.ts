// ============================================================
// @breeyard/storage — S3-compatible object storage via MinIO client
// Adapted from @artist-platform/storage
// BOUNDARY: all object storage I/O is here. Never import minio directly.
// ============================================================

import { Client as MinioClient } from 'minio';
import { createId } from '@paralleldrive/cuid2';
import path from 'path';

// ---- Types ----

export interface StorageConfig {
  readonly endPoint: string;
  readonly port: number;
  readonly useSSL: boolean;
  readonly accessKey: string;
  readonly secretKey: string;
  /** Public base URL for constructing object URLs, e.g. "https://storage.breeyard.dev" */
  readonly publicUrl: string;
}

export interface UploadResult {
  readonly key: string;
  readonly bucket: string;
  readonly url: string;
  readonly sizeBytes: number;
  readonly mimeType: string;
}

export interface StorageClient {
  readonly upload: (
    bucket: string,
    data: Buffer,
    originalName: string,
    mimeType: string,
  ) => Promise<UploadResult>;
  readonly remove: (bucket: string, key: string) => Promise<void>;
  readonly getPublicUrl: (bucket: string, key: string) => string;
  readonly ensureBucket: (bucket: string) => Promise<void>;
}

// ---- Internal helpers ----

const publicReadPolicy = (bucket: string): string =>
  JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });

const makeKey = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  return `${createId()}${ext}`;
};

const objectUrl = (publicUrl: string, bucket: string, key: string): string =>
  `${publicUrl.replace(/\/$/, '')}/${bucket}/${key}`;

// ---- Factory ----

export const createStorageClient = (config: StorageConfig): StorageClient => {
  const client = new MinioClient({
    endPoint: config.endPoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });

  const ensureBucket = async (bucket: string): Promise<void> => {
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket);
      await client.setBucketPolicy(bucket, publicReadPolicy(bucket));
    }
  };

  // BOUNDARY: MinIO object upload.
  const upload = async (
    bucket: string,
    data: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<UploadResult> => {
    await ensureBucket(bucket);
    const key = makeKey(originalName);
    await client.putObject(bucket, key, data, data.length, { 'Content-Type': mimeType });
    return {
      key,
      bucket,
      url: objectUrl(config.publicUrl, bucket, key),
      sizeBytes: data.length,
      mimeType,
    };
  };

  // BOUNDARY: MinIO object deletion.
  const remove = async (bucket: string, key: string): Promise<void> => {
    await client.removeObject(bucket, key);
  };

  const getPublicUrl = (bucket: string, key: string): string =>
    objectUrl(config.publicUrl, bucket, key);

  return { upload, remove, getPublicUrl, ensureBucket };
};

// ---- Default singleton (reads from env) ----

let _storageClient: StorageClient | null = null;

export const getStorageClient = (): StorageClient => {
  _storageClient ??= createStorageClient({
    endPoint: process.env.STORAGE_ENDPOINT ?? 'localhost',
    port: parseInt(process.env.STORAGE_PORT ?? '9000', 10),
    useSSL: process.env.STORAGE_USE_SSL === 'true',
    accessKey: process.env.STORAGE_ACCESS_KEY ?? '',
    secretKey: process.env.STORAGE_SECRET_KEY ?? '',
    publicUrl: process.env.STORAGE_PUBLIC_URL ?? 'http://localhost:9000',
  });
  return _storageClient;
};

export const MEDIA_BUCKET = 'breeyard-media';
